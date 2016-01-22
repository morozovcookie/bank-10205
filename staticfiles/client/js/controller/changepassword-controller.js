client.controller('changePasswordController', function($scope, $http, $window){
	$scope.change = function(password){
		if (password.new==password.repeat)
		{
			$.post(serv_addr + 'server/user.passwd', {
				id: JSON.parse($window.localStorage.getItem('client')).user.id,
				old: password.old,
				new: password.new
			}).success(function(){
				$scope.password = {
					new: '',
					old: '',
					repear: ''
				};
			});
		}
	}
});