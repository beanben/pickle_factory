from django.http import HttpResponsePermanentRedirect

class DomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):      
        host = request.get_host().partition(":")[0]

        # if host == "pickle-factory.herokuapp.com":
        if host != "pickle-factory.net":
            return HttpResponsePermanentRedirect("https://pickle-factory.net" + request.path)
        
        return self.get_response(request)
