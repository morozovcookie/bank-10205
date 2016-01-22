admin.controller('templatebuilderController', function($scope, $http){
	$scope.type = 'Выберите тип. . .';
	$scope.Files = [];
	$scope.event = {
		date: new Date(),
		public: true,
		private: false
	};
		
	$scope.public = function(){
		if ($scope.event.public)
			$scope.event.private = false;
		else if ($scope.event.private)
			$scope.event.public = false;
	}

	$scope.private = function(){
		if ($scope.event.private)
			$scope.event.public = false;
	}

	$scope.selectType= function($event)
	{
		$scope.type = $($event.target).text();
	}

	$scope.selectFile = function()
	{
		$('form[name="new-template-form"] input[type="file"]').trigger('click');
	}

	$scope.getFile = function(files)
	{
		if (files.length)
		{
			for (var i = 0; i != files.length; ++i)
				$scope.Files.push(files[i]);
			var miniFiles = '';
			$scope.Files.forEach(function(file){
				miniFiles = miniFiles + '<li>\
				<img class="mini-img" src="' + URL.createObjectURL(file) + '" />\
				</li>';
			}, this);
			$('#files-list').empty();
			$('#files-list').append(miniFiles);
			$('form[name="new-template-form"] input[type="file"]').val('');
		}
	}

	$scope.save = function()
	{

	}

	$scope.cancel = function()
	{
		
	}
});