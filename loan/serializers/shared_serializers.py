from rest_framework import serializers

class ChoicesSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()