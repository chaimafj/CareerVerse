class RecommendationService:
    def get_recommendations(self, profile):
        return {
            'profile': profile.user.email,
            'recommendations': ['Data Analyst', 'Product Manager', 'UX Designer'],
        }
