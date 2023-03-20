from .models import Reset
from rest_framework import serializers
import pdb

def reset_exist(token):
    # pdb.set_trace()
    reset = Reset.objects.filter(token=token)
    # pdb.set_trace()
    if not reset.exists():
        data = {
            'status': 'error',
            'message': 'this link is no longer valid, please request a new one'
            }
        raise serializers.ValidationError(data, code=400)

    return token