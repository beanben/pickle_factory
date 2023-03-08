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
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.exceptions import AuthenticationFailed


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

        try:
            if serializer.is_valid():
                response = serializer.validated_data
                status_flag = 'success'
                message = status_flag
                status_code = status.HTTP_200_OK
            else:
                response = serializer.errors
                status_flag = 'error'
                message = 'bad request'
                status_code = status.HTTP_400_BAD_REQUEST
        except AuthenticationFailed:
            response = {"login": "authentication failed"}
            status_flag = 'error'
            message = 'authentication failed'
            status_code = status.HTTP_401_UNAUTHORIZED

        
        data = {
            'response': response,
            'status': status_flag,
            'message': message
        }
        return Response(data, status=status_code)

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
        template_name = 'authentication/reset_email.html'

        # if serializer.is_valid(raise_exception=True):
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            token = self.create_token(email)
            self.create_reset(token, email)

            # amend protocol if project runs locally
            local_urls = ['127.0.0.1', 'localhost', '0.0.0.0']
            address = request.get_host().partition(":")[0]
            protocol = 'http' if address in local_urls else 'https'


            host = request.get_host()
            home_page = f'{protocol}://{host}'
            url = f'{protocol}://{host}/auth/reset/{token}'
            html_message=render_to_string(template_name, {'url': url, 'home_page': home_page})
            message = strip_tags(html_message)

            send_mail(
                subject='password reset',
                message=message,
                from_email= f"Pickle Factory Team <{os.environ.get('EMAIL_SENDER')}>",
                recipient_list=[email],
                html_message=html_message
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
        serializer.is_valid(raise_exception=True)
        # token = serializer.validated_data["token"]
        data = {
            'response': serializer.data,
            # 'token': token,
            'status': 'success',
            'message': 'password reset!'
        }
        return Response(data, status=status.HTTP_200_OK)
              
        # data = {
        #     'response': serializer.errors,
        #     'status': 'error',
        #     'message': '****'
        # }
        # return Response(data, status=status.HTTP_400_BAD_REQUEST)


class UserAPIView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserUpdateAPIView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
