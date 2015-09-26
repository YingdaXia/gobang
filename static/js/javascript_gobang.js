var mycolor;											//用户使用棋子颜色
var myturn = false;										//是否为用户回合
var gaming = false;
var room_id;											//当前游戏所在房间ID
var game_id;											//当前游戏ID
var user_id;											//记录user为玩家1或玩家2
var length_block;										//当前页面棋盘一个格子的大小
var length_border;										//当前页面棋盘边缘的大小
var player1 = new Object(); 							//保存玩家1信息
var player2 = new Object();								//保存玩家2信息
var step = 0;											//当前游戏进行步数
var s_left1 = 30;										//玩家1剩余时间
var s_left2 = 30;										//玩家2剩余时间
var continuous_game = false;							//是否为两人连续进行游戏
var first_game = true;
var ready = false;

var all_pieces = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
//记录棋盘状态，0记录空格子，1记录黑棋，2记录白棋


//初始化页面布局
function init_gobang(){
	if (myturn == true) {
		if (mycolor == "black") {
			$('.checkerboard').css("cursor","url('/static/image/gobang_black_piece_icon.ico'),auto");
		}else{
			$('.checkerboard').css("cursor","url('/static/image/gobang_white_piece_icon.ico'),auto");
		}
	}
	$('.pieces').empty();
	viewH =$(this).height();
	viewW =$(this).width();
	var container_height = 0.8 * viewH,
		container_width = 1.8 * container_height,
		container_top = 0.1 * viewH,
		container_left = 0.5 * (viewW - container_width),
		checkerboard_height = container_height,
		checkerboard_width = container_height,
		checkerboard_left = 0.5 * (container_width - checkerboard_width),
		pop_out_top = viewH / 2 - 90,
		pop_out_left = viewW / 2 - 120;
	length_border = 22 / 538 * checkerboard_width;
	length_block = (checkerboard_width - 2 * length_border) / 14;

  	height_button = container_height / 20;
  	width_button = 0.19 * checkerboard_width;
  	$('.myButton').css({
  		'width': width_button
  	});
	$('.gobang_container').css({
		'height':container_height,
		'width':container_width,
		'top':container_top,
		'left':container_left
	});
	$('.checkerboard').css({
		'height':container_height,
		'left':checkerboard_left,
		'width':checkerboard_width
	});
	$('.checkerboard_img').css({
		'height':checkerboard_height,
		'width':checkerboard_width
	});
	
  	$('#giveup_button').css({
  		'bottom': - height_button - 20,
  		'left': 0
  	});
  	$('#start_button').css({
  		'bottom': - height_button - 20,
  		'left': 0.27 * container_height
  	});
  	$('#exit_button').css({
  		'bottom': - height_button - 20,
  		'left': 0.54 * container_height
  	});
  	$('#draw_button').css({
  		'bottom': - height_button - 20,
  		'left': 0.81 * container_height
  	});
  	$('.player').css({
  		'height': 0.5 *container_height - 10,
  		'width': 0.5 * (container_width - checkerboard_width) - 10,
  		'left': '5px'
 	});
  	$('.player1').css('top', '2px');
  	$('.player2').css('bottom', '2px');
  	$('.player_pic').css({
  		'height': 0.25 *container_height,
  		'width': 0.5 * (container_width - checkerboard_width)-20,
  		'left': '5px',
  		'top': '5px'
  	});
  	$('.player_info').css('top', 0.25 *container_height + 15);
  	$('.player1_pic').attr('src',player1.pic);
  	$('.player2_pic').attr('src',player2.pic);
  	$('.player1_name').html(player1.name);
  	$('.player2_name').html(player2.name);
	$('.user_name1').html(player1.name);
	$('.user_info_score1').html(player1.score);
	$('.user_info_win_num1').html(player1.win_num);
	$('.user_info_tie_num1').html(player1.tie_num);
	$('.user_info_lose_num1').html(player1.lose_num);
	$('.user_name2').html(player2.name);
	$('.user_info_score2').html(player2.score);
	$('.user_info_win_num2').html(player2.win_num);
	$('.user_info_tie_num2').html(player2.tie_num);
	$('.user_info_lose_num2').html(player2.lose_num);
  	$('.user_info1').css({
  		'height': 0.5 *container_height - 10,
  		'width': 0.5 * (container_width - checkerboard_width) - 10,
  		'right': '5px',
  		'top': '2px'
  	});
	$('.user_info2').css({
  		'height': 0.5 *container_height - 10,
  		'width': 0.5 * (container_width - checkerboard_width) - 10,
  		'right': '5px',
  		'bottom': '2px'
  	});
	$('.current_state').css('height', 0.08 *container_height);
	$('.pop_out').css({
  		'top': pop_out_top,
  		'left': pop_out_left
  	});
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (all_pieces[i][j] != 0) {
				var piecediv = $('<li>');
				var pieceimgdiv = $('<img>');
				pieceimgdiv.attr({
					"class":"piece",
					"style":"height:" + (length_block) + "px;width:" + (length_block) + "px;top:" + ((j - 0.5) * length_block + length_border) + "px;left:" + ((i - 0.5) * length_block + length_border) + "px"
				});
				if (all_pieces[i][j] == 1) {
					pieceimgdiv.attr("src","/static/image/gobang_black_piece.png");
				}else{
					pieceimgdiv.attr("src","/static/image/gobang_white_piece.png");
				}
				pieceimgdiv.appendTo(piecediv);
				piecediv.appendTo('.pieces');
			}
		}
	}
}

function init_pieces(){
	$('.piece').remove();
	for(var i = 0;i < 15;i++){
		for(var j = 0;j < 15;j++){
			all_pieces[i][j] = 0;
		}
	}
	init_gobang();
}

//判断obj是否为空
function isEmptyObject(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}

//读取进入房间时房间内所有玩家信息
function load_player_data(){
    if (isEmptyObject(player_1) === false) {
        player1.name = player_1.name;
        player1.score = player_1.score;
        player1.win_num = player_1.win_num;
        player1.lose_num = player_1.lose_num;
        player1.tie_num = player_1.tie_num;
        player1.pic = "/static/image/login_icon"+player_1.iconnum+".jpg";
        player1_piececolor = "white";

    }
    if (isEmptyObject(player_2) === false) {
        player2.name = player_2.name;
        player2.score = player_2.score;
        player2.win_num = player_2.win_num;
        player2.lose_num = player_2.lose_num;
        player2.tie_num = player_2.tie_num;
        player2.pic = "/static/image/login_icon"+player_2.iconnum+".jpg";
		setTimeout('queryIfExitRoom()', 200);
		setTimeout('queryIfReady()', 1000);
    }else{
		setTimeout('loadAnotherPlayer()', 1000);
	}
	room_id = room.id;
	user_id = user.id;
	if(user_id==2){
		queryIfKicked();
	}
}

//循环调用检查是否第二位玩家进入房间，如果进入，停止循环并读取玩家信息
function loadAnotherPlayer(){
	$.get("/wait_for_player/",{'room_id':room_id}, function(ret){
		if(ret != 'Waiting'){
			player2.name = ret.name;
			player2.score = ret.score;
			player2.win_num = ret.win_num;
			player2.lose_num = ret.lose_num;
			player2.tie_num = ret.tie_num;
			player2.pic = "/static/image/login_icon"+ret.iconnum+".jpg";
			init_gobang();
			setTimeout('queryIfReady()', 1000);
			setTimeout('queryIfExitRoom()', 200);
		}else {
			setTimeout('loadAnotherPlayer()', 1000);
		}
	});
}

function queryIfReady(){
	if(ready == false) {
		$.get("/if_ready/", {'user_id': user_id, 'room_id': room_id}, function (ret) {
			if (ret == 'ready' && gaming == false) {
				$('.current_state' + (3 - user_id)).attr('src', '/static/image/ready.png');
			} else {
				setTimeout('queryIfReady()', 1000);
			}
		});
	}
}

//在棋盘上下棋
function addPiece(){
	if(gaming == true){
		if (myturn == true) {
			var objTop = $(".checkerboard").css("top");//对象x位置
			var objLeft = $(".checkerboard").css("left");//对象y位置
			var objTop1 = $(".gobang_container").css("top");
			var objLeft1 = $(".gobang_container").css("left");
			var mouseX = event.clientX+document.body.scrollLeft + 16;//鼠标x位置
			var mouseY = event.clientY+document.body.scrollTop + 16;//鼠标y位置

			var objX = parseInt((mouseX - parseInt(objLeft) - parseInt(objLeft1)- length_border) / length_block + 0.5);
			var objY = parseInt((mouseY - parseInt(objTop) - parseInt(objTop1) - length_border) / length_block + 0.5);
			if (all_pieces[objX][objY] == 0) {
				step++;
				uploadSinglePiece(objX, objY);
				if (mycolor == "black") {
					all_pieces[objX][objY] = 1;
				}else{
					all_pieces[objX][objY] = 2;
				}
				$('.checkerboard').css("cursor","auto");
				var piecediv = $('<li>');
				var pieceimgdiv = $('<img>');
				pieceimgdiv.attr({
					"class":"piece",
					"style":"height:" + (length_block) + "px;width:" + (length_block) + "px;top:" + ((objY - 0.5) * length_block + length_border) + "px;left:" + ((objX - 0.5) * length_block + length_border) + "px"
				});
				if (all_pieces[objX][objY] == 1) {
					pieceimgdiv.attr("src","/static/image/gobang_black_piece.png");
				}else{
					pieceimgdiv.attr("src","/static/image/gobang_white_piece.png");
				}
				pieceimgdiv.appendTo(piecediv);
				piecediv.appendTo('.pieces');
				if (checkEnd(objX, objY) == true) {
					$('.you_win').css('display','block');
					gameIsOver('win');
				}else {
					myturn = false;
					s_left1 = 30;
					s_left2 = 30;
					setTimeout("queryNewStep(game_id,step + 1)", 1000);
				}
			}
		}else{
			alert("请等待对方下棋");
		}
	}else{
		alert("游戏还未开始");
	}
}

//向服务器上传下的棋子位置
function uploadSinglePiece(x, y) {
	if (mycolor == 'black'){
		$.get("/add_step/",{'game_id':game_id,'step_id':step,'color_piece':1,'position_x':x,'position_y':y}, function(ret){
        	if (ret == 'game is over'){
				alert("游戏已结束");
			}
		});
	}else{
		$.get("/add_step/",{'game_id':game_id,'step_id':step,'color_piece':2,'position_x':x,'position_y':y}, function(ret){
			if (ret == 'game is over'){
				alert("游戏已结束");
			}
        });
	}
}

//当不是自己回合时循环调用检查对手是否下棋
function queryNewStep(_game, _step) {
	if(gaming){
		$.get("/get_new_step/",{'game_id':_game,'step_id':_step}, function(ret){
			if (ret != 'Not Found') {
				myturn = true;
				s_left1 = 30;
				s_left2 = 30;
				step++;
				addSingleStep(ret.color_piece,ret.position_x,ret.position_y);
			}else{
				setTimeout("queryNewStep(game_id,step + 1)",1000);
			}
		});
	}
}

//循环调用是否被踢
function queryIfKicked(){
	if(user_id == 1){
		var player_name = player1.name;
	}else{
		var player_name = player2.name;
	}
	$.get("/if_kicked/",{'user_id':user_id,'room_id':room_id,'player_name':player_name},function(ret){
		if(ret.result == 'no'){
			if(gaming === false){
				setTimeout("queryIfKicked()",1000);
			}
		}
		else{
			alert("您被踢出房间");
			window.close();
		}
	});
}

//将从服务器上获取到的对手下棋信息显示到页面上
function addSingleStep(color,x,y) {
	if (color == 1) {
		all_pieces[x][y] = 1;
		$('.checkerboard').css("cursor","url('/static/image/gobang_white_piece_icon.ico'),auto");
	}else{
		all_pieces[x][y] = 2;
		$('.checkerboard').css("cursor","url('/static/image/gobang_black_piece_icon.ico'),auto");
	}
	var piecediv = $('<li>');
	var pieceimgdiv = $('<img>');
	pieceimgdiv.attr({
		"class":"piece",
		"style":"height:" + (length_block) + "px;width:" + (length_block) + "px;top:" + ((y - 0.5) * length_block + length_border) + "px;left:" + ((x - 0.5) * length_block + length_border) + "px"
	});
	if (all_pieces[x][y] == 1) {
		pieceimgdiv.attr("src","/static/image/gobang_black_piece.png");
	}else{
		pieceimgdiv.attr("src","/static/image/gobang_white_piece.png");
	}
	pieceimgdiv.appendTo(piecediv);
	piecediv.appendTo('.pieces');
	if (checkEnd(x, y) == true) {
		$('.you_lose').css('display','block');
		gameIsOver('lose');
		initRoomInfo();
	}
}

//向服务器传输游戏结束信息
function gameIsOver(str){
	var result;
	ready = false;
	setTimeout('queryIfReady()', 2000);
	step = 0;
	gaming = false;
	$('.checkerboard').css("cursor","auto");
	if (str == 'win') {
		if(user_id == 1){
			player1.win_num++;
			player1.score += 3;
			player2.lose_num++;
			player2.score +=0;
		}else{
			player1.lose_num++;
			player1.score += 0;
			player2.win_num++;
			player2.score += 3;
		}
		result = 1;
	}else if (str == 'tie') {
		player1.tie_num++;
		player1.score += 1;
		player2.tie_num++;
		player2.score += 1;
		result = 3;
	}else{
		if(user_id == 1){
			player1.lose_num++;
			player1.score += 0;
			player2.win_num++;
			player2.score += 3;
		}else{
			player1.win_num++;
			player1.score += 3;
			player2.lose_num++;
			player2.score +=0;
		}
		result = 2;
	}
	$('.current_state1').attr('src','');
	$('.current_state2').attr('src','');
	myturn = false;
	$.get("/game_over/",{'player_id':user_id,'game_id':game_id,'game_result':result}, function(ret){
	});
	init_gobang();
}

//通过新下的棋子判断是否游戏结束
function checkEnd(x, y){
	var temp = all_pieces[x][y];
	var continuous_num = 0;
	//向右连成五子
	for (var i = x, j = y; i <= x + 4 && i<= 14; i++) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//右下
	for (var i = x, j = y; i <= x + 4 && i<= 14 && j <= y + 4 && j<= 14; i++,j++) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//下
	for (var i = x, j = y; j <= y + 4 && j<= 14; j++) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//左下
	for (var i = x, j = y; i >= x - 4 && i >= 0 && j <= y + 4 && j <= 14; i--, j++) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//左
	for (var i = x, j = y; i >= x - 4 && i >= 0; i--) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//左上
	for (var i = x, j = y; i >= x - 4 && i >= 0 && j >= x - 4 && j >= 0; i--, j--) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//上
	for (var i = x, j = y; j >= x - 4 && j >= 0; j--) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;

	//右上
	for (var i = x, j = y; i <= x + 4 && i<= 14 && j >= x - 4 && j >= 0; i++,j--) {
		if (all_pieces[i][j] == temp) {
			continuous_num++;
			if (continuous_num == 5) {
				return true;
			}
		}else{
			break;
		}
	}
	continuous_num = 0;
	return false;
}

//向服务器上传已准备信息，如果自己是第一位准备的玩家，则等待第二位玩家准备，若为第二位准备的玩家，游戏开始，初始化颜色回合等数据
function readyForGame(){
	if(gaming == false) {
		ready = true;
		$.get("/ready_for_game/", {'room_id': room_id, 'user_id': user_id}, function (ret) {
			if (ret == 'Wait For Another Player') {
				$('.current_state' + user_id).attr('src','/static/image/ready.png');
				setTimeout('waitForAnotherPlayer()', 1000)
			} else {
				if(continuous_game){
					if(mycolor == 'black'){
						mycolor = 'white';
						myturn = false;
						setTimeout("queryNewStep(game_id,step+1)", 1000);
					}else{
						$('.checkerboard').css("cursor", "url('/static/image/gobang_black_piece_icon.ico'),auto");
						mycolor = 'black';
						myturn = true;
					}
				}
				if (ret.user_color == 1) {
					game_id = ret.game_id;
					if(!continuous_game) {
						$('.checkerboard').css("cursor", "url('/static/image/gobang_black_piece_icon.ico'),auto");
						mycolor = 'black';
						myturn = true;
					}
					gaming = true;
					$(".kick").css("display","none");
					continuous_game = true;
				} else {
					if(!continuous_game){
						mycolor = 'white';
						myturn = false;
						setTimeout("queryNewStep(game_id,step+1)", 1000);
					}
					game_id = ret.game_id;
					gaming = true;
					continuous_game = true;
				}
				$('.current_state' + user_id).attr('src','/static/image/gobang_'+mycolor+'_piece.png');
				if(mycolor == 'black'){
					$('.current_state' + (3 - user_id)).attr('src','/static/image/gobang_white_piece.png');
				}else{
					$('.current_state' + (3 - user_id)).attr('src','/static/image/gobang_black_piece.png');
				}
				init_pieces();
				setTimeout('getGameRequest()', 1000);
			}
			if(first_game){
				timer();
				first_game = false;
			}
		});
	}else{
		alert("游戏已开始");
	}
}

//循环调用，判断另一位玩家是否准备，若准备好，游戏开始，初始化颜色回合等数据
function waitForAnotherPlayer(){
	$.get("/wait_for_player_ready/",{'room_id':room_id,'user_id':user_id}, function(ret) {
		if (ret == 'Wait For Another Player') {
			setTimeout('waitForAnotherPlayer()', 1000)
		}else{
			if(continuous_game){
				if(mycolor == 'black'){
					mycolor = 'white';
					myturn = false;
					setTimeout("queryNewStep(game_id,step+1)", 1000);
				}else{
					$('.checkerboard').css("cursor", "url('/static/image/gobang_black_piece_icon.ico'),auto");
					mycolor = 'black';
					myturn = true;
				}
			}
			if (ret.user_color == 1){
				if(!continuous_game){
					$('.checkerboard').css("cursor","url('/static/image/gobang_black_piece_icon.ico'),auto");
					mycolor = 'black';
					myturn = true;
				}
				continuous_game = true;
				game_id = ret.game_id;
				gaming = true;
			}else{
				if(!continuous_game){
					mycolor = 'white';
					myturn = false;
            		setTimeout("queryNewStep(game_id,step+1)",1000);
				}
				continuous_game = true;
				game_id = ret.game_id;
				gaming = true;
			}
			$('.current_state' + user_id).attr('src','/static/image/gobang_'+mycolor+'_piece.png');
			if(mycolor == 'black'){
				$('.current_state' + (3 - user_id)).attr('src','/static/image/gobang_white_piece.png');
			}else{
				$('.current_state' + (3 - user_id)).attr('src','/static/image/gobang_black_piece.png');
			}
			init_pieces();
			setTimeout('getGameRequest()', 1000);
		}
	});
}

function uploadGameRequest(str){
	if(gaming == true) {
		var request_type;
		if (str == 'ask for tie') {
			request_type = 3 - user_id;
		} else if (str == 'refuse to tie') {
			request_type = 5 - user_id;
		} else if (str == 'agree to tie') {
			request_type = 7 - user_id;
		} else if (str == 'give up') {
			request_type = 9 - user_id;
			gameIsOver('lose');
		} else if (str == 'exit room'){
			request_type = 7;
			gameIsOver('lose');
		}
		$.get("/save_player_game_request/", {'room_id': room_id, 'request_type': request_type}, function (ret) {
		});
	}else{
		alert("游戏还未开始");
	}
}

function getGameRequest() {
	if(gaming == true){
		$.get("/load_player_game_request/", {'room_id': room_id}, function (ret) {
			if(ret.type - user_id == 0 || ret.type - user_id == 2 || ret.type - user_id == 4 || ret.type - user_id == 6){
				if (ret.type - user_id == 0){
					$('.ask_for_draw').css('display', 'block');
				}else if (ret.type - user_id == 2){
					alert("对方不同意求和");
				}else if (ret.type - user_id == 4) {
					gameIsOver('tie');
					initRoomInfo();
					alert("对方同意求和,游戏结束");
				}else if (ret.type - user_id == 6){
					gameIsOver('win');
					initRoomInfo();
					alert("对方认输");
				}
				var request_type = 0;
				$.get("/save_player_game_request/", {'room_id': room_id,'request_type':request_type}, function (ret) {
				});
			}
		});
		setTimeout('getGameRequest()', 1000);
	}
}

function initRoomInfo(){
	$.get("/init_room_info/", {'game_id': game_id}, function (ret) {
	});
}

function exitRoom(){
	$.get("/exit_room/", {'room_id': room_id,'user_id':user_id}, function (ret) {
	});
}

function queryIfExitRoom(){
	if(user_id == 1){
		var player_name = player1.name;
	}else{
		var player_name = player2.name;
	}
	$.get("/if_exit_room/", {'room_id': room_id,'user_id':3 - user_id,'player_name':player_name}, function (ret) {
		if(ret == 'player1 exit room'){
			$('.current_state1').attr('src','');
			$('.current_state2').attr('src','');
			player1 = player2;
			player2 = new Object();
			player2.name = '';
			player2.score = '';
			player2.win_num = '';
			player2.lose_num = '';
			player2.tie_num = '';
			player2.pic = "";
			user_id = 1;
			if(ready){
				ready = false;
				setTimeout('queryIfReady()', 1000);
			}
			init_gobang();
			setTimeout('loadAnotherPlayer()', 1000);
			continuous_game = false;
		}else if(ret == 'player2 exit room'){
			$('.current_state1').attr('src','');
			$('.current_state2').attr('src','');
			player2 = new Object();
			player2.name = '';
			player2.score = '';
			player2.win_num = '';
			player2.lose_num = '';
			player2.tie_num = '';
			player2.pic = "";
			if(ready){
				ready = false;
				setTimeout('queryIfReady()', 1000);
			}
			init_gobang();
			setTimeout('loadAnotherPlayer()', 1000);
			continuous_game = false;
		}else{
			setTimeout('queryIfExitRoom()', 200);
		}
	});
}

window.onbeforeunload = function(){
	if(gaming){
		uploadGameRequest('exit room');
	}
	exitRoom();
};

//点击开始按钮事件
$(function(){
	$('#start_button').click(function(){
		readyForGame();
	});
});

//点击认输按钮事件
$(function(){
	$('#giveup_button').click(function(){
		if(gaming == true){
			$('.confirm_give_up').css('display','block');
		}else{
			alert("游戏尚未开始");
		}
	});
});

//点击退出按钮
$(function(){
	$('#exit_button').click(function(){
		if(gaming){
			uploadGameRequest('exit room');
		}
		setTimeout('exitRoom()',100);
		setTimeout(function() {
			window.close();
		}, 200);
	});
});

//确定认输事件
$(function(){
	$('.confirm_give_up .sure').click(function(){
		uploadGameRequest('give up');
		$('.confirm_give_up').css('display','none');
	});
});

//取消认输事件
$(function(){
	$('.confirm_give_up .cancel').click(function(){
		$('.confirm_give_up').css('display','none');
	});
});

//点击求和按钮事件
$(function(){
	$('#draw_button').click(function(){
		if(gaming == true) {
			$('.confirm_ask_for_draw').css('display', 'block');
		}else{
			alert("游戏尚未开始");
		}
	});
});

//确定求和事件
$(function(){
	$('.confirm_ask_for_draw .sure').click(function(){
		uploadGameRequest('ask for tie');
		$('.confirm_ask_for_draw').css('display','none');
	});
});

//取消求和事件
$(function(){
	$('.confirm_ask_for_draw .cancel').click(function(){
		$('.confirm_ask_for_draw').css('display','none');
	});
});

//允许求和事件
$(function(){
	$('.ask_for_draw .sure').click(function(){
		uploadGameRequest('agree to tie');
		$('.ask_for_draw').css('display','none');
		gameIsOver('tie');
	});
});

//拒绝求和事件
$(function(){
	$('.ask_for_draw .cancel').click(function(){
		uploadGameRequest('refuse to tie');
		$('.ask_for_draw').css('display','none');
	});
});

$(function(){
	$('#sure_to_lost').click(function(){
		$('.you_lose').css('display','none');
	});
});

$(function(){
	$('#sure_to_win').click(function(){
		$('.you_win').css('display','none');
	});
});

//页面大小改变事件
$(window).resize(function(){
	init_gobang();
});

//计时器函数
function timer(){
	if(gaming){
		if(myturn){
			s = s_left1;
			if(s<10){
				s = '0'+s;
			}
			if(user_id == 1){
				document.getElementById('timer1').innerHTML = s + '';
			}
			else{
				document.getElementById('timer2').innerHTML = s+'';
			}
			s_left1--;
			if(s_left1==0){
				uploadGameRequest('give up');
				s_left1 = 30;
				s_left2 = 30;
			}
		}
		else{
			var s = s_left2 % 60;
			if(s<10){
				s = '0'+s;
			}
			if(user_id == 1){
				document.getElementById('timer2').innerHTML =s+'';
			}
			else{
				document.getElementById('timer1').innerHTML =s+'';
			}
			s_left2--;
			if(s_left2==0){
				s_left1 = 30;
				s_left2 = 30;
			}
		}
	}
	setTimeout("timer()", 1000);
}

//踢人事件
$(function(){
	$('#kick2').click(function(){
		if(user_id == 2){
			alert("你不是房主");
		}else if(gaming){
			alert("游戏中途不能踢人");
		}else {
			$.get("/kick/", {'room_id': room_id}, function (ret) {
			});
		}
	});
});
