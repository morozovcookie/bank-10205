client.controller('navbarController', function($scope, $window){
	$scope.username = JSON.parse($window.localStorage.getItem('client')).user.username;
	$scope.exit = function(){
		$window.localStorage.removeItem('client');
		$window.location.href = serv_addr + 'client/index.html';
	}
});