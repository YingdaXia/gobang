# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0008_auto_20150802_2339'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('id_1', models.CharField(max_length=8)),
                ('id_2', models.CharField(max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('game_id', models.IntegerField()),
                ('user_id_1', models.CharField(max_length=8)),
                ('user_id_2', models.CharField(max_length=8)),
                ('game_result', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('game_id', models.IntegerField()),
                ('step_id', models.IntegerField()),
                ('color_piece', models.IntegerField()),
                ('position_x', models.IntegerField()),
                ('position_y', models.IntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='room',
            name='color_1',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='color_2',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='game_request',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='start_1',
            field=models.BooleanField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='room',
            name='start_2',
            field=models.BooleanField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='iconnum',
            field=models.CharField(default=0, max_length=2),
            preserve_default=False,
        ),
    ]
