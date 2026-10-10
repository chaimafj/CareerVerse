from django.test import TestCase
from rest_framework.test import APIClient

from apps.ai.catalog import INTEREST_DOMAINS, SKILLS
from apps.ai.predictor import get_predictor
from apps.recommendations.services import lab_features
from apps.simulations.models import LabAttempt

SECURITY_PROFILE = {
    'year_of_study': 5, 'gpa_20': 13.6, 'grade_math_20': 12.0,
    'grade_programming_20': 13.5, 'grade_networks_20': 17.0,
    'self_ratings': dict(zip(SKILLS, [5, 5, 9, 4, 5, 8, 9, 5, 3, 3, 4, 8, 5])),
    'interest_ratings': dict(zip(INTEREST_DOMAINS, [2, 1, 3, 5, 2])),
}


class PredictorTests(TestCase):
    def test_same_result_as_research_code(self):
        """examples/student_security.json donne 98,8 % Cybersecurity avec predict.py du projet DL."""
        static = {k: v for k, v in SECURITY_PROFILE.items() if not isinstance(v, dict)}
        static.update({f'self_{k}': v for k, v in SECURITY_PROFILE['self_ratings'].items()})
        static.update({f'interest_{k}': v for k, v in SECURITY_PROFILE['interest_ratings'].items()})
        static['n_labs_done'] = 2
        labs = {
            'lab_security_ctf': {'score': 96, 'time_min': 28, 'attempts': 1, 'hints_used': 0, 'enjoyment_1_5': 5},
            'lab_network_config': {'score': 82, 'time_min': 38, 'attempts': 2, 'hints_used': 1, 'enjoyment_1_5': 4},
        }
        ranking = get_predictor().predict(static, labs)
        self.assertEqual(len(ranking), 9)
        self.assertEqual(ranking[0]['career'], 'Cybersecurity Analyst')
        self.assertAlmostEqual(ranking[0]['probability'], 0.988, places=3)
        self.assertAlmostEqual(sum(r['probability'] for r in ranking), 1.0, places=3)

    def test_lab_features_are_mapped_to_training_scale(self):
        attempt = LabAttempt(mission_count=3, score=80, duration_seconds=360, validations=5,
                             hints_used=1, enjoyment=4)
        f = lab_features(attempt)
        self.assertEqual(f['time_min'], 45.0)   # 6 min pour 3 missions = rythme de référence
        self.assertEqual(f['attempts'], 2)      # 5 validations / 3 missions
        attempt.duration_seconds = 10
        self.assertEqual(lab_features(attempt)['time_min'], 10.0)  # borné comme à l'entraînement


class RecommendationFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        r = self.client.post('/api/auth/register/', {
            'username': 'amira', 'email': 'amira@example.com', 'first_name': 'Amira', 'last_name': 'B',
            'password': 'StrongPass123!', 'password_confirm': 'StrongPass123!',
        }, format='json')
        self.assertEqual(r.status_code, 201)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + r.data['token'])

    def test_requires_authentication(self):
        anonymous = APIClient()
        self.assertEqual(anonymous.get('/api/profile/').status_code, 401)
        self.assertEqual(anonymous.post('/api/recommendations/').status_code, 401)

    def test_incomplete_profile_is_refused_with_missing_fields(self):
        r = self.client.post('/api/recommendations/')
        self.assertEqual(r.status_code, 400)
        self.assertIn('gpa_20', r.data['missing_fields'])
        self.assertEqual(len(r.data['missing_fields']), 5 + 13 + 5)

    def test_profile_validation(self):
        r = self.client.put('/api/profile/', {'gpa_20': 25}, format='json')
        self.assertEqual(r.status_code, 400)
        r = self.client.put('/api/profile/', {'self_ratings': {'cooking': 5}}, format='json')
        self.assertEqual(r.status_code, 400)
        r = self.client.put('/api/profile/', {'interest_ratings': {'security': 0}}, format='json')
        self.assertEqual(r.status_code, 400)

    def test_full_flow(self):
        r = self.client.put('/api/profile/', SECURITY_PROFILE, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['completion'], 100)

        r = self.client.post('/api/labs/attempts/', {
            'career_id': 'cybersecurity-analyst', 'mission_count': 3, 'missions_correct': 3,
            'score': 95, 'duration_seconds': 300, 'validations': 3, 'hints_used': 0, 'enjoyment': 5,
        }, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data['lab_key'], 'lab_security_ctf')

        r = self.client.post('/api/labs/attempts/', {
            'career_id': 'ux-researcher', 'mission_count': 3, 'missions_correct': 3,
            'score': 95, 'duration_seconds': 300, 'validations': 3, 'hints_used': 0, 'enjoyment': 5,
        }, format='json')
        self.assertEqual(r.status_code, 400)  # lab non connu du modèle

        r = self.client.get('/api/labs/attempts/')
        self.assertEqual(r.data['labs_done'], 1)

        r = self.client.post('/api/recommendations/')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(len(r.data['top_careers']), 3)
        self.assertEqual(r.data['top_careers'][0]['career'], 'Cybersecurity Analyst')
        self.assertEqual(r.data['labs_used'], ['lab_security_ctf'])

        r = self.client.get('/api/recommendations/')
        self.assertEqual(r.data['top_careers'][0]['career'], 'Cybersecurity Analyst')
