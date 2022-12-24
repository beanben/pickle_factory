from core import models

class AuthorQuerySetMixin():
    
    def get_queryset(self, *args, **kwargs):
        lookup_data = {
            'author_firm': self.request.user.firm
        }
        qs = super().get_queryset(*args, **kwargs)
        return qs.filter(**lookup_data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"author_firm": self.request.user.firm})
        return context
    
    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
            author_firm = self.request.user.firm
            )

    def perform_update(self, serializer):
        serializer.save(
            author=self.request.user
            )