admin.controller('addemployeeController', function($scope, $http, $window, $location, $rootScope){
	$scope.add_employee = function(employee){
		console.log('click');
		$.post(serv_addr + 'server/admin.addemployee', employee).success(function(){
			$rootScope.$apply(function(){
				$location.path('userlist/');
			});
		});
	}
});