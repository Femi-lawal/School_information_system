$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var confirmation = confirm('Are You Sure?');

	if(confirmation){
		$.ajax({
			type:'DELETE',
			url: '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		window.location.replace('/');
	} else {
		return false;
	}
}

$(document).ready(function(){
	$('.findModifyUser').on('click', findModifyUser);
});

function findModifyUser(){
	var confirmation = confirm('Edit/Update this user?');

	if(confirmation){
		$.ajax({
			type:'UPDATE',
			url: '/users/update/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		window.location.replace('/');
	} else {
		return false;
	}
} 