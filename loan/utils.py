from dateutil.relativedelta import relativedelta
from datetime import date
import re

def get_months_difference(start_date: date, end_date: date) -> float:
    delta = relativedelta(end_date, start_date)
    return delta.years * 12 + delta.months + delta.days / 30.0

def camel_to_snake(camel_case_str):
    return re.sub('([A-Z]+)', r'_\1', camel_case_str).lower()
