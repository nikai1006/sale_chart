#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Name: echarts_test.py
Author: nikai
Time: 2019/7/8 1:01
Desc: todo
"""

from pyecharts import options as opts
from pyecharts.charts import Bar
# from pyecharts.render import make_snapshot
import json


def bar_chart() -> Bar:
    c = (
        Bar()
        .add_xaxis(["衬衫", "毛衣", "领带", "裤子", "风衣", "高跟鞋", "袜子"])
        .add_yaxis("商家A", [114, 55, 27, 101, 125, 27, 105])
        .add_yaxis("商家B", [57, 134, 137, 129, 145, 60, 49])
        .reversal_axis()
        .set_series_opts(label_opts=opts.LabelOpts(position="right"))
        .set_global_opts(title_opts=opts.TitleOpts(title="Bar-测试渲染图片"))
    )
    return c.dump_options()

def bar_chart2():
    # 不习惯链式调用的开发者依旧可以单独调用方法
    bar = Bar()
    bar.add_xaxis(["衬衫", "毛衣", "领带", "裤子", "风衣", "高跟鞋", "袜子"])
    bar.add_yaxis("商家A", [114, 55, 27, 101, 125, 27, 105])
    bar.add_yaxis("商家B", [57, 134, 137, 129, 145, 60, 49])
    bar.set_global_opts(title_opts=opts.TitleOpts(title="某商场销售情况"))
    return bar.dump_options()

if __name__ == '__main__':
    print(bar_chart())
    print('=============================================')
    print(bar_chart2())