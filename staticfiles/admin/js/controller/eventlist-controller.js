admin.controller('eventlistController', function($scope, $http){
	var elist = '';
	$http.get(serv_addr + 'server/admin.elist').success(function(response){
		response.forEach(function(i){
			elist = elist + 
			'<tr>\
				<td>' + i.event.id + '</td>\
				<td>' + i.event.title + '</td>\
				<td>' + i.event.date + '</td>\
				<td>' + i.event.sum + '</td>\
				<td>' + i.event.owner + '</td>\
			</tr>';
		}, this);
		$scope.eventtable = elist;		
	});
});