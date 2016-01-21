admin.controller('templatelistController', function($scope, $http){
	var ulist = '';
	$http.get(serv_addr + 'server/admin.tlist').success(function(response){
		response.forEach(function(i){
			ulist = ulist + 
			'<tr>\
				<td>' + i.template.id + '</td>\
				<td>\
				 	<img id="preview-icon" src="' + i.template.src + '"/> ' + i.template.title + 
				'</td>\
			</tr>';
		}, this);
		$scope.templatetable = ulist;
	});
});