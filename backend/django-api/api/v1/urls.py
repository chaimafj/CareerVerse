from django.urls import path
from apps.profiles.views import MyProfileView
from apps.recommendations.views import ProfileInsightsView, RecommendationView
from apps.simulations.views import LabAttemptListView, LabCatalogView
from apps.users.views import AuthLoginView, AuthLogoutView, AuthRegisterView, MeView, UserHealthView

urlpatterns = [
    path('health/', UserHealthView.as_view(), name='health'),
    path('auth/login/', AuthLoginView.as_view(), name='auth-login'),
    path('auth/register/', AuthRegisterView.as_view(), name='auth-register'),
    path('auth/logout/', AuthLogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('profile/', MyProfileView.as_view(), name='my-profile'),
    path('labs/', LabCatalogView.as_view(), name='lab-catalog'),
    path('labs/attempts/', LabAttemptListView.as_view(), name='lab-attempts'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('insights/', ProfileInsightsView.as_view(), name='profile-insights'),
]
