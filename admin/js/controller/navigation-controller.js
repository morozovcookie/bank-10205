admin.controller('navigationController', function($scope){
	$scope.selectItem = function($event){
		var l = $('#nav-menu li');
		for (var i = 0; i != l.length; ++i)
			$(l[i]).removeClass('active');
		var item = $($event.target);
		$($(item).parents()[0]).addClass('active');
	}
});