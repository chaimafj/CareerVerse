from django.urls import path
from apps.users.views import AuthLoginView, AuthRegisterView, UserHealthView

urlpatterns = [
    path('health/', UserHealthView.as_view(), name='health'),
    path('auth/login/', AuthLoginView.as_view(), name='auth-login'),
    path('auth/register/', AuthRegisterView.as_view(), name='auth-register'),
]
