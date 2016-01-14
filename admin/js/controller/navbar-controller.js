admin.controller('navbarController', function($scope, $cookieStore, $window){
	if ($window.localStorage.getItem('user')==undefined)
		$window.location.href = serv_addr + 'admin/index.html';

	$scope.exit = function(){
		$window.localStorage.removeItem('user');
		$window.location.href = serv_addr + 'admin/index.html';
	}
});