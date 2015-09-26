# coding: utf-8

__author__ = '王昭'

from .models import *
from .tools import *
from django.http import JsonResponse
from django.db.models import Q
import datetime

# 在频道中获取各种数据信息
def lobby_data(request):
    lobby_dict = {}
    lid = request.GET['lid']
    uid = request.GET['uid']

    # 获取频道内用户信息
    lobby_users = User.objects.filter(Q(status=STATUS_ONLINE) & Q(lobby_id=lid))
    lobby_user_list = []
    for user in lobby_users:
        lobby_user_list.append(to_dict(user))
    lobby_dict['lobby_users'] = lobby_user_list

    # 获取各个房间的信息
    lobby_rooms = Room.objects.filter(lobby_id=lid)
    lobby_room_list = []
    for room in lobby_rooms:
        user_1 = User.objects.filter(uid=room.user_id_1)
        user_icon_1 = 0
        if user_1.__len__() != 0:
            user_icon_1 = user_1[0].iconnum
        user_2 = User.objects.filter(uid=room.user_id_2)
        user_icon_2 = 0
        if user_2.__len__() != 0:
            user_icon_2 = user_2[0].iconnum
        lobby_room_list.append({
            'user_id_1': room.user_id_1,
            'user_id_2': room.user_id_2,
            'user_icon_1': user_icon_1,
            'user_icon_2': user_icon_2,
            'start_1': room.start_1,
            'start_2': room.start_2,
        })
    lobby_dict['lobby_rooms'] = lobby_room_list

    # 获取好友的信息
    friends = Friend.objects.filter(Q(id_1=uid) | Q(id_2=uid))
    friend_list = []
    for friend in friends:
        if friend.id_1 == uid:
            friend_user = User.objects.filter(uid=friend.id_2)[0]
        else:
            friend_user = User.objects.filter(uid=friend.id_1)[0]
        friend_list.append(to_dict(friend_user))
    lobby_dict['friend_list'] = friend_list

    return JsonResponse(lobby_dict)


# 发送好友请求
def friend_request(request):
    uid = request.GET['uid']
    fid = request.GET['fid']
    if uid == fid:
        status = 0
        return JsonResponse(status, safe=False)
    elif Friend.objects.filter((Q(id_1=uid) & Q(id_2=fid)) | (Q(id_1=fid) & Q(id_2=uid))).__len__() != 0:
        status = 1
        return JsonResponse(status, safe=False)
    elif Message.objects.filter(Q(start_id=uid) & Q(end_id=fid) & Q(friend_request=False)).__len__() != 0:
        status = 2
        return JsonResponse(status, safe=False)
    else:
        status = 3
        friend_request = Message()
        friend_request.start_id = uid
        friend_request.end_id = fid
        friend_request.content = ""
        friend_request.friend_request = 1
        friend_request.read = False
        friend_request.save()
        return JsonResponse(status, safe=False)


# 更新消息
def message_data(request):
    uid = request.GET['uid']
    message_dict = {}
    messages = Message.objects.filter(Q(end_id=uid) | Q(start_id=uid))

    message_list = []
    for message in messages:
        dict = to_dict(message)
        dict['start_name'] = User.objects.filter(uid=dict['start_id'])[0].name
        dict['end_name'] = User.objects.filter(uid=dict['end_id'])[0].name
        message_list.append(dict)
    message_dict['message_list'] = message_list

    user_id = []
    user_name = []
    user_iconnum = []
    for message in messages:
        if message.start_id == uid and message.end_id not in user_id:
            user_id.append(message.end_id)
            temp_user = User.objects.filter(uid=message.end_id)[0]
            user_name.append(temp_user.name)
            user_iconnum.append(temp_user.iconnum)
        elif message.start_id not in user_id and message.end_id == uid:
            user_id.append(message.start_id)
            temp_user = User.objects.filter(uid=message.start_id)[0]
            user_name.append(temp_user.name)
            user_iconnum.append(temp_user.iconnum)
    message_dict['user_name'] = user_name
    message_dict['user_iconnum'] = user_iconnum

    return JsonResponse(message_dict)


# 同意好友请求
def accept_friend_request(request):
    uid = request.GET['uid']
    fname = request.GET['fname']
    fid = User.objects.filter(name=fname)[0].uid
    friend_requests = Message.objects.filter(Q(start_id=fid) & Q(end_id=uid))
    for req in friend_requests:
        req.friend_request = 2
        req.content = "对方向你发送好友请求"
        req.read = True
        req.save()

    if not Friend.objects.filter((Q(id_1=uid) & Q(id_2=fid)) | (Q(id_1=fid) & Q(id_2=uid))):
        message = Message()
        message.start_id = uid
        message.end_id = fid
        message.friend_request = 0
        message.content = "我接受了你的好友请求~"
        message.read = False
        message.save()

        relation = Friend()
        relation.id_1 = fid
        relation.id_2 = uid
        relation.save()

    return JsonResponse("", safe=False)


# 拒绝好友请求
def reject_friend_request(request):
    uid = request.GET['uid']
    fname = request.GET['fname']
    fid = User.objects.filter(name=fname)[0].uid
    friend_request = Message.objects.filter(Q(start_id=fid) & Q(end_id=uid))[0]
    friend_request.friend_request = 2
    friend_request.content = "对方向你发送好友请求"
    friend_request.save()

    message = Message()
    message.start_id = uid
    message.end_id = fid
    message.friend_request = 0
    message.content = "拒绝添加好友"
    message.read = False
    message.save()

    return JsonResponse("", safe=False)


# 发送消息
def send_message(request):
    message = Message()
    message.start_id = request.GET['start_id']
    end_name = request.GET['end_name']
    if User.objects.filter(name=end_name).__len__() == 0:
        return JsonResponse("", safe=False)
    message.end_id = User.objects.filter(name=end_name)[0].uid
    message.content = request.GET['content']
    message.friend_request = 0
    message.read = False
    message.save()

    return JsonResponse("", safe=False)


# 获取头像编号
def get_iconnum(request):
    fname = request.GET['fname']
    return JsonResponse(User.objects.filter(name=fname)[0].iconnum, safe=False)


# 处理在线状态
def online_status(request):
    uid = request.GET['uid']
    user = User.objects.filter(uid=uid)[0]
    user.status = STATUS_ONLINE
    user.latest_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user.save()
    return JsonResponse("", safe=False)


# 设置消息为已读
def read_message(request):
    fname = request.GET['fname']
    uid = request.GET['uid']
    fid = User.objects.filter(name=fname)[0].uid
    messages = Message.objects.filter(Q(start_id=fid) & Q(end_id=uid))
    for message in messages:
        message.read = True
        message.save()

    return JsonResponse("", safe=False)


# 解除好友关系
def remove_friend(request):
    fname = request.GET['fname']
    fid = User.objects.filter(name=fname)[0].uid
    uid = request.GET['uid']
    Friend.objects.filter((Q(id_1=uid) & Q(id_2=fid)) | (Q(id_1=fid) & Q(id_2=uid)))[0].delete()
    return JsonResponse("", safe=False)


# 获取积分表
def get_all_score(request):
    all_user = User.objects.all()
    all_user_data = []
    for user in all_user:
        all_user_data.append(to_dict(user))
    return JsonResponse(all_user_data, safe=False)