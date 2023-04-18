from dateutil.relativedelta import relativedelta
from datetime import date

def get_months_difference(start_date: date, end_date: date) -> float:
    delta = relativedelta(end_date, start_date)
    return delta.years * 12 + delta.months + delta.days / 30.0
