admin.controller('updateuserController', function($scope, $rootScope, $location){
	
	$rootScope.set_user = function(user)
	{
		$scope.user = {
			id: user.id,
			username: user.username,
			password: user.password,
			firstname: user.firstname,
			secondname: user.secondname
		};
	}

	$scope.save = function(user)
	{
		$.post(serv_addr + 'server/admin.update_user', user).success(function(){
			$('body').removeClass('modal-open');
			$('.modal-backdrop').detach();
			$rootScope.$apply(function(){
				$location.path('userlist/');
			});
		});
	}
});