from django.http import HttpResponsePermanentRedirect
import json
import pdb

class DomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):      
        host = request.get_host().partition(":")[0]
        if host != "pickle-factory.net":
            return HttpResponsePermanentRedirect("https://pickle-factory.net" + request.path)
        
        return self.get_response(request)

# class CameltoSnakeMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         if request.method in ['POST', 'PUT', 'PATCH'] :
#             request.body = self.camel_to_snake(request.body.decode('utf-8'))

#         response = self.get_response(request)

#         # pdb.set_trace()

#         if response.status_code in [200, 201] and response.get('Content-Type') == 'application/json':
#             response.data = json.loads(self.snake_to_camel(response.content.decode('utf-8')))
#             response.content = json.dumps(response.data).encode('utf-8')

#         return response

#     def snake_to_camel(self, data):
#         if not data:
#             return data
        
#         new_data = {}
#         for key, value in data.items():
#             new_data[self.to_camel_case(key)] = value

#         return new_data

#     def camel_to_snake(self, data):
#         if not data:
#             return data

#         new_data = {}
#         data = json.loads(data)
#         for key, value in data.items():
#             new_data[self.to_snake_case(key)] = value

#         return json.dumps(new_data)

#     def to_camel_case(self, snake_str):
#         components = snake_str.split('_')
#         return components[0] + ''.join(x.title() for x in components[1:])

#     def to_snake_case(self, camel_str):
#         return ''.join(['_' + char.lower() if char.isupper() else char for char in camel_str])
