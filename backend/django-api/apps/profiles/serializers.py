from rest_framework import serializers

from apps.ai.catalog import ACADEMIC_FIELDS, INTEREST_DOMAINS, SKILLS
from .models import Profile


def missing_model_fields(profile):
    """Liste des informations du profil qui manquent encore au modèle."""
    missing = [name for name in ACADEMIC_FIELDS if getattr(profile, name) is None]
    missing += [f'self_ratings.{s}' for s in SKILLS if s not in (profile.self_ratings or {})]
    missing += [f'interest_ratings.{d}' for d in INTEREST_DOMAINS if d not in (profile.interest_ratings or {})]
    return missing


def _check_ratings(value, allowed_keys, low, high, label):
    if not isinstance(value, dict):
        raise serializers.ValidationError(f'{label} doit être un objet {{clé: note}}.')
    cleaned = {}
    for key, rating in value.items():
        if key not in allowed_keys:
            raise serializers.ValidationError(f'{label} : clé inconnue « {key} ».')
        if isinstance(rating, bool) or not isinstance(rating, (int, float)) or not low <= rating <= high:
            raise serializers.ValidationError(f'{label} : « {key} » doit être une note entre {low} et {high}.')
        cleaned[key] = int(round(rating))
    return cleaned


class ProfileSerializer(serializers.ModelSerializer):
    missing_fields = serializers.SerializerMethodField()
    completion = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'bio', 'skills', 'interests', 'university', 'study_level', 'specialty',
            'year_of_study', 'gpa_20', 'grade_math_20', 'grade_programming_20', 'grade_networks_20',
            'self_ratings', 'interest_ratings', 'missing_fields', 'completion', 'updated_at',
        ]
        read_only_fields = ['updated_at']

    def get_missing_fields(self, obj):
        return missing_model_fields(obj)

    def get_completion(self, obj):
        total = len(ACADEMIC_FIELDS) + len(SKILLS) + len(INTEREST_DOMAINS)
        return round(100 * (total - len(missing_model_fields(obj))) / total)

    def validate(self, attrs):
        for name, (low, high) in ACADEMIC_FIELDS.items():
            value = attrs.get(name)
            if value is not None and not low <= value <= high:
                raise serializers.ValidationError({name: f'Valeur attendue entre {low} et {high}.'})
        return attrs

    def validate_self_ratings(self, value):
        return _check_ratings(value, SKILLS, 0, 10, 'Auto-évaluation')

    def validate_interest_ratings(self, value):
        return _check_ratings(value, INTEREST_DOMAINS, 1, 5, 'Intérêts')
