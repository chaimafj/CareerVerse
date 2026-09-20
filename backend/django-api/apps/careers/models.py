from django.db import models


class Career(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    skills_required = models.JSONField(default=list, blank=True)
    domain = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
