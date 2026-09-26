from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        UserModel = get_user_model()

        if email is None and username is None:
            return None

        login_value = email or username
        if not login_value or not password:
            return None

        try:
            user = UserModel.objects.get(email__iexact=login_value)
        except UserModel.DoesNotExist:
            try:
                user = UserModel.objects.get(username__iexact=login_value)
            except UserModel.DoesNotExist:
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
