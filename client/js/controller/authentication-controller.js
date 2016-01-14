auth.controller('authenticationController', function($scope, $window, $http){
	$scope.auth_user = function(user){
		$http.get(serv_addr + 'server/user.auth?username=' + user.username + '&password=' + user.password)
			.success(function(response){
				if (response!='null')
				{
					$window.localStorage.setItem('client', JSON.stringify(response));
					$window.location.href = serv_addr + 'client/index.html';
				}
			});
	}
});