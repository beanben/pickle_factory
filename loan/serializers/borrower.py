from rest_framework import serializers
from loan.models.borrower import Borrower
from rest_framework.serializers import ValidationError

class BorrowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Borrower
        fields = ['id', 'name', 'author_firm']

    def create(self, validated_data):
        # unique borrower per author firm
        author_firm = self.context.get("author_firm")
        qs = Borrower.objects.filter(name=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            raise ValidationError("Borrower's name must be unique")
        
        borrower = Borrower.objects.create(**validated_data)
        borrower.save()
        return borrower

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.save()
        return instance