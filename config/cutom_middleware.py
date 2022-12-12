from django.http import HttpResponsePermanentRedirect

class DomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        host = request.get_host().partition(":")[0]
        if host == "https://pickle-factory.herokuapp.com":
            response = HttpResponsePermanentRedirect("http://pickle-factory.net" + request.path)
        else:
            response = self.get_response(request)

        return response

# Source 1: https://docs.djangoproject.com/en/4.1/topics/http/middleware/
# Source 2: https://adamj.eu/tech/2020/03/02/how-to-make-django-redirect-www-to-your-bare-domain/#adding-a-middleware
