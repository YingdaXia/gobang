# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0009_auto_20150806_2018'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('start_id', models.CharField(max_length=8)),
                ('end_id', models.CharField(max_length=8)),
                ('content', models.CharField(max_length=200)),
                ('friend_request', models.IntegerField()),
                ('read', models.BooleanField()),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='latest_time',
            field=models.CharField(default='2015-08-06 20:00:00', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='lose_num',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='score',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.IntegerField(default=10002),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='tie_num',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='win_num',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
