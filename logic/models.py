# coding: utf-8
from django.db import models

# Create your models here.

__author__ = '王昭'

STATUS_ONLINE = 10000       # 在线状态
STATUS_LEAVE = 10001        # 离开状态
STATUS_OFFLINE = 10002      # 离线状态


# 用户表
class User(models.Model):
    uid = models.CharField(max_length=8)        # 用户名
    name = models.CharField(max_length=8)       # 昵称
    password = models.CharField(max_length=16)  # 密码
    lobby_id = models.IntegerField()            # 用户所在大厅id
    iconnum = models.CharField(max_length=2)    # 用户头像号
    status = models.IntegerField()              # 在线状态
    latest_time = models.CharField(max_length=100)  # 最近一次发送数据的时间
    score = models.IntegerField()               # 用户积分
    win_num = models.IntegerField()             # 用户胜利场次
    lose_num = models.IntegerField()            # 用户失败场次
    tie_num = models.IntegerField()             # 用户平局场次



# 大厅表
class Lobby(models.Model):
    lid = models.IntegerField()                 # 大厅id
    name = models.CharField(max_length=16)      # 大厅名称


# 房间表
class Room(models.Model):
    rid = models.IntegerField()                 # 房间id
    lobby_id = models.IntegerField()            # 房间所在大厅id
    game_id = models.IntegerField()             # 当前进行的游戏id (若没有正在进行游戏，则为0)
    user_id_1 = models.CharField(max_length=8)  # 玩家1id
    user_id_2 = models.CharField(max_length=8)  # 玩家2id
    start_1 = models.BooleanField()             # 玩家1是否准备
    start_2 = models.BooleanField()             # 玩家2是否准备
    color_1 = models.IntegerField()             # 玩家1棋子颜色
    color_2 = models.IntegerField()             # 玩家2棋子颜色
    game_request = models.IntegerField()        # 待处理游戏请求(0为无，1为2求和，2为1求和，3为不同意1求和，4为不同意2求和，5为同意1求和，6为同意2求和，7为2认输，8为1认输


# 朋友关系表
class Friend(models.Model):
    id_1 = models.CharField(max_length=8)       # 好友关系中发起者的id
    id_2 = models.CharField(max_length=8)       # 好友关系中接受者的id


# 下棋表
class Step(models.Model):
    game_id = models.IntegerField()             # 游戏id
    step_id = models.IntegerField()             # 步数id
    color_piece = models.IntegerField()         # 棋子颜色
    position_x = models.IntegerField()          # 棋子横坐标
    position_y = models.IntegerField()          # 棋子纵坐标


# 消息表
class Message(models.Model):
    start_id = models.CharField(max_length=8)   # 发送者id
    end_id = models.CharField(max_length=8)     # 接收者id
    content = models.CharField(max_length=200)  # 消息内容
    friend_request = models.IntegerField()      # 好友请求状态，0代表不是好友请求，1代表还未解决的好友请求，2代表已经解决的好友请求
    read = models.BooleanField()                # 是否已读


# 游戏记录表
class Game(models.Model):
    game_id = models.IntegerField()             # 游戏id
    user_id_1 = models.CharField(max_length=8)  # 玩家1id
    user_id_2 = models.CharField(max_length=8)  # 玩家2id
    game_result = models.IntegerField()         # 游戏结果
