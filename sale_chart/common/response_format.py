# -*- coding:utf-8 -*-
"""
@author: chaohong
@time: 2019/02/26
@dec 响应的格式
"""
from rest_framework import status
from rest_framework.response import Response


def common_format(code, message, data):
    result = dict()
    result["code"] = code
    result["msg"] = message
    result['data'] = data
    return result


def success_format(data={}):
    return common_format(0, "success", data)


def failed_format(status_code, error_code, message):
    error = dict()
    error["status_code"] = status_code
    error["error_code"] = error_code
    error["error_message"] = message
    return common_format(status_code, message, {})


def response_success(message="success", data={}):
    result = common_format(0, message, data)
    return Response(data=result, status=status.HTTP_200_OK)


def data_page_sucess(recodes, total):
    result = {"data": recodes, "recordsTotal": total, "recordsFiltered": total}
    return Response(data=result, status=status.HTTP_200_OK)


def response_failed(status_code=1, error_code=1, message="失败", data={}):
    error = dict()
    error["status_code"] = status_code
    error["error_code"] = error_code
    error["error_message"] = message
    result = common_format(1, message, data)
    return Response(data=result, status=status.HTTP_200_OK)
