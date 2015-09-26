# coding: utf-8

from logic.forms import *
from logic.tools import *
from django.http import HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, render_to_response
from logic.models import *
import json, random

__author__ = 'ljqpc'


# 下棋事件
def add_step(request):
    if request.method == 'GET':
        form = AddStepForm(request.GET)
        if form.is_valid():
            step = Step(
                game_id=form.cleaned_data['game_id'],
                step_id=form.cleaned_data['step_id'],
                color_piece=form.cleaned_data['color_piece'],
                position_x=form.cleaned_data['position_x'],
                position_y=form.cleaned_data['position_y']
            )
            current_game = Game.objects.filter(game_id=step.game_id)[0]
            if current_game.game_result == 0:
                step.save()
                return HttpResponse('uploaded')
            else:
                return HttpResponse('game is over')
    else:
        return HttpResponse('error')


def get_new_step(request):
    if request.method == 'GET':
        form = GetNewStepForm(request.GET)
        if form.is_valid():
            game_id = form.cleaned_data['game_id']
            step_id = form.cleaned_data['step_id']

            step = Step.objects.filter(game_id=game_id, step_id=step_id)
            if step.__len__() != 0:
                new_step = {
                    'color_piece': step[0].color_piece,
                    'position_x': step[0].position_x,
                    'position_y': step[0].position_y
                }
                return JsonResponse(new_step)
            else:
                return HttpResponse('Not Found')


def game_over(request):
    if request.method == 'GET':
        form = GameOverForm(request.GET)
        if form.is_valid():
            player_id = form.cleaned_data['player_id']
            game_id = form.cleaned_data['game_id']
            game_result = form.cleaned_data['game_result']
            if game_result == 1:
                current_game = Game.objects.filter(game_id=game_id)[0]
                current_game.game_result = player_id
                current_game.save()
                if player_id == 1:
                    current_player_id = current_game.user_id_1
                    another_player_id = current_game.user_id_2
                else:
                    current_player_id = current_game.user_id_2
                    another_player_id = current_game.user_id_1
                current_player = User.objects.filter(uid=current_player_id)[0]
                current_player.score += 3
                current_player.win_num += 1
                current_player.save()
                another_player = User.objects.filter(uid=another_player_id)[0]
                another_player.score -= 0
                another_player.lose_num += 1
                another_player.save()
            elif game_result == 2:
                Step.objects.filter(game_id=game_id).delete()
            else:
                current_game = Game.objects.filter(game_id=game_id)[0]
                current_game.game_result = 3
                current_game.save()
                if player_id == 1:
                    current_player_id = current_game.user_id_1
                else:
                    current_player_id = current_game.user_id_2
                current_player = User.objects.filter(uid=current_player_id)[0]
                current_player.score += 1
                current_player.tie_num += 1
                current_player.save()
                Step.objects.filter(game_id=game_id).delete()
            return HttpResponse('game over')


def init_room_info(request):
    if request.method == 'GET':
        form = InitRoomInfoForm(request.GET)
        if form.is_valid():
            game_id = form.cleaned_data['game_id']
            current_room = Room.objects.filter(game_id=game_id)[0]
            current_room.game_id = 0
            current_room.game_request = 0
            current_room.start_1 = 0
            current_room.start_2 = 0
            current_room.color_1 = 0
            current_room.color_2 = 0
            current_room.save()
            return HttpResponse('init success')


def wait_for_player(request):
    if request.method == 'GET':
        form = WaitForPlayerForm(request.GET)
        if form.is_valid():
            room_id = form.cleaned_data['room_id']
            current_room = Room.objects.filter(rid=room_id)[0]
            if current_room.user_id_2.__len__() != 0:
                another_user = User.objects.filter(uid=current_room.user_id_2)[0]
                another_player = {
                    'uid': another_user.uid,
                    'name': another_user.name,
                    'lobby_id': another_user.lobby_id,
                    'iconnum': another_user.iconnum,
                    'win_num': another_user.win_num,
                    'lose_num': another_user.lose_num,
                    'tie_num':another_user.tie_num,
                    'score': another_user.score
                }
                return JsonResponse(another_player)
            else:
                return HttpResponse('Waiting')


def ready_for_game(request):
    if request.method == 'GET':
        form = ReadyForGameForm(request.GET)
        if form.is_valid():
            room_id = form.cleaned_data['room_id']
            user_id = form.cleaned_data['user_id']

            current_room = Room.objects.filter(rid=room_id)[0]
            if user_id == 1:
                current_room.start_1 = True
            else:
                current_room.start_2 = True
            if current_room.start_1 is True and current_room.start_2 is True:
                current_room.color_1 = random.randint(1, 2)
                current_room.color_2 = 3 - current_room.color_1
                all_games = Game.objects.all()
                new_game_id = all_games.__len__() + 1
                current_room.game_id = new_game_id
                current_room.save()
                new_game = Game(
                    game_id=new_game_id,
                    user_id_1=current_room.user_id_1,
                    user_id_2=current_room.user_id_2,
                    game_result=0
                )
                new_game.save();
                if user_id == 1:
                    game = {'user_color': current_room.color_1, 'game_id': current_room.game_id}
                    return JsonResponse(game)
                else:
                    game = {'user_color': current_room.color_2, 'game_id': current_room.game_id}
                    return JsonResponse(game)
            else:
                current_room.save()
                return HttpResponse('Wait For Another Player')


def wait_for_player_ready(request):
    if request.method == 'GET':
        form = WaitForPlayerReadyForm(request.GET)
        if form.is_valid():
            room_id = form.cleaned_data['room_id']
            user_id = form.cleaned_data['user_id']

            current_room = Room.objects.filter(rid=room_id)[0]
            if current_room.start_1 is True and current_room.start_2 is True:
                if user_id == 1:
                    game = {'user_color': current_room.color_1, 'game_id': current_room.game_id}
                    return JsonResponse(game)
                else:
                    game = {'user_color': current_room.color_2, 'game_id': current_room.game_id}
                    return JsonResponse(game)
            else:
                return HttpResponse('Wait For Another Player')


def save_player_game_request(request):
    if request.method == 'GET':
        form = SavePlayerGameRequestForm(request.GET)
        if form.is_valid():
            room_id = form.cleaned_data['room_id']
            request_type = form.cleaned_data['request_type']
            current_room = Room.objects.filter(rid=room_id)[0]
            if current_room.game_request == 0:
                current_room.game_request = request_type
                current_room.save()
                return HttpResponse('request saved')
            elif request_type == 0:
                current_room.game_request = request_type
                current_room.save()
                return HttpResponse('request saved')
            else:
                return HttpResponse('waiting')


def load_player_game_request(request):
    if request.method == 'GET':
        form = LoadPlayerGameRequestForm(request.GET)
        if form.is_valid():
            room_id = form.cleaned_data['room_id']
            current_room = Room.objects.filter(rid=room_id)[0]
            request = {
                'type': current_room.game_request
            }
            return JsonResponse(request)


def kick(request):
    if request.method == 'GET':
        room_id = request.GET['room_id']
        current_room = Room.objects.filter(rid=room_id)[0]
        current_room.user_id_2 = ''
        current_room.start_2 = False
        current_room.game_request = 0
        current_room.save()
        return HttpResponse('kick complete!')


def if_kicked(request):
    if request.method == 'GET':
        room_id = request.GET['room_id']
        user_id = request.GET['user_id']
        player_name = request.GET['player_name']
        current_player = User.objects.filter(name=player_name)[0]
        current_room = Room.objects.filter(rid=room_id)[0]
        if user_id == '2' and current_room.user_id_2 == '' and current_room.user_id_1 != current_player.uid:
            result = {'result': 'yes'}
            return JsonResponse(result)
        else:
            result = {'result': 'no'}
            return JsonResponse(result)


def exit_room(request):
    if request.method == 'GET':
        room_id = request.GET['room_id']
        user_id = request.GET['user_id']
        current_room = Room.objects.filter(rid=room_id)[0]
        if user_id == '2':
            current_room.user_id_2 = ''
            current_room.start_1 = 0
            current_room.start_2 = 0
            current_room.save()
            return HttpResponse('player2 exit room')
        else:
            current_room.user_id_1 = current_room.user_id_2
            current_room.user_id_2 = ''
            current_room.start_1 = 0
            current_room.start_2 = 0
            current_room.save()
            return HttpResponse('player1 exit room')


def if_exit_room(request):
    if request.method == 'GET':
        room_id = request.GET['room_id']
        user_id = request.GET['user_id']
        player_name = request.GET['player_name']
        current_player = User.objects.filter(name=player_name)[0]
        current_room = Room.objects.filter(rid=room_id)[0]
        if user_id == '1' and current_room.user_id_2 == '' and current_room.user_id_1 == current_player.uid:
            return HttpResponse('player1 exit room')
        elif user_id == '2' and current_room.user_id_2 == ''and current_room.user_id_1 == current_player.uid:
            return HttpResponse('player2 exit room')
        else:
            return HttpResponse('nobody exit room')


def if_ready(request):
    if request.method == 'GET':
        room_id = request.GET['room_id']
        user_id = request.GET['user_id']
        current_room = Room.objects.filter(rid=room_id)[0]
        if user_id == '1' and current_room.start_2:
            return HttpResponse('ready')
        elif user_id == '2' and current_room.start_1:
            return HttpResponse('ready')
        else:
            return HttpResponse('not ready')