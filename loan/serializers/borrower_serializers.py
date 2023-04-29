from rest_framework import serializers
from rest_framework.serializers import ValidationError
from loan.models.borrower_models import Borrower

class BorrowerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Borrower
        fields = ['id', 'name']
        depth = 1


    def create(self, validated_data):
        # unique borrower per author firm
        author_firm = self.context.get("author_firm")
        qs = Borrower.objects.filter(name=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            raise ValidationError("Borrower's name must be unique")
        
        borrower = Borrower.objects.create(**validated_data)
        return borrower

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]

        instance.save()
        return instance