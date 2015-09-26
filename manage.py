#!/usr/bin/env python
import os
import sys
import time
import datetime
import _thread
from logic.models import *


def check():
    while True:
        now_time = datetime.datetime.now()
        if now_time.second % 5 == 0:
            all_user = User.objects.all()
            for user in all_user:
                if user.status == STATUS_ONLINE:
                    latest = user.latest_time
                    latest_time = datetime.datetime.strptime(latest, "%Y-%m-%d %H:%M:%S")
                    delta = now_time - latest_time
                    if delta.seconds > 5:
                        user.status = STATUS_OFFLINE
                        user.lobby_id = 0
                        user.save()
            print(now_time.strftime('%c'))
        time.sleep(1)


def check_online_status():
    _thread.start_new_thread(check, ())


if __name__ == "__main__":

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gobang.settings")

    from django.core.management import execute_from_command_line

    check_online_status()

    execute_from_command_line(sys.argv)
