from django.http import HttpResponsePermanentRedirect

class DomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        
        host = request.get_host().partition(":")[0]

        # print("host:", host)
        # print('host == "pickle-factory.herokuapp.com"', host == "pickle-factory.herokuapp.com")
        # return self.get_response(request)

        # if host == "pickle-factory.herokuapp.com":
        if host != "pickle-factory.net":
            return HttpResponsePermanentRedirect("https://pickle-factory.net" + request.path)
        
        return self.get_response(request)



# Source 1: https://docs.djangoproject.com/en/4.1/topics/http/middleware/
# Source 2: https://adamj.eu/tech/2020/03/02/how-to-make-django-redirect-www-to-your-bare-domain/#adding-a-middleware
