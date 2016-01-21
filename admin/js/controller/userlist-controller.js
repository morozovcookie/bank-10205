admin.controller('userlistController', function($scope, $http, $rootScope, $location){
	var ulist = '';
	$http.get(serv_addr + 'server/admin.ulist').success(function(response){
		response.forEach(function(i){
			ulist = ulist + 
				'<tr>\
					<td>' + i.user.id + '</td>\
					<td>';
			if (i.user.logo=='null')
			{
				ulist = ulist + 
						'<div id="non-logo">\
							<span class="glyphicon glyphicon-user"></span>\
						</div>';
			}
			else
				ulist = ulist + '<img src="' + i.user.logo + '" id="logo" />';
			ulist = ulist + 
				'</td>\
					<td>' + i.user.username + '</td>\
					<td>' + i.user.secondname + '</td>\
					<td>' + i.user.firstname + '</td>\
					<td>' + i.user.status + '</td>\
					<td>\
						<a href="#" class="btn btn-warning" data-toggle="modal" data-target="#update-user-dlg" ng-click="edit($event)">\
							<span class="glyphicon glyphicon-edit"></span>\
						</a>\
						<a href="#" class="btn btn-danger" ng-click="remove($event)">\
							<span class="glyphicon glyphicon-trash"></span>\
						</a>\
					</td>\
				</tr>';
		}, this);
		$scope.usertable = ulist;
	});

	$scope.edit = function($event)
	{
		var tr;
		if ($($event.target).prop('tagName')=='SPAN')
			tr = $($event.target).parents()[2];
		else if ($($event.target).prop('tagName')=='A')
			tr = $($event.target).parents()[1];
		var id = $($(tr).children()[0]).html();
		$http.get(serv_addr + 'server/user.get?id=' + id).success(function(response){
			$rootScope.set_user(response.user);
		});
	}

	$scope.remove = function($event)
	{
		var tr = $($event.target).parents()[2];
		var id = $($(tr).children()[0]).html();
		$.post(serv_addr + 'server/admin.rmuser', {id: id}).success(function(){
			$rootScope.$apply(function(){
				$location.path('userlist/');
			});
		});
	}
});