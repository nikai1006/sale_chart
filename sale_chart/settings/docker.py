#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Name: dev.py
Author: nikai
Time: 2019/7/7 13:11
Desc: todo
"""
from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sale_chart',
        'USER': 'test',
        'PASSWORD': '123456',
        'HOST': 'docker',
        'PORT': '3306',
    }
}