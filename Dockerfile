FROM python:3.7.3
MAINTAINER nikai <nikai1006@gmail.com>

WORKDIR /usr/src/app
#COPY requirements.txt ./
COPY chart/ chart/
COPY sale_chart/ sale_chart/
ADD manage.py manage.py
COPY requirements/ requirements/
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
RUN pip install -r requirements/dev.txt
#设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
RUN mkdir upload

EXPOSE 8000
ENTRYPOINT python manage.py runserver '0.0.0.0:8000' "$0"
CMD ["--settings=sale_chart.settings.docker"]