"""Construit l'entrée du modèle CareerNet à partir des données de la plateforme."""
from apps.ai.catalog import (ACADEMIC_FIELDS, INTEREST_DOMAINS, REFERENCE_SECONDS_PER_MISSION,
                             REFERENCE_TRAINING_MINUTES, SKILLS)
from apps.ai.predictor import MODEL_VERSION, get_predictor
from apps.profiles.models import Profile
from apps.profiles.serializers import missing_model_fields
from apps.results.models import Recommendation
from apps.simulations.views import latest_attempts


class ProfileIncomplete(Exception):
    def __init__(self, missing):
        super().__init__('Profil incomplet')
        self.missing = missing


def lab_features(attempt):
    """Convertit une tentative réelle en mesures sur l'échelle d'entraînement du modèle."""
    expected_seconds = REFERENCE_SECONDS_PER_MISSION * attempt.mission_count
    time_min = REFERENCE_TRAINING_MINUTES * attempt.duration_seconds / expected_seconds
    return {
        'score': attempt.score,
        'time_min': min(150.0, max(10.0, time_min)),
        'attempts': max(1, round(attempt.validations / attempt.mission_count)),
        'hints_used': attempt.hints_used,
        'enjoyment_1_5': attempt.enjoyment,
    }


class RecommendationService:
    def build_inputs(self, user):
        profile, _ = Profile.objects.get_or_create(user=user)
        missing = missing_model_fields(profile)
        if missing:
            raise ProfileIncomplete(missing)

        labs = {key: lab_features(a) for key, a in latest_attempts(user).items()}
        static = {name: getattr(profile, name) for name in ACADEMIC_FIELDS}
        static.update({f'self_{s}': profile.self_ratings[s] for s in SKILLS})
        static.update({f'interest_{d}': profile.interest_ratings[d] for d in INTEREST_DOMAINS})
        static['n_labs_done'] = len(labs)
        return static, labs

    def recommend(self, user):
        static, labs = self.build_inputs(user)
        ranking = get_predictor().predict(static, labs)
        return Recommendation.objects.create(
            user=user, ranking=ranking, labs_used=sorted(labs), model_version=MODEL_VERSION,
        )
