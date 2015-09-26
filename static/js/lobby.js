var hoverFlag = false;

$(document).ready(function() {
	reDeployLobby();
	$('#all-score').mouseup(function(e) {
		if (e.which === 1) {
			$.getJSON("/get_all_score/", function(ret) {
				var score_window = $('<div id="score-window"></div>');
				score_window.css('left', ($(window).width() - 400) / 2);
				score_window.css('top', ($(window).height() - 600) / 2);
				var length = ret.length;
				ret.sort(function(a, b) {
					return b.score - a.score;
				});
				var score_window_title = $('<div id="score-window-title" style="text-align:center; margin: 20px 0;">总榜单</div>');
				score_window.append(score_window_title);
				var score_window_exit = $('<div id="score-window-exit" style="position: absolute; left: 380px; top: 10px;">×</div>');
				score_window_exit.mouseup(function(e) {
					if (e.which === 1) {
						score_window.remove();
					}
				});
				score_window.append(score_window_exit);
				var score_window_table = $('<table></table>');
				score_window.append(score_window_table);
				score_window_table.append('<tr class="tableheader"><th width="100">昵称</th><th width="32">积分</th><th width="32">胜场</th><th width="32">平场</th><th width="32">负场</th></tr>');
				for (var i = 0; i < ret.length; ++i) {
					var element = $('<tr class="tablerow"><td>' + ret[i].name + '</td><td>' + ret[i].score + '</td><td>' + ret[i].win_num + '</td><td>' + ret[i].tie_num + '</td><td>' + ret[i].lose_num + '</td></tr>');
					score_window_table.append(element);
				}
				$('body').append(score_window);
			});
		}
	})
    $('body').mouseup(function(e) {
        if (e.which === 1) {
            if (hoverFlag === false) {
                $('#options').remove();
            }
        }
    });
	setInterval(lobby_data, 1000);
	setInterval(function() {
		send_online_status(curr_user.uid);
	}, 1000);
});

$(window).resize(function() {
	reDeployLobby();
});

function sendFriendRequest(friend_uid) {
    $.getJSON("/friend_request/", {'uid': curr_user.uid, 'fid': friend_uid});
}

function setTableClick(x, y, user_id, user_name, friend_list) {
    $('#options').remove();
    var options = $('<div id="options"></div>');
    options.css('left', x);
    options.css('top', y);

    var isFriend = false;
    for (var i = 0; i < friend_list.length; ++i) {
    	if (user_name === friend_list[i].name) {
    		isFriend = true;
    		break;
    	}
    }

    if (isFriend === false) {
	    var option_friend = $('<div>请求加为好友</div>');
	    option_friend.mouseup(function(e) {
	        if (e.which === 1) {
	            sendFriendRequest(user_id);
	        }
	    });
	    options.append(option_friend);
    }

    var option_message = $('<div>发送信息</div>');
    option_message.mouseup(function(e) {
    	if (e.which === 1) {
    		sendMessageRequest(user_name);
    	}
    });
    options.append(option_message);

    if (isFriend === true) {
    	var option_remove = $('<div>解除好友</div>');
		option_remove.mouseup(function(e) {
			if (e.which === 1) {
				$('#options').remove();
				var r = confirm("确定要解除与" + user_name + "的好友关系吗？");
				if (r === true) {
					sendRemoveFriendRequest(user_name);
				}
			}
		});
		options.append(option_remove);
    }

    $('body').append(options);
}

function sendRemoveFriendRequest(user_name) {
	$.getJSON("/remove_friend/", {
		'uid': curr_user.uid,
		'fname': user_name
	});
}

function setTables() {
    var tablenumber = $('.tables').length;
	var lobby_area = $('#lobbyarea');
	var count = Math.floor((lobby_area.width() - 20) / 125);
	var interval = (lobby_area.width() - 20 - 125 * count) / count;
	var tables = new Array(tablenumber);
	for (var i = 0; i < tablenumber; ++i) {
		tables[i] = $($('.tables')[i]);
        var leftuser = $($('.leftuser')[i]);
        var rightuser = $($('.rightuser')[i]);
        (function(index) {
            leftuser.mouseup(function(e) {
                if (e.which === 1) {
                    user_getinRoom(index);
                }
            });
            rightuser.mouseup(function(e) {
                if (e.which === 1) {
                    user_getinRoom(index);
                }
            })
        })(i);
		var table = $($('.table')[i]);
		var table_num = $($('.tablenumber')[i]);
        table_num.html("-  " + (i + 1) + "  -");
		tables[i].css('margin-left', interval / 2);
		tables[i].css('margin-right', interval / 2);
	}
}

function lobby_data() {
	$.getJSON("/lobby_data/", {'lid': lobby_id, 'uid': curr_user.uid}, function(ret) {
		var tablerows = $('#userlist .tablerow');
		tablerows.remove();
		var user_length = ret.lobby_users.length;
		$('#subtitle').html(user_length + "人正在游戏中");
		for (var i = 0; i < user_length; ++i) {
			var luser = ret.lobby_users[i];
			if (luser.uid === curr_user.uid) {
				$('#userscore').html("积分：" + luser.score + "<br />" + luser.win_num + "胜" + luser.tie_num + "平" + luser.lose_num + "负");
			}
			var row = $('<tr class="tablerow"><td>' + luser.name + 
				'</td><td style="text-align: center">' + luser.score +
				 '</td><td style="text-align: center">' + luser.win_num + 
				'</td><td style="text-align: center">' + luser.tie_num +
				 '</td><td style="text-align: center">' + luser.lose_num + '</td> /tr>');
			$($('.tablelist')[1]).append(row);
		}

		var room_length = ret.lobby_rooms.length;
		for (var i = 0; i < room_length; ++i) {
			var table = $($('.tables')[i]);
			var leftuser = $($('.leftuser_img')[i]);
        	var rightuser = $($('.rightuser_img')[i]);
			if (ret.lobby_rooms[i].user_icon_1 === 0) {
				leftuser.css('margin', 0);
				leftuser.attr('src', '/static/image/lobby_leftchair.png');
			} else {
				leftuser.css('margin-top', 10);
				leftuser.css('margin-bottom', 10);
				leftuser.attr('src', '/static/image/head_icon' + ret.lobby_rooms[i].user_icon_1 + '.jpg');
			}
			if (ret.lobby_rooms[i].user_icon_2 === 0) {
				rightuser.css('margin', 0);
				rightuser.attr('src', '/static/image/lobby_rightchair.png');
			} else {
				rightuser.css('margin-top', 10);
				rightuser.css('margin-bottom', 10);
				rightuser.attr('src', '/static/image/head_icon' + ret.lobby_rooms[i].user_icon_2 + '.jpg');
			}
			if (ret.lobby_rooms[i].start_1 === true && ret.lobby_rooms[i].start_2 === true) {
				$($('.table')[i]).css('background-image', "url('/static/image/lobby_activetable.jpg')");
			} else {
				$($('.table')[i]).css('background-image', "url('/static/image/lobby_emptytable.jpg')");
			}
		}

        $('#friendlist .tablerow').remove();
        var friend_length = ret.friend_list.length;
        for (var i = 0; i < friend_length; ++i) {
        	var fuser = ret.friend_list[i];
			var row = $('<tr class="tablerow"><td>' + fuser.name + 
				'</td><td style="text-align: center">' + fuser.score + 
				'</td><td style="text-align: center">' + fuser.win_num + 
				'</td><td style="text-align: center">' + fuser.tie_num + 
				'</td><td style="text-align: center">' + fuser.lose_num + '</td> /tr>');
            $($('.tablelist')[0]).append(row);
        }

        $(".tablerow").hover(
            function() {
                hoverFlag = true;
            },

            function() {
                hoverFlag = false;
            }
        );

        var userlist = $('#userlist .tablerow');
        for (var i = 0; i < userlist.length; ++i) {
            (function(index) {
                $(userlist[i]).mouseup(function(e) {
                    if (e.which === 1) {
                        var user_id = ret.lobby_users[index].uid;
                        if (user_id === curr_user.uid) {
                        	return true;
                        }
                        var user_name = ret.lobby_users[index].name;
                        setTableClick(e.clientX, e.clientY, user_id, user_name, ret.friend_list);
                    }
                })
            })(i);
        }

        var friendlist = $('#friendlist .tablerow');
        for (var i = 0; i < friendlist.length; ++i) {
            (function(index) {
                $(friendlist[i]).mouseup(function(e) {
                    if (e.which === 1) {
                        var user_id = ret.friend_list[index].uid;
                        var user_name = ret.friend_list[index].name;
                        setTableClick(e.clientX, e.clientY, user_id, user_name, ret.friend_list);
                    }
                })
            })(i);
        }
	});
}

function user_getinRoom(room_id) {
    $('#id_uid').attr('value', curr_user.uid);
    $('#id_lid').attr('value', 1);
    $('#id_rid').attr('value', room_id);
    document.into_room_form.action = "/gobang/";
    document.into_room_form.submit();
}

function reDeployLobby() {
	var section = $('section');
	section.css('width', $('body').width() - 10);
	section.css('height', $(window).height() - 180);
	var userlist = $('#userlist');
	userlist.css('height', ($(window).height() - 200) / 2);
    userlist.css('overflow-y', 'scroll');
	var friendlist = $('#friendlist');
	friendlist.css('height', ($(window).height() - 200) / 2);
    friendlist.css('overflow-y', 'scroll');
	var lobbyarea = $('#lobbyarea');
	lobbyarea.css('width', $('body').width() - 278);
	lobbyarea.css('height', $(window).height() - 200);
	setTables();

	var score_window = $('#score-window');
	score_window.css('left', ($(window).width() - 400) / 2);
	score_window.css('top', ($(window).height() - 600) / 2);
}