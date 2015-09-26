function send_online_status(curr_user_id) {
	$.getJSON('/online_status/', {
		'uid': curr_user_id
	});
}