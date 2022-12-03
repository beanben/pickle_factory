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
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# import os
# import sendgrid
# import os
# from sendgrid.helpers.mail import *


# <===== Firm =====>
class FirmList(generics.ListCreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Firm.objects.all()
    serializer_class = FirmSerializer


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
            'data': response.data
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

            send_mail('Subject here', 'Here is the message.', 'base_kh@hotmail.com', [email], fail_silently=False)

            # send emails
            url = f'http://127.0.0.1:8000/auth/reset/{token}' #development
            # url = f'https://pickle-factory.herokuapp.com/auth/reset/{token}' #production

            # send_mail(
            #     subject='Reset your password',
            #     message=f'Click <a href="{url}" > here </a> to reset your password',
            #     from_email='base_kh@hotmail.com',
            #     recipient_list=[email]
            # )
            # print('email:', email)
            # print("os.environ.get('SENDGRID_API_KEY');", os.environ.get('SENDGRID_API_KEY'))
            # sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
            # from_email = Email("test@example.com")
            # to_email = To("base_kh@hotmail.com")
            # subject = "Sending with SendGrid is Fun"
            # content = Content("text/plain", "and easy to do anywhere, even with Python")
            # mail = Mail(from_email, to_email, subject, content)
            # response = sg.client.mail.send.post(request_body=mail.get())
            # print(response.status_code)
            # print(response.body)
            # print(response.headers)
            # message = Mail(
            #     from_email='from_email@example.com',
            #     to_emails=(email),
            #     subject='Sending with Twilio SendGrid is Fun',
            #     html_content=f'Click <a href="{url}" > here </a> to reset your password'
            # )
            # try:
            #     sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            #     response = sg.send(message)
            #     print(response.status_code)
            #     print(response.body)
            #     print(response.headers)
            # except Exception as e:
            #     print(e.message)

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
