from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.catalog import LABS
from .models import LabAttempt
from .serializers import LabAttemptSerializer


def latest_attempts(user):
    """Dernière tentative de chaque lab : c'est elle qui est donnée au modèle."""
    latest = {}
    for attempt in LabAttempt.objects.filter(user=user):  # trié du plus récent au plus ancien
        latest.setdefault(attempt.lab_key, attempt)
    return latest


class LabCatalogView(APIView):
    def get(self, request):
        return Response(LABS)


class LabAttemptListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest = latest_attempts(request.user)
        return Response({
            'labs_done': len(latest),
            'labs_total': len(LABS),
            'latest': {key: LabAttemptSerializer(a).data for key, a in latest.items()},
            'history': LabAttemptSerializer(LabAttempt.objects.filter(user=request.user)[:50], many=True).data,
        })

    def post(self, request):
        serializer = LabAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
