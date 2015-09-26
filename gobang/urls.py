"""gobang URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'logic.views.home', name='home'),
    url(r'^lobby/$', 'logic.views.lobby', name='lobby'),
    url(r'^register/$', 'logic.user.register', name='register'),
    url(r'^login/$', 'logic.user.login', name='login'),
    url(r'^gobang/$', 'logic.views.gobang', name='gobang'),
    url(r'^user_number/$', 'logic.views.user_number', name='user_number'),
    url(r'^lobby_data/$', 'logic.lobby.lobby_data', name='lobby_data'),
    url(r'^changepassword/$', 'logic.user.changepassword', name='changepassword'),
    url(r'^changename/$', 'logic.user.changename', name='changename'),
    url(r'^add_step/$', 'logic.game.add_step', name='add_step'),
    url(r'^get_new_step/$', 'logic.game.get_new_step', name='get_new_step'),
    url(r'^game_over/$', 'logic.game.game_over', name='game_over'),
    url(r'^wait_for_player/$', 'logic.game.wait_for_player', name='wait_for_player'),
    url(r'^ready_for_game/$', 'logic.game.ready_for_game', name='ready_for_game'),
    url(r'^wait_for_player_ready/$', 'logic.game.wait_for_player_ready', name='wait_for_player_ready'),
    url(r'^save_player_game_request/$', 'logic.game.save_player_game_request', name='save_player_game_request'),
    url(r'^load_player_game_request/$', 'logic.game.load_player_game_request', name='load_player_game_request'),
    url(r'^init_room_info/$', 'logic.game.init_room_info', name='init_room_info'),
    url(r'^relog/$', 'logic.user.relog', name='relog'),
    url(r'^kick/$', 'logic.game.kick', name='kick'),
    url(r'^if_kicked/$', 'logic.game.if_kicked', name='if_kicked'),
    # url(r'^login_complete$/', 'logic.user.logincomplete', name='login_complete'),
]

urlpatterns += staticfiles_urlpatterns()
