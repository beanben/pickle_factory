from core import models
from rest_framework import serializers

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
        
# class ChoiceFieldSerializerMixin(serializers.ModelSerializer):
#     """
#     This is a mixin that includes a to_representation method adding the display value
#     for all choice fields to the serialized output.
#     """

#     def to_representation(self, instance):
#         rep = super().to_representation(instance)
#         for field in self.fields:
#             if isinstance(self.fields[field], serializers.ChoiceField):
#                 method_name = f'get_{field}_display'
#                 if hasattr(instance, method_name):
#                     rep[f'{field}_display'] = getattr(instance, method_name)()
#         return rep