from rest_framework import serializers
from rest_framework.serializers import ValidationError
from django.contrib.auth.password_validation import validate_password
from .validators import reset_exist
from .models.user import User, Reset
from .models.firm import Firm
import pdb

class FirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Firm
        fields = ['id', 'name']

class FirmFKSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.IntegerField()

class RegisterSerializer(serializers.ModelSerializer):
    firm = FirmFKSerializer()

    password_confirm = serializers.CharField(
        style={"input_type": "password"}, 
        write_only=True,
        error_messages={'blank': 'Password confirmation cannot be blank!'}
        )

    class Meta:
        model = User
        fields = ['firm', 'email','password', 'password_confirm']
        extra_kwargs = {'password': 
                            {
                            'write_only': True,
                            'error_messages': {'blank': 'Password cannot be blank!'}
                            },
                        'firm': {'error_messages': {'blank': 'Firm cannot be blank!'}}
                        }

    def validate_email(self, email):
        user = User.objects.filter(email=email)

        if user.exists():
            message = "Email already exists!"
            raise serializers.ValidationError(message, code=400)

        return email

    def validate(self, attrs):
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


    # def update(self, instance, validated_data):
    #     pdb.set_trace()
    #     # validated_data.pop("investments", None)
    #     # instance.name = validated_data["name"]
    #     instance.save()
    #     return instance

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
        instance.save()
        return instance

