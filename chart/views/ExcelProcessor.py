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

        # excel_file = xlrd.open_workbook(upload_file)
        # names = excel_file.sheet_names()
        # print(names)
        return response_success(message='上传成功')
