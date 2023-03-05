from django.db import models
from itertools import chain

class SchemeManager(models.Manager):

    def get_asset_classes(self, scheme):
        from loan.models.scheme import AssetClass
        
        subclasses = AssetClass.__subclasses__()
        querysets = [
            subclass.objects.filter(scheme=scheme) for subclass in subclasses
        ]
        return chain(*querysets)