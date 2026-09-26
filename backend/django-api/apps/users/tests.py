from django.contrib.auth import authenticate, get_user_model
from django.test import TestCase

User = get_user_model()


class EmailAuthTests(TestCase):
    def test_user_can_authenticate_with_email(self):
        User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='StrongPass123!'
        )

        user = authenticate(email='test@example.com', password='StrongPass123!')

        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'test@example.com')

    def test_user_can_authenticate_with_username(self):
        User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='StrongPass123!'
        )

        user = authenticate(username='testuser2', password='StrongPass123!')

        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'testuser2')
