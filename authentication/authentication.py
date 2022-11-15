from rest_framework.authentication import TokenAuthentication as BaseTokenAuth
from config.settings import SIMPLE_JWT

class TokenAuthentication(BaseTokenAuth):
    keyword = SIMPLE_JWT["AUTH_HEADER_TYPES"][0]