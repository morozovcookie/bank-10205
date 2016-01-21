app.controller('mainController', function($scope, $cookieStore, $window){
	if ($window.localStorage.getItem('user')==undefined)
		$window.location.href = serv_addr + 'admin/authentication.html';
	else
	
		$window.location.href = serv_addr + 'admin/admin.html';
});