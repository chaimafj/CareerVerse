from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.insights import profile_vs_labs
from apps.ai.predictor import ModelUnavailable
from apps.profiles.models import Profile
from apps.results.models import Recommendation
from apps.simulations.views import latest_attempts
from .services import ProfileIncomplete, RecommendationService


class ProfileInsightsView(APIView):
    """Pour chaque lab fait : le résultat confirme-t-il l'auto-évaluation ? Quelles compétences renforcer ?"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        scores = {key: a.score for key, a in latest_attempts(request.user).items()}
        return Response(profile_vs_labs(profile.self_ratings, scores))


def serialize(rec):
    return {
        'id': rec.id,
        'top_careers': rec.ranking[:3],
        'ranking': rec.ranking,
        'labs_used': rec.labs_used,
        'model_version': rec.model_version,
        'created_at': rec.created_at,
    }


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Dernière recommandation calculée (null s'il n'y en a pas encore)."""
        rec = Recommendation.objects.filter(user=request.user).first()
        return Response(serialize(rec) if rec else None)

    def post(self, request):
        """Lance le modèle sur le profil et les labs actuels de l'étudiant."""
        try:
            rec = RecommendationService().recommend(request.user)
        except ProfileIncomplete as exc:
            return Response(
                {'detail': 'Complétez votre questionnaire avant de lancer l’analyse.', 'missing_fields': exc.missing},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ModelUnavailable as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(serialize(rec), status=status.HTTP_201_CREATED)
