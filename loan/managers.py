from django.db import models
from itertools import chain
from django.db.models import Count, Sum

class SchemeManager(models.Manager):

    def get_asset_classes(self, scheme):
        from loan.models.scheme import AssetClass
        
        subclasses = AssetClass.__subclasses__()
        querysets = [
            subclass.objects.filter(scheme=scheme) for subclass in subclasses
        ]
        return chain(*querysets)
    
class AssetClassManager(models.Manager):

    def group_units_by_description(self, assetclass):

        return assetclass.units.values('description').annotate(
            group_quantity=Count('id'), 
            group_beds=Sum('beds'),
            group_area_size = Sum('area_size')
            )