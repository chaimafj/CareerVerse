from django.db import models
from apps.users.models import User


class Recommendation(models.Model):
    """Résultat d'un appel au modèle CareerNet pour un étudiant."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    ranking = models.JSONField()        # [{career, probability}, ...] pour les 9 métiers, trié
    labs_used = models.JSONField(default=list)
    model_version = models.CharField(max_length=80)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        top = self.ranking[0]['career'] if self.ranking else '-'
        return f'{self.user.email} -> {top}'
