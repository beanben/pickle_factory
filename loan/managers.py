from django.db import models
from itertools import chain
from django.db.models import Count, Sum, Min
import pdb

class SchemeManager(models.Manager):

    def get_asset_classes(self, scheme):
        from loan.models import scheme_models
        
        subclasses = scheme_models.AssetClass.__subclasses__()
        querysets = [
            subclass.objects.filter(scheme=scheme) for subclass in subclasses
        ]
        querysets = [qs for qs in querysets if qs.exists()]
        # print("querysets[0].values()", querysets[0].values())
        return chain(*querysets)
    
# class AssetClassManager(models.Manager):

#     def group_units_by_description(self, assetclass):
#         return assetclass.units.values('description').annotate(
#             quantity=Count('id'), 
#             group_beds=Sum('beds'),
#             beds_per_unit=Sum('beds') / Count('id'),
#             group_area_size = Sum('area_size'),
#             created_at=Min('created_at'),
#             ).order_by("created_at")