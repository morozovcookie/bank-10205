client.controller('profileController', function($scope, $http, $window){
	$http.get(serv_addr + 'server/user.get?id=' + JSON.parse($window.localStorage.getItem('client')).user.id)
	.success(function(response){
		$scope.username = response.user.username;
		$scope.fullname = response.user.secondname + ' ' + response.user.firstname;
		if (response.user.logo=='null')
		{
			$scope.logo = 
			'<div id="non-logo">\
				<span class="glyphicon glyphicon-user"></span>\
			</div>';
		}
		else
			$scope.logo = '<img src="' + response.user.logo + '" id="logo" />';
	});

	$scope.selectFile = function()
	{
		$('#avatar-input').trigger('click');
	}

	$scope.getFile = function(files)
	{
		if (files.length)
		{
			$scope.logo = '<img src="' + URL.createObjectURL(files[0]) + '" id="logo" />';
			var fd = new FormData();
			fd.append('file', files[0]);
			$http.get(serv_addr + 'server/user.get?id=' + JSON.parse($window.localStorage.getItem('client')).user.id)
			.success(function(response){
				fd.append('username', response.user.username);
				$http.post(serv_addr + 'server/user.setlogo', fd, {
					withCredentials: true,
					headers: {
						'Content-Type': undefined
					},
					transformRequest: angular.identity
				});
			});
		}
	}
});