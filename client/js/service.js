client.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/user/profile', {
			templateUrl: 'profile.html',
			controller: 'profileController',
			title: 'Bank::User Profile'
		});
	$locationProvider.html5Mode(true);
}]);

client.run(['$route', '$rootScope', function($route, $rootScope){
	$rootScope.$route = $route;
}]);

client.directive('widget', function($compile){
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