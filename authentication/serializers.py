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

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError({"firm": "this field is required"})

        return attrs

    def create(self, validated_data):
        # ensure capitalisation is kept
        firm = Firm.objects.filter(name__iexact=validated_data["name"])
        if firm.exists():
            return firm
        else:
            return Firm.objects.create(name=validated_data["name"])
        # name = validated_data['name'].lower()
        # firm, created = Firm.objects.get_or_create(name=name) #to ensure no duplicates
        return firm

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
            message = "Email already exists!"
            raise serializers.ValidationError(message, code=400)

        return email

    def validate(self, attrs):
        fields_required = ['password', 'password_confirm', 'email']

        if 'password' not in attrs :
            raise serializers.ValidationError({"password": "this field is required"})

        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

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
            message = "User with this email does not exist"
            raise serializers.ValidationError(message, code=400)

        return email

class ResetSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, validators=[reset_exist])
    password = serializers.CharField(max_length=255)
    password_confirm = serializers.CharField(max_length=255)

    def validate(self, data):
        password = data["password"]
        password_confirm = data["password_confirm"]
        token = data["token"]

        if password != password_confirm:
            data = {
                'status': 'error',
                'message': 'passwords do not match'
                }
            raise ValidationError(data, code=400)

        reset = Reset.objects.filter(token=token)
        if not reset.exists():
            data = {
                'status': 'error',
                'message': 'invalid link, resend the request email!'
                }
            raise ValidationError(data, code=400)

        reset = Reset.objects.get(token=token)
        user = User.objects.filter(email=reset.email)
        if not user.exists():
            data = {
                'status': 'error',
                'message': 'user not found!'
                }
            raise ValidationError(data, code=400)

        # success
        user = User.objects.get(email=reset.email)
        user.set_password(password)
        user.save()
        reset.delete()
        
        return data


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

