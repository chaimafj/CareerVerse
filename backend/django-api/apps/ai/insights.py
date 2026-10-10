"""Compare l'auto-évaluation de l'étudiant à ce que montrent ses Career Labs.

Pour chaque lab fait :
  - score attendu : ce qu'un étudiant aurait dû obtenir s'il avait vraiment le niveau qu'il déclare
    (même formule que la simulation qui a servi à entraîner le modèle) ;
  - niveau estimé : le niveau de compétence que le score obtenu laisse supposer (formule inversée).
Un grand écart signale une compétence surestimée (à renforcer) ou sous-estimée.
Ce module n'utilise pas torch.
"""
import math

from .catalog import LAB_SCORE_CENTER, LAB_SCORE_SLOPE, LAB_SKILLS, LABS, SKILL_LABELS

LAB_GAP_POINTS = 25     # écart de score (sur 100) au-delà duquel le lab contredit le profil
SKILL_GAP_LEVELS = 3    # écart de niveau (sur 10) au-delà duquel une compétence est signalée
MAIN_SKILL_WEIGHT = 0.2  # on ne commente que les compétences qui pèsent vraiment dans le lab

LAB_BY_KEY = {lab['key']: lab for lab in LABS}


def expected_score(level):
    return 100 / (1 + math.exp(-(level - LAB_SCORE_CENTER) * LAB_SCORE_SLOPE))


def implied_level(score):
    p = min(0.97, max(0.03, score / 100))
    return min(10.0, max(0.0, LAB_SCORE_CENTER + math.log(p / (1 - p)) / LAB_SCORE_SLOPE))


def lab_insight(lab_key, score, self_ratings):
    weights = LAB_SKILLS[lab_key]
    declared = sum(w * self_ratings.get(skill, 5) for skill, w in weights.items())
    expected = expected_score(declared)
    measured = implied_level(score)
    gap = score - expected

    skills = []
    for skill, w in sorted(weights.items(), key=lambda kv: -kv[1]):
        if w < MAIN_SKILL_WEIGHT or skill not in self_ratings:
            continue
        diff = self_ratings[skill] - measured
        if abs(diff) >= SKILL_GAP_LEVELS:
            skills.append({
                'skill': skill,
                'label': SKILL_LABELS[skill],
                'self_rating': self_ratings[skill],
                'estimated_level': round(measured, 1),
                'direction': 'overestimated' if diff > 0 else 'underestimated',
            })

    if gap <= -LAB_GAP_POINTS:
        status = 'overestimated'
    elif gap >= LAB_GAP_POINTS:
        status = 'underestimated'
    else:
        status = 'consistent'
    return {
        'lab_key': lab_key,
        'career': LAB_BY_KEY[lab_key]['career'],
        'career_id': LAB_BY_KEY[lab_key]['career_id'],
        'score': round(score, 1),
        'expected_score': round(expected, 1),
        'status': status,
        'skills': skills if status != 'consistent' else [],
    }


def profile_vs_labs(self_ratings, attempts_by_lab):
    """attempts_by_lab : {lab_key: score}. Renvoie d'abord les labs qui contredisent le plus le profil."""
    items = [lab_insight(key, score, self_ratings or {}) for key, score in attempts_by_lab.items()]
    return sorted(items, key=lambda i: abs(i['score'] - i['expected_score']), reverse=True)

