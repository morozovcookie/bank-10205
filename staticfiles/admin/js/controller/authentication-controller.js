auth.controller('authenticationController', function($scope, $cookieStore, $window, $http){
	$scope.auth_user = function(user){
		$http.get(serv_addr + 'server/admin.auth?username=' + user.username + '&password=' + user.password)
			.success(function(response){
				$window.localStorage.setItem('user', JSON.stringify(response));
				$window.location.href = serv_addr + 'admin/admin.html';
			});
	}
});