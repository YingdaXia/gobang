var curr_user_id = curr_user.uid;
var message_length = 0;
var message_list;

function isSmallWindow() {
	return $('#small-window').length != 0;
}

function setSmallWindow() {
	$('#small-window').remove();
	$('#pop-window').remove();
	var smallwindow = $('<div id="small-window">聊天</div>');
	smallwindow.css('width', 190);
	smallwindow.css('height', 35);
	smallwindow.css('line-height', smallwindow.height() + "px");
	smallwindow.css('left', $(window).width() - smallwindow.width() - 60);
	smallwindow.css('top', $(window).height() - smallwindow.height());
	smallwindow.mouseup(function(e) {
		if (e.which === 1 && typeof(message_list) != "undefined") {
			setPopWindow();
			message_setpeople();
		}
	})
	$('body').append(smallwindow);
}

function resetSmallWindow() {
	var smallwindow = $('#small-window');
	smallwindow.css('left', $(window).width() - smallwindow.width() - 60);
	smallwindow.css('top', $(window).height() - smallwindow.height());
}

function setPopWindow() {
	$('#small-window').remove();
	$('#pop-window').remove();
	var popwindow = $('<div id="pop-window"></div>');
	popwindow.css('width', 600);
	popwindow.css('height', 400);
	popwindow.css('left', $(window).width() - popwindow.width());
	popwindow.css('top', $(window).height() - popwindow.height());

	var con_list = $('<div id="con-list"></div>');
	popwindow.append(con_list);

	var con_title = $('<div id="con-title"></div>');
	var con_title_content = $('<div id="con-title-content"></div>');
	con_title.append(con_title_content);
	popwindow.append(con_title);
	var con_title_exit = $('<div id="con-title-exit">×</div>');
	con_title_exit.mouseup(function(e) {
		if (e.which === 1) {
			popwindow.remove();
			setSmallWindow();
		}
	})
	con_title.append(con_title_exit);

	var con_content = $('<div id="con-content"></div>');
	popwindow.append(con_content);

	var con_input = $('<div id="con-input"></div>');
	popwindow.append(con_input);
	var con_input_text = $('<textarea id="con-input-textarea" placeholder="按回车发送消息"></textarea>');
	con_input_text.keypress(function(e) {
		if (e.keyCode == 13) {
			if (isRubbishMessage($('#con-input-textarea').val()) === false) {
				message_send();
			}
			return false;
		}
	});
	con_input.append(con_input_text);

	$('body').append(popwindow);
}

function isRubbishMessage(s) {
	if (s === "") {
		return true;
	}
	var length = s.length;
	for (var i = 0; i < length; ++i) {
		if (s.charAt(i) != ' ') {
			return false;
		}
	}
	return true;
}

function resetPopWindow() {
	var popwindow = $('#pop-window');
	popwindow.css('left', $(window).width() - popwindow.width());
	popwindow.css('top', $(window).height() - popwindow.height());
}

function message_send() {
	$.getJSON("/send_message/", {
		'start_id': curr_user_id,
		'end_name': $('#con-title-content').html(),
		'content': $('#con-input-textarea').val()
	}, function(ret) {
		$('#con-input-textarea').val('');
	});
}

function message_filter(fname) {
	var length = message_list.message_list.length;
	var messages = new Array();
	for (var i = 0; i < length; ++i) {
		message = message_list.message_list[i];
		if (message.start_name === fname || message.end_name === fname) {
			messages.push(message);
		}
	}
	return messages;
}

function message_setpeople() {
	var list = $('#con-list');
	list.empty();
	for (var i = message_list.user_name.length - 1; i >= 0; --i) {
		var element = $('<div class="con-list-person"></div>');
		var head = $('<img class="con-list-head" />');
		head.attr('src', '/static/image/head_icon' + message_list.user_iconnum[i] + '.jpg');
		var name = $('<span class="con-list-name"></span>');
		name.html(message_list.user_name[i]);
		element.append(head);
		element.append(name);
		var unreadnumber = getUnreadMessageNumber(message_list.user_name[i]);
		if (unreadnumber != 0) {
			var unread_number = $('<span class="con-list-unread"></span>');
			unread_number.html(unreadnumber);
			element.append(unread_number);
		}
		var curr_name = name.html();
		element.mouseup(function(e) {
			if (e.which === 1) {
				//debugger;
				var fname = $(this).children(".con-list-name").html()
				$('#con-title-content').html(fname);
				message_setcontent(fname);
				$(this).children(".con-list-unread").remove();
			}
		});
		list.append(element);
	}
}

function getUnreadMessageNumber(fname) {
	var messages = message_filter(fname);
	var length = messages.length;
	var count = 0
	for (var i = 0; i < length; ++i) {
		if (messages[i].read === false && messages[i].start_name === fname) {
			++count;
		}
	}
	return count;
}

function message_geticonnum(name) {
	var length = message_list.user_name.length;
	for (var i = 0; i < length; ++i) {
		if (message_list.user_name[i] === name) {
			return message_list.user_iconnum[i];
		}
	}
}

function message_setcontent(name) {
	var area = $('#con-content');
	area.empty();
	var messages = message_filter(name);

	var length = messages.length;
	for (var i = 0; i < length; ++i) {
		//debugger;
		if (messages[i].start_name === name) {		// 对方发送的消息
			var row = $('<div class="con-content-row"></div>');
			row.css('float', 'left');
			var head = $('<img class="con-content-head" />');
			head.attr('src', '/static/image/head_icon' + message_geticonnum(name) + '.jpg');
			head.css('float', 'left');
			var bubble = $('<span class="con-content-bubble"></span>');
			bubble.css('margin-left', 10);
			if (messages[i].friend_request === 1) {
				bubble.html("对方向你发送好友请求<br /><a class='accept' href='javascript:void(0);' style='float: left;'>接受</a><a class='reject' href='javascript:void(0);' style='float: right;'>拒绝</a>");
			} else if (messages[i].friend_request === 2) {
				bubble.html("对方向你发送好友请求");
			} else {
				bubble.html(messages[i].content);
			}
			bubble.css('float', 'left');
			row.append(head);
			row.append(bubble);
			area.append(row);
			$('.accept').click(function(e) {
				accept_friend_request(name);
			});
			$('.reject').click(function(e) {
				reject_friend_request(name);
			})
		} else {									// 自己发送的消息
			var row = $('<div class="con-content-row"></div>');
			row.css('float', 'left');
			var head = $('<img class="con-content-head" />');
			head.attr('src', '/static/image/head_icon' + curr_user.iconnum + '.jpg');
			head.css('float', 'right');
			var bubble = $('<span class="con-content-bubble"></span>');
			bubble.css('margin-right', 10);
			if (messages[i].friend_request === 1) {
				bubble.html("你向对方发送好友请求");
			} else if (messages[i].friend_request === 2) {
				bubble.html("你向对方发送好友请求");
			} else {
				bubble.html(messages[i].content);
			}
			bubble.css('float', 'right');
			row.append(head);
			row.append(bubble);
			area.append(row);
		}
	}
	document.getElementById('con-content').scrollTop = document.getElementById('con-content').scrollHeight;

	message_isread(name);
}

function message_isread(fname) {
	$.getJSON("/read_message/", {
		'fname': fname,
		'uid': curr_user_id
	});
}

function hasUnreadMessage(message_list) {
	var length = message_list.length;
	for (var i = 0; i < length; ++i) {
		var message = message_list[i];
		if (message.read === false && message.end_id === curr_user_id) {
			return true;
		}
	}
	return false;
}

function message_data() {
	$.getJSON("/message_data/", {
		'uid': curr_user_id
	}, function(ret) {
		if (isSmallWindow() === true && hasUnreadMessage(ret.message_list) === true) {
			var smallwindow = $('#small-window');
			smallwindow.html("您有未读消息");
			smallwindow.css('color', '#eb7350');
		}

		message_list = ret;
		message_length = ret.message_list.length;
		if (isSmallWindow() === false) {
			message_setpeople();
			var fname = $('#con-title-content').html();
			if (fname != "") {
				message_setcontent(fname);
			}
		}
	});
}

function accept_friend_request(fname) {
	$.getJSON("/accept_friend_request/", {
		'uid': curr_user_id,
		'fname': fname
	});
}

function reject_friend_request(fname) {
	$.getJSON("/reject_friend_request/", {
		'uid': curr_user_id,
		'fname': fname
	});
}

function sendMessageRequest(fname) {
	setPopWindow();
	message_setpeople();
	debugger;
	for (var i = 0; i < message_list.user_name.length; ++i) {
		if (fname === message_list.user_name[i]) {
			$('#con-title-content').html(fname);
			message_setcontent(fname);
			return;
		}
	}
	$.getJSON("/get_iconnum/", {
		'fname': fname
	}, function(ret) {
		var element = $('<div class="con-list-person"></div>');
		var head = $('<img class="con-list-head" />');
		head.attr('src', '/static/image/head_icon' + ret + '.jpg');
		var name = $('<span class="con-list-name"></span>');
		name.html(fname);
		element.append(head);
		element.append(name);
		var curr_name = name.html();
		$('#con-title-content').html(fname);
		var list = $('#con-list');
		list.append(element);
	});
}

$(window).load(function() {
	setSmallWindow();
	setInterval(message_data, 1000);
});

$(window).resize(function() {
	if (isSmallWindow() === true) {
		resetSmallWindow();
	} else {
		resetPopWindow();
		message_setpeople();
	}
});
