admin.controller('createEventDlgController', function($scope, $window, $location, $rootScope){
	$scope.template = 'Без шаблона';
	$scope.type = 'Выберите тип. . .';
	$scope.event = {
		date: new Date(),
		sum: 0,
		type: $scope.type
	}
	
	$scope.selectTemplate = function($event)
	{
		$scope.template = $($event.target).text();
	}
	
	$scope.selectType= function($event)
	{
		$scope.type = $($event.target).text();
		$scope.event.type = $scope.type;
	}
	
	$scope.createEvent = function(event){
		$('body').removeClass('modal-open');
		$('.modal-backdrop').detach();
		$rootScope.newEvent = $scope.event;
		$location.path('eventbuilder/');
	}
});