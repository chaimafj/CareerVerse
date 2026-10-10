from django.db import models
from apps.users.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)

    university = models.CharField(max_length=200, blank=True)
    study_level = models.CharField(max_length=100, blank=True)
    specialty = models.CharField(max_length=200, blank=True)

    # Données utilisées par le modèle CareerNet
    year_of_study = models.PositiveSmallIntegerField(null=True, blank=True)
    gpa_20 = models.FloatField(null=True, blank=True)
    grade_math_20 = models.FloatField(null=True, blank=True)
    grade_programming_20 = models.FloatField(null=True, blank=True)
    grade_networks_20 = models.FloatField(null=True, blank=True)
    self_ratings = models.JSONField(default=dict, blank=True)      # {compétence: 0-10}
    interest_ratings = models.JSONField(default=dict, blank=True)  # {domaine: 1-5}

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
