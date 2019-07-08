FROM python:3.7.3
MAINTAINER nikai <nikai1006@gmail.com>

WORKDIR /usr/src/app
#COPY requirements.txt ./
COPY mina/ mina/
COPY count/ count/
ADD manage.py manage.py
ADD requirements.txt requirements.txt
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
RUN pip install -r requirements.txt
#设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone

EXPOSE 8000
ENTRYPOINT python manage.py runserver '0.0.0.0:8000' "$0"
CMD ["--settings=mina.settings.docker"]