from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView as TokenView
from django.core.mail import send_mail
from .models import User, Reset, Firm
from .serializers import (
    FirmSerializer,
    RegisterSerializer, 
    ResetSerializer, 
    ForgotSerializer,
    UserSerializer)
import pdb
import os
from sendgrid.helpers.mail import (Mail, Email,To, Content)


# <===== Firm =====>
class FirmList(generics.ListCreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Firm.objects.all()
    serializer_class = FirmSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'firm created',
            'response': response.data
        })


class FirmDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    queryset = Firm.objects.all()
    serializer_class = FirmSerializer

# <===== User =====> 
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'user created',
            'response': response.data
        })

class TokenObtainPairView(TokenView):

    def post(self, request, *args, **kwargs):
        serializer = TokenObtainPairSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            data = {
                'response': serializer.validated_data,
                'status': 'success',
            }
            return Response(data, status=status.HTTP_200_OK)

        data = {
            'response': serializer.errors,
            'status': 'error',
        }
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)

class ForgotAPIView(APIView):
    permission_classes = [AllowAny]

    def create_reset(self, token, email):
        reset = Reset.objects.filter(token=token)

        # delete reset if it exist
        if reset.exists():
            reset.delete()
        
        # create reset object
        Reset.objects.create(email=email,token=token)

    def create_token(self, email):
        user = User.objects.get(email=email)
        token, created = Token.objects.get_or_create(user=user)
        return token

    def post(self, request):
        serializer = ForgotSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data["email"]
            token = self.create_token(email)
            self.create_reset(token, email)

            # amend protocol if project runs locally
            local_urls = ['127.0.0.1', 'localhost', '0.0.0.0']
            address = request.get_host().partition(":")[0]
            protocol = 'http' if address in local_urls else 'https'


            host = request.get_host()
            url = f'{protocol}://{host}/auth/reset/{token}'
            message = f'Click <a href="{url}"> here </a> to reset your password'

            send_mail(
                subject='Reset your password',
                message=message,
                from_email= os.environ.get('EMAIL_SENDER'),
                recipient_list=[email],
                # auth_user='Pickle Factory Team',
                html_message=message
            )

            data = {
                'status': 'success', 
                'message': 'email sent'
                }
            return Response(data, status=status.HTTP_200_OK)

        data = {
            'response': serializer.errors,
            'status': 'error',
        }
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        

class ResetAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["token"]
            data = {
                'response': serializer.data,
                'token': token,
                'status': 'success',
                'message': '****'
            }
            return Response(data, status=status.HTTP_200_OK)
              
        data = {
            'response': serializer.errors,
            'status': 'error',
            'message': '****'
        }
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


class UserAPIView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserUpdateAPIView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
