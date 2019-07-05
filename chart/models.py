from django.db import models


# Create your models here.
class Sale(models.Model):
    province = models.CharField(max_length=10, null=False, verbose_name="省")
    city = models.CharField(max_length=10, null=False, verbose_name='市')
    month = models.SmallIntegerField(null=False, verbose_name='月份')
    money = models.FloatField(null=False, verbose_name="销售额")

    class Meta:
        verbose_name = '销售信息表'
        verbose_name_plural = verbose_name
        db_table = 't_sale_info'

    def __str__(self):
        return self.province+self.city+self.month+"月销售额："+self.money
