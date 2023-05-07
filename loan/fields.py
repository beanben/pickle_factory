from rest_framework.fields import CharField
from .utils import camel_to_snake, snake_to_camel
from dateutil.parser import parse
from rest_framework.fields import DateField

class CamelToSnakeCaseCharField(CharField):
    def to_internal_value(self, data):
        data = camel_to_snake(data)
        return super().to_internal_value(data)
    
    def to_representation(self, value):
        value = super().to_representation(value)
        return snake_to_camel(value)
    

class AngularDateField(DateField):
    def to_internal_value(self, data):
        # Convert the date from the Angular format to a Python datetime object
        data = parse(data)
        return super().to_internal_value(data.date())

    # def to_representation(self, value):
    #     value = super().to_representation(value)
    #     # Convert the Python datetime object back to the Angular format
    #     return value.isoformat()