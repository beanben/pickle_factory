from rest_framework import serializers
from loan.fields import CamelToSnakeCaseCharField

class ChoicesSerializer(serializers.Serializer):
    value = CamelToSnakeCaseCharField()
    label = serializers.CharField()

class SerializerFieldsSerializer(serializers.Serializer):
    field = CamelToSnakeCaseCharField()