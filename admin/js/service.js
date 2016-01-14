admin.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/adduser', {
			templateUrl: 'manage/adduser.html',
			controller: 'addemployeeController',
			title: 'Bank::Add Employee'
		})
		.when('/userlist', {
			templateUrl: 'manage/userlist.html',
			controller: 'userlistController',
			title: 'Bank::Users'
		})
		.when('/eventlist', {
			templateUrl: 'manage/eventlist.html',
			controller: 'eventlistController',
			title: 'Bank::Events'
		})
		.when('/eventbuilder', {
			templateUrl: 'manage/eventbuilder.html',
			controller: 'eventbuilderController',
			title: 'Bank::New Event'
		})
		.when('/templatelist', {
			templateUrl: 'manage/templatelist.html',
			controller: 'templatelistController',
			title: 'Bank::Templates'
		})
		.when('/templatebuilder', {
			templateUrl: 'manage/templatebuilder.html',
			controller: 'templatebuilderController',
			title: 'Bank::New Template'
		});
	$locationProvider.html5Mode(true);
}]);

admin.run(['$route', '$rootScope', function($route, $rootScope){
	$rootScope.$route = $route;
}]);

admin.directive('widget', function($compile){
	return {
		restrict: 'AEC',
		replace: true,
		link: function(scope, elem, attr){
			scope.$watch(attr.widget, function(html){
				elem.html(html);
				$compile(elem.contents())(scope);
			});
		}
	};
});