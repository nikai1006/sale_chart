#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Name: data_api.py
Author: nikai
Time: 2019/7/7 15:22
Desc: todo
"""
from rest_framework.views import APIView
from sale_chart.common.response_format import *
from sale_chart.common.sql_excuter import *
from chart.models import *
from pyecharts.charts import Bar
from pyecharts import options as opts
from pyecharts.charts.base import Base
from pyecharts.options.charts_options import *
from pyecharts.options.series_options import *
from pyecharts.options.global_options import *


class ChartData(APIView):
    def get(self, request, format=None):
        pass

    def post(self, request, format=None):
        post = request.POST
        province = post.get('province')
        city = post.get('city')
        month = post.get('date')
        print('province=%s, city=%s, month=%s' % (province, city, month))
        bar = Bar()
        if province == 'all':
            if month == 'all':
                totals = runquery(
                    """SELECT SUM(money) AS total, province FROM t_sale_info WHERE `month` in (1,2,3,4,5,6) GROUP BY province ORDER BY total DESC;""")
                title = '本年度各省销售情况'
            else:
                totals = runquery(
                    """SELECT SUM(money) AS total, province FROM t_sale_info WHERE `month` =""" + str(
                        month) + """ GROUP BY province ORDER BY total DESC;""")
                title = str(month) + '月份各省销售情况'
            x_axis = []
            y_axis = []
            for total in totals:
                x_axis.append(total.get('province'))
                y_axis.append(total.get('total'))
            bar.add_xaxis(x_axis)
            bar.add_yaxis(series_name='全省销售额', yaxis_data=y_axis)
            bar.set_global_opts(title_opts=opts.TitleOpts(title=title))

        else:
            if city == 'all':
                pass
            else:
                pass

        return response_success(data=bar.dump_options())


class ProvinceHandler(APIView):
    def get(self, requet, format=None):
        get = requet.GET
        province = get.get('province')
        if province == '' or province == 'all':
            return response_success(data=[])
        print(province)
        items = runquery("""SELECT DISTINCT city FROM t_sale_info WHERE province = '""" + province + """';""")
        # items = Sale.objects.filter(province=province).all()
        cities = []
        for item in items:
            cities.append(item.get('city'))
        return response_success(data=cities)
