from django.shortcuts import render
from chart.models import *
from sale_chart.common.sql_excuter import *


# Create your views here.
def home(request):
    dates = []
    months = runquery("""SELECT DISTINCT month FROM t_sale_info;""")
    for month in months:
        dates.append(month.get('month'))
    provinces = runquery("""SELECT DISTINCT province FROM t_sale_info WHERE province IS NOT NULL && province != '';""")
    prvs = []
    for province in provinces:
        prvs.append(province.get('province'))
    return render(request, 'chart/home.html', {'dates': dates, 'provinces': prvs})
