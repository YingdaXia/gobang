#coding: utf-8

__author__ = '王昭'

from django import forms


class RegisterForm(forms.Form):
    uid = forms.CharField(
        label='',
        max_length=8,
        widget=forms.TextInput(
            attrs={'placeholder': "请输入用户名"}
        ),
    )
    password = forms.CharField(
        label='',
        max_length=16,
        widget=forms.PasswordInput(
            attrs={'placeholder': "请输入密码"}
        ),
    )


class IntoLobbyForm(forms.Form):
    uid = forms.CharField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    lid = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class IntoRoomForm(forms.Form):
    uid = forms.CharField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    lid = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    rid = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class AddStepForm(forms.Form):
    game_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    step_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    color_piece = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    position_x = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    position_y = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class GetNewStepForm(forms.Form):
    game_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    step_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class GameOverForm(forms.Form):
    player_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    game_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    game_result = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class ReadyForGameForm(forms.Form):
    room_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    user_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class WaitForPlayerForm(forms.Form):
    room_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class WaitForPlayerReadyForm(forms.Form):
    room_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    user_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class SavePlayerGameRequestForm(forms.Form):
    room_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
    request_type = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class LoadPlayerGameRequestForm(forms.Form):
    room_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )


class InitRoomInfoForm(forms.Form):
    game_id = forms.IntegerField(
        widget=forms.HiddenInput(
            attrs={'value': ""}
        ),
    )
