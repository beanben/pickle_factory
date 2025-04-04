from rest_framework import serializers
from rest_framework.serializers import ValidationError
from django.contrib.auth.password_validation import validate_password
from .validators import reset_exist
from .models import User, Reset, Firm
import pdb

class FirmSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    
    class Meta:
        model = Firm
        fields = ['id', 'name']

    def create(self, validated_data):
        firm = Firm.objects.filter(name__iexact=validated_data["name"])
        
        if firm.exists():
            firm_name = firm.first()
            firm = Firm.objects.get(name=firm_name)
            return firm
        else:
            return Firm.objects.create(name=validated_data["name"])

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance


class FirmFKSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.IntegerField()

class RegisterSerializer(serializers.ModelSerializer):
    firm = FirmFKSerializer()
    email = serializers.EmailField(required=False)
    password = serializers.CharField(
        style={"input_type": "password"}, 
        write_only=True,
        required=False)
    password_confirm = serializers.CharField(
        style={"input_type": "password"}, 
        write_only=True,
        required=False)
    

    class Meta:
        model = User
        fields = ['firm', 'email','password', 'password_confirm']

    def validate_email(self, email):
        user = User.objects.filter(email=email)

        if user.exists():
            data = {
                'status': 'error',
                'message': 'Email already exists!'
                }
            raise ValidationError(data, code=400)

        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            data = {
                'status': 'error',
                'message': 'Passwords do not match.'
                }
            raise ValidationError(data, code=400)

        return attrs


    def create(self, validated_data):
        # replace dict with firm details with actual firm instance
        firm_id = validated_data.pop('firm')['id']
        firm = Firm.objects.get(id=firm_id)
        validated_data['firm'] = firm

        validated_data.pop('password_confirm')

        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])

        user.save()
        return user

class ForgotSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate_email(self, email):
        user = User.objects.filter(email=email)

        if not user.exists():
            data = {
                'status': 'error',
                'message': 'User with this email does not exist'
                }
            raise ValidationError(data, code=400)

        return email

class ResetSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)
    # token = serializers.CharField(max_length=255, validators=[reset_exist])
    password = serializers.CharField(max_length=255)
    password_confirm = serializers.CharField(max_length=255)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            data = {
                'status': 'error',
                'message': 'passwords do not match'
                }
            raise ValidationError(data, code=400)

        reset = Reset.objects.filter(token=attrs["token"])
        # pdb.set_trace()
        if not reset.exists():
            data = {
                'status': 'error',
                'message': 'invalid link, resend the request email!'
                }
            raise ValidationError(data, code=400)
        
        reset = Reset.objects.get(token=attrs["token"])
        user = User.objects.filter(email=reset.email)
        if not user.exists():
            data = {
                'status': 'error',
                'message': 'user not found!'
                }
            raise ValidationError(data, code=400)

        # success
        user = User.objects.get(email=reset.email)
        user.set_password(attrs["password"])
        user.save()
        reset.delete()
        return attrs


class UserSerializer(serializers.ModelSerializer):
    firm = FirmSerializer()
    
    class Meta:
        model = User
        fields = [
            'pk',
            'first_name',
            'last_name',
            'email',
            'firm'
            ]

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)

        # update firm name
        firm = Firm.objects.get(pk = instance.firm.pk)
        firm.name = validated_data.get('firm_name', instance.firm.name)
        firm.save()

        instance.save()
        return instance

