from .models import Reset
from rest_framework import serializers

def reset_exist(token):
    reset = Reset.objects.filter(token=token)

    if not reset.exists():
        data = {
            'status': 'error',
            'message': 'this link is no longer valid, please request a new one'
            }
        raise serializers.ValidationError(data, code=400)

    return token