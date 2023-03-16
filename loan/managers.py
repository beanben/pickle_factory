from django.db import models
from itertools import chain
from django.db.models import Count, Sum

class SchemeManager(models.Manager):

    def get_asset_classes(self, scheme):
        from loan.models import scheme_models
        
        subclasses = scheme_models.AssetClass.__subclasses__()
        querysets = [
            subclass.objects.filter(scheme=scheme) for subclass in subclasses
        ]
        return chain(*querysets)
    
class AssetClassManager(models.Manager):

    def group_units_by_description(self, assetclass):

        return assetclass.units.values('description').annotate(
            quantity=Count('id'), 
            beds=Sum('beds'),
            area_size = Sum('area_size')
            )