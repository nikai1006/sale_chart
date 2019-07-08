#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Name: ExcelProcessor.py
Author: nikai
Time: 2019/7/6 14:11
Desc: excel处理类
"""
import os

import xlrd
from rest_framework.views import APIView

from chart.models import *
from sale_chart.common.response_format import *


class ExcelProcessor(APIView):
    def get(self, request, format=None):
        pass

    def post(self, request, format=None):
        excel_upload = request.FILES.get('file_data', None)
        if not excel_upload:
            return response_failed(message='上传为空')
        upload_file = open(os.path.join("./upload/", excel_upload.name), 'wb+')
        for chunk in excel_upload.chunks():
            upload_file.write(chunk)
        upload_file.close()

        path_abspath = os.path.abspath(upload_file.name)
        print(upload_file.name, path_abspath)
        excel_file = xlrd.open_workbook(path_abspath)
        names = excel_file.sheet_names()
        sheet_name = names[0]
        print(sheet_name)
        sheet = excel_file.sheet_by_name(sheet_name)
        nrows = sheet.nrows
        ncols = sheet.ncols
        # print(sheet.name, nrows, ncols)
        # print(sheet.row_values(0, 1, ncols - 1))
        for i in range(2, nrows):
            values = sheet.row_values(i, 1, ncols - 1)
            province = values[0]
            city = values[1]
            months_count = values[2:]
            for i in range(0, 6):
                if Sale.objects.filter(province=province, city=city, month=i + 1).exists():
                    sale_info = Sale.objects.get(province=province, city=city, month=i + 1)
                    sale_info.money = months_count[i]
                    sale_info.save()
                else:
                    Sale.objects.create(province=province, city=city, month=i + 1, money=months_count[i])
        os.remove(path_abspath) #清理临时文件
        return response_success(message='上传成功')
