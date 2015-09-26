# coding: utf-8

from .forms import *
from .tools import *
from .models import *
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext
import json

__author__ = '英达'


# 处理用户注册事件
def register(request):
    if request.method == 'GET':
        from logic.models import User
        new_user = User()
        new_user.uid = request.GET['reg_user']
        new_user.password = request.GET['reg_password']
        password_again = request.GET['reg_password_again']
        new_user.name = request.GET['reg_name']
        new_user.lobby_id = 0
        new_user.iconnum = request.GET['iconnum']
        new_user.status = 10000
        new_user.latest_time = "2015-01-01 12:00:00"
        new_user.score = 0
        new_user.win_num = 0
        new_user.tie_num = 0
        new_user.lose_num = 0
        dict1 = {'login': '0', 'reg': '0' }
        form = RegisterForm()
        all_lobbies = Lobby.objects.all()
        lobbies = []
        lobby_length = all_lobbies.__len__()
        for i in range(0, lobby_length):
            user_num = User.objects.filter(lobby_id=(i+1)).__len__()
            lobby = {
                'user_num': user_num,
                'lobby_name': all_lobbies[i].name
            }
            lobbies.append(lobby)
        if new_user.password == password_again :
            if not has_same_uid(new_user):
                new_user.save()
                return render(request, 'index.html', {
                    'Dict': json.dumps(dict1),
                    'lobbies': lobbies,
                    'form': form,
                })
            else:
                dict1['reg'] = '1'
                return render(request, 'index.html', {
                    'Dict': json.dumps(dict1),
                    'lobbies': lobbies,
                    'form': form,
                })
        else:
            dict1['reg'] = '2'
            return render(request, 'index.html', {
                'Dict': json.dumps(dict1),
                'lobbies': lobbies,
                'form': form,
            })


# 处理用户登录事件
def login(request):
    if request.method == 'POST':
        if request.session['has_loggedin']:
            from logic.models import User
            cur_user = User.objects.get(uid=request.session['uid'])
            userdict = {'uid': cur_user.uid, 'name': cur_user.name, 'iconnum': cur_user.iconnum}
            all_lobbies = Lobby.objects.all()
            lobbies =[]
            lobby_length = all_lobbies.__len__()
            for i in range(0, lobby_length):
                 lobby = {
                    'user_num': User.objects.filter(lobby_id=(i+1)).__len__(),
                    'lobby_name': all_lobbies[i].name
                 }
                 lobbies.append(lobby)
            into_lobby_form = IntoLobbyForm()
            return render(request, 'login_complete.html', {
                'Dict': json.dumps(userdict),
                'lobbies': lobbies,
                'into_lobby_form': into_lobby_form,
            })
        from logic.models import User
        cur_user = User()
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['uid']
            password = form.cleaned_data['password']
            q = User.objects.filter(uid=username, password=password)
            if q.__len__() != 0:
                cur_user.name = q[0].name
                cur_user.uid = q[0].uid
                cur_user.iconnum = q[0].iconnum
                userdict = {'uid': username, 'name': cur_user.name, 'iconnum': cur_user.iconnum}
                request.session['has_loggedin'] = True
                request.session['uid'] = cur_user.uid
                all_lobbies = Lobby.objects.all()
                lobbies =[]
                lobby_length = all_lobbies.__len__()
                for i in range(0, lobby_length):
                    lobby = {
                        'user_num': User.objects.filter(lobby_id=(i+1)).__len__(),
                        'lobby_name': all_lobbies[i].name
                    }
                    lobbies.append(lobby)
                into_lobby_form = IntoLobbyForm()
                return render(request, 'login_complete.html', {
                    'Dict': json.dumps(userdict),
                    'lobbies': lobbies,
                    'into_lobby_form': into_lobby_form,
                })
            else:
                all_lobbies = Lobby.objects.all()
                lobbies = []
                lobby_length = all_lobbies.__len__()
                for i in range(0, lobby_length):
                    lobby = {
                        'user_num': User.objects.filter(lobby_id=(i+1)).__len__(),
                        'lobby_name': all_lobbies[i].name
                    }
                    lobbies.append(lobby)
                dict1 = {'login': '1', 'reg': '0'}
                return render(request, 'index.html', {
                    'Dict': json.dumps(dict1),
                    'lobbies': lobbies,
                    'form': form,
                })

    else:
        form = RegisterForm()
        all_lobbies = Lobby.objects.all()
        lobbies = []
        lobby_length = all_lobbies.__len__()
        for i in range(0, lobby_length):
            lobby = {
                'user_num': User.objects.filter(lobby_id=(i+1)).__len__(),
                'lobby_name': all_lobbies[i].name
            }
            lobbies.append(lobby)
        return render_to_response("index.html",
                            {'form': form, 'lobbies': lobbies, }, context_instance=RequestContext(request))


# 处理修改密码事件
def changepassword(request):
    if request.method == 'GET':
        from logic.models import User
        uid = request.GET['password_uid']
        password = request.GET['new_password']
        cur_user = User.objects.get(uid=uid)
        cur_user.password = password
        userdict = {'uid': cur_user.uid, 'name': cur_user.name, 'iconnum': cur_user.iconnum}
        cur_user.save()
        all_lobbies = Lobby.objects.all()
        lobbies = []
        lobby_length = all_lobbies.__len__()
        for i in range(0, lobby_length):
            user_num = User.objects.filter(lobby_id=(i+1)).__len__()
            lobby = {
                'user_num': user_num,
                'lobby_name': all_lobbies[i].name
            }
            lobbies.append(lobby)
        into_lobby_form = IntoLobbyForm()
        return render(request, 'login_complete.html', {
            'Dict': json.dumps(userdict),
            'lobbies': lobbies,
            'into_lobby_form': into_lobby_form,
        })


# 处理修改昵称和头像事件
def changename(request):
    if request.method == 'GET':
        from logic.models import User
        uid = request.GET['name_uid']
        name = request.GET['new_name']
        iconnum = request.GET['iconnum']
        cur_user = User.objects.get(uid=uid)
        cur_user.name = name
        cur_user.iconnum = iconnum
        userdict = {'uid': uid, 'name': name, 'iconnum': iconnum}
        cur_user.save()
        all_lobbies = Lobby.objects.all()
        lobbies = []
        lobby_length = all_lobbies.__len__()
        for i in range(0, lobby_length):
            user_num = User.objects.filter(lobby_id=(i+1)).__len__()
            lobby = {
                'user_num': user_num,
                'lobby_name': all_lobbies[i].name
            }
            lobbies.append(lobby)
        into_lobby_form = IntoLobbyForm()
        return render(request, 'login_complete.html', {
            'Dict': json.dumps(userdict),
            'lobbies': lobbies,
            'into_lobby_form': into_lobby_form,
        })


# 注销用户
def relog(request):
    form = RegisterForm()
    all_lobbies = Lobby.objects.all()
    lobbies = []
    lobby_length = all_lobbies.__len__()
    for i in range(0, lobby_length):
        lobby = {
            'user_num': User.objects.filter(lobby_id=(i+1)).__len__(),
            'lobby_name': all_lobbies[i].name
        }
        lobbies.append(lobby)
    request.session['has_loggedin'] = False
    return render_to_response("index.html",
                            {'form': form, 'lobbies': lobbies, }, context_instance=RequestContext(request))