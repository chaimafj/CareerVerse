from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.ai.catalog import LABS
from apps.users.models import User


class LabAttempt(models.Model):
    """Un passage complet d'un Career Lab (toutes ses missions) par un étudiant."""

    LAB_CHOICES = [(lab['key'], lab['title']) for lab in LABS]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_attempts')
    lab_key = models.CharField(max_length=40, choices=LAB_CHOICES)
    career_id = models.CharField(max_length=80, blank=True)
    mission_count = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    missions_correct = models.PositiveSmallIntegerField(default=0)
    score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    duration_seconds = models.PositiveIntegerField()
    validations = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    hints_used = models.PositiveSmallIntegerField(default=0)
    enjoyment = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} - {self.lab_key} ({self.score:.0f})'
