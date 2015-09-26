# coding:utf-8

from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.http import HttpResponse, JsonResponse

from .forms import *
from .models import *
from .tools import *
import json

# Create your views here.


# 在主页中获取各个频道人数
def user_number(request):
    all_lobbies = Lobby.objects.all()
    lobby_length = all_lobbies.__len__()
    user_num = []
    for i in range(0, lobby_length):
        num = User.objects.filter(lobby_id=(i+1)).__len__()
        user_num.append(num)
    return JsonResponse(user_num, safe=False)


# 主页显示
def home(request):
    # for i in range(0, 40):
    #     room = Room()
    #     room.rid = i
    #     room.lobby_id = 1
    #     room.game_id = 0
    #     room.user_id_1 = ""
    #     room.user_id_2 = ""
    #     room.color_1 = 0
    #     room.color_2 = 0
    #     room.game_request = 0
    #     room.start_1 = 0
    #     room.start_2 = 0
    #     room.save()


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
    # judge if user has logged in
    if 'has_loggedin' in request.session:
        if request.session['has_loggedin']:
            cur_user = User.objects.get(uid=request.session['uid'])
            userdict = {'uid': cur_user.uid, 'name': cur_user.name, 'iconnum': cur_user.iconnum}
            into_lobby_form = IntoLobbyForm()
            return render(request, 'login_complete.html', {
                'Dict': json.dumps(userdict),
                'lobbies': lobbies,
                'into_lobby_form': into_lobby_form,
            })
        else:
            return render_to_response("index.html",
                                      {'form': form, 'lobbies': lobbies, }, context_instance=RequestContext(request))
    else:
        request.session['has_loggedin'] = False;
        return render_to_response("index.html",
                                  {'form': form, 'lobbies': lobbies, }, context_instance=RequestContext(request))


# 大厅显示
def lobby(request):
    if request.method == 'POST':
        form = IntoLobbyForm(request.POST)
        if form.is_valid():
            lobby_id = form.cleaned_data['lid']
            user_id = form.cleaned_data['uid']
            curr_user = User.objects.filter(uid=user_id)[0]
            curr_user.lobby_id = lobby_id
            curr_user.save()
            lobby_users = User.objects.filter(lobby_id=lobby_id)
            all_user_number = lobby_users.__len__()
            user_dict = to_dict(curr_user)
            if lobby_id == 1:           # 非积分区，需要显示桌子
                rooms = Room.objects.filter(lobby_id=1)
                into_room_form = IntoRoomForm()
                return render_to_response("lobby.html", {
                    'into_room_form': into_room_form,
                    'lobby_id': lobby_id,
                    'rooms': rooms,
                    'lobby_users': lobby_users,
                    'all_user_number': all_user_number,
                    'user': json.dumps(user_dict),
                    'lid': json.dumps(lobby_id),
                }, context_instance=RequestContext(request))
            else:                       # 天梯区，无需显示桌子，只需显示按钮
                return render_to_response("lobby.html", {
                    'lobby_id': lobby_id,
                    'lobby_users': lobby_users,
                    'all_user_number': all_user_number,
                    'user': json.dumps(user_dict),
                    'lid': json.dumps(lobby_id),
                }, context_instance=RequestContext(request))
    else:
        return home(request)


# 游戏界面显示
def gobang(request):
    if request.method == 'POST':
        form = IntoRoomForm(request.POST)
        if form.is_valid():
            user_id = form.cleaned_data['uid']
            room_id = form.cleaned_data['rid']
            lobby_id = form.cleaned_data['lid']


            # 获取用户信息
            curr_user = User.objects.filter(uid=user_id)[0]

            # 玩家进入房间
            in_room = Room.objects.filter(rid=room_id)[0]
            all_rooms = Room.objects.all()
            have_room = False
            for room in all_rooms:
                if room.user_id_1 == curr_user.uid or room.user_id_2 == curr_user.uid:
                    have_room = True
                    break
            if have_room:
                return HttpResponse("同一用户不能进入多个房间！")
            elif in_room.user_id_1 == "":
                in_room.user_id_1 = curr_user.uid
                in_room.save()
                user = {'id': 1}
            elif in_room.user_id_2 == "":
                in_room.user_id_2 = curr_user.uid
                in_room.save()
                user = {'id': 2, 'room': room_id}
            else:
                return HttpResponse("人满了！")

            # 获取房间内玩家信息
            if User.objects.filter(uid=in_room.user_id_1).__len__() != 0:
                user_1 = User.objects.filter(uid=in_room.user_id_1)[0]
                player_1 = to_dict(user_1)
            else:
                player_1 = {}

            if User.objects.filter(uid=in_room.user_id_2).__len__() != 0:
                user_2 = User.objects.filter(uid=in_room.user_id_2)[0]
                player_2 = to_dict(user_2)
            else:
                player_2 = {}

            room = {'id': room_id}
            add_step_form = AddStepForm()
            get_new_step_form = GetNewStepForm()
            game_over_form = GameOverForm()
            wait_for_player = WaitForPlayerForm()
            ready_for_game = ReadyForGameForm()
            wait_for_player_ready = WaitForPlayerReadyForm()
            save_player_game_request = SavePlayerGameRequestForm()
            load_player_game_request = LoadPlayerGameRequestForm()
            init_room_info = InitRoomInfoForm()
            return render_to_response("gobang.html", {
                'init_room_info': init_room_info,
                'room': json.dumps(room),
                'user': json.dumps(user),
                'add_step_form': add_step_form,
                'save_player_game_request': save_player_game_request,
                'load_player_game_request': load_player_game_request,
                'get_new_step_form': get_new_step_form,
                'wait_for_player': wait_for_player,
                'ready_for_game': ready_for_game,
                'wait_for_player_ready': wait_for_player_ready,
                'game_over_form': game_over_form,
                'player_1': json.dumps(player_1),
                'player_2': json.dumps(player_2),
            }, context_instance=RequestContext(request))
