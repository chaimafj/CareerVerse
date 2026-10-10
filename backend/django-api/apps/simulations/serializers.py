from rest_framework import serializers

from apps.ai.catalog import LAB_BY_CAREER_ID
from .models import LabAttempt


class LabAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabAttempt
        fields = [
            'id', 'lab_key', 'career_id', 'mission_count', 'missions_correct', 'score',
            'duration_seconds', 'validations', 'hints_used', 'enjoyment', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'lab_key': {'required': False}}

    def validate(self, attrs):
        # Le frontend peut envoyer seulement l'identifiant du métier : on en déduit le lab.
        if not attrs.get('lab_key'):
            lab = LAB_BY_CAREER_ID.get(attrs.get('career_id', ''))
            if not lab:
                raise serializers.ValidationError({'lab_key': "Ce lab n'est pas analysé par le modèle."})
            attrs['lab_key'] = lab['key']
        if attrs['missions_correct'] > attrs['mission_count']:
            raise serializers.ValidationError({'missions_correct': 'Ne peut pas dépasser le nombre de missions.'})
        if attrs['validations'] < attrs['mission_count']:
            raise serializers.ValidationError({'validations': 'Au moins une validation par mission est attendue.'})
        return attrs
