admin.controller('createTemplateDlgController', function($scope, $location, $rootScope, $http){
	var fd = null;
	
	$scope.selectIcon = function(){
		$('#icon-template-input').trigger('click');	
	}
	
	$scope.getIcon = function(files)
	{
		fd = new FormData();
		fd.append('file', files[0]);
		$('#template-icon').attr(
			'src', 
			URL.createObjectURL(files[0])
		);
	}
	
	$scope.createTemplate = function(template){
		$http.post(serv_addr + 'server/admin.createicon', fd, {
			withCredentials: true,
			headers: {
				'Content-Type': undefined
			},
			transformRequest: angular.identity
		}).success(function(response){
			$.post(serv_addr + 'server/admin.createtemplate', {
				id: response.id,
				title: template.title
			}).success(function(){
				$('body').removeClass('modal-open');
				$('.modal-backdrop').detach();
				$rootScope.$apply(function(){
					$location.path('templatebuilder/');
				});
			});
		});
	}
});