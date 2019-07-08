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
        x_axis = []
        y_axis = []
        if province == 'all':
            series_name = '全省销售额'
            if month == 'all':
                totals = runquery(
                    """SELECT SUM(money) AS total, province FROM t_sale_info WHERE `month` in (1,2,3,4,5,6) GROUP BY province ORDER BY total DESC;""")
                title = '本年度各省销售情况'
            else:
                totals = runquery(
                    """SELECT SUM(money) AS total, province FROM t_sale_info WHERE `month` =""" + str(
                        month) + """ GROUP BY province ORDER BY total DESC;""")
                title = str(month) + '月份各省销售情况'
            for total in totals:
                x_axis.append(total.get('province'))
                y_axis.append(total.get('total'))
        else:
            if city == 'all':
                if month == 'all':
                    series_name = province + '省月销售额'
                    totals = runquery("""SELECT SUM(money) AS total, month FROM t_sale_info WHERE province = '""" + str(
                        province) + """' GROUP BY `month`;""")
                    title = province + '省本年度各月销售情况'
                    for total in totals:
                        x_axis.append(total.get('month'))
                        y_axis.append(total.get('total'))
                    x_axis = list(map(lambda m: str(m) + '月', x_axis))
                else:
                    series_name = month + '月市销售额'
                    totals = runquery(
                        """SELECT money,city FROM t_sale_info WHERE province='""" + province + """' AND `month` = """ + str(
                            month) + """ ORDER BY money DESC;""")
                    title = province + '省' + str(month) + '月份各市销售情况'
                    for total in totals:
                        x_axis.append(total.get('city'))
                        y_axis.append(total.get('money'))
            else:
                totals = runquery("""SELECT money,month FROM t_sale_info WHERE city = '""" + city + """';""")
                series_name = province + '省' + city + '市月销售额'
                title = province + '省' + city + '市各月销售情况'
                for total in totals:
                    x_axis.append(total.get('month'))
                    y_axis.append(total.get('money'))
                x_axis = list(map(lambda m: str(m) + '月', x_axis))
        # 绘图
        bar.add_xaxis(x_axis)
        bar.add_yaxis(series_name=series_name, yaxis_data=y_axis)
        bar.set_global_opts(title_opts=opts.TitleOpts(title=title))
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
