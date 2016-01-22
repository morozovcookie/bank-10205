admin.controller('eventbuilderController', function($scope, $rootScope, $http, $window, $location){
	$scope.type = $rootScope.newEvent.type;
	$scope.Files = [];
	$scope.event = {
		title: $rootScope.newEvent.title,
		sum: $rootScope.newEvent.sum,
		date: $rootScope.newEvent.date,
		public: true,
		private: false
	};
	$scope.people = [];
	$('#userauto').hide();
	$http.get(serv_addr + 'server/user.get?id=' + JSON.parse($window.localStorage.getItem('user')).user.id)
	.success(function(response){
		$scope.owner = response.user.secondname + ' ' + response.user.firstname;
		$scope.people.push(response.user);
		$scope.update_participant();
	});
		
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
		$('form[name="new-event-form"] input[type="file"]').trigger('click');
	}

	$scope.getFile = function(files)
	{
		if (files.length)
		{
			for (var i = 0; i != files.length; ++i)
				$scope.Files.push(files[i]);
			var miniFiles = '';
			$scope.Files.forEach(function(file){
				/*
					ДОЛЖЕН БЫТЬ НЕ BLOB, А ПУТЬ ДО *png|*.gif|*.jpg
				*/
				miniFiles = miniFiles + '\
				<a class="fancybox" rel="gallery" href="http://192.168.182.130:90/user/morozov.png">\
					<img class="mini-img" src="http://192.168.182.130:90/user/morozov.png" />\
				</a>';
			}, this);
			$('#files-list').empty();
			$('#files-list').append(miniFiles);
			$('form[name="new-event-form"] input[type="file"]').val('');
		}
	}

	$scope.create = function(event)
	{
		var tr = $('form[name=new-event-form] table tbody')[0].children;
		var participants = [];
		for (var i = 0; i != tr.length; ++i)
		{
			var user = $(tr[i]);
			participants.push({
				user: {
					username: $.trim($(user.children()[1]).text()),
					part: $($(user.children()[3]).children()[0]).val(),
					sum: $($(user.children()[4]).children()[0]).val()
				}
			});
		}

		var formdata = new FormData();
		for (var i = 0; i != $scope.Files.length; ++i)
			formdata.append('file' + i, $scope.Files[i]);
		var e = {
			title: event.title,
			type: $.trim($scope.type),
			date: event.date.getFullYear() + '-' + (event.date.getMonth() + 1) + '-' + event.date.getDate(),
			sum: event.sum,
			owner: JSON.parse($window.localStorage.getItem('user')).user.id,
			access: event.public,
			participants: participants
		};
		formdata.append('event', JSON.stringify(e));
		$http.post(serv_addr + 'server/event.create', formdata, {
			withCredentials: true,
			headers: {
				'Content-Type': undefined
			},
			transformRequest: angular.identity
		}).success(function(){
			$location.path('eventlist/');
		});
	}

	$scope.cancel = function()
	{
		$location.path('eventlist/');
	}

	$scope.change = function()
	{
		$('#userauto').hide();
		if ($scope.participant!=''&&$scope.participant!=undefined)
		{
			var tr = $('#participant-table tbody tr');
			var busy = [];
			for (var i = 0; i != tr.length; ++i)
				busy.push($.trim($($(tr[i]).children()[1]).text()));
			$http.get(serv_addr + 'server/user.pattern?pattern=' + $scope.participant + '&busy=' + busy.toString()).success(function(response){
				var userautolist = '';
				if (response=='')
				{
					userautolist = 
						'<div class="row">\
							<div class="col-md-2"></div>\
							<div class="col-md-10">\
							Совпадений не обнаружено\
							</div>\
						</div>';
				}
				else
				{
					response.forEach(function(i){
						userautolist = userautolist + 
							'<div class="row" ng-click="add_participant($event)">\
								<div class="col-md-2">';
						if (i.user.logo=='null')
							userautolist = userautolist + '<span class="glyphicon glyphicon-user"></span>';
						else
							userautolist = userautolist + '<img src="' + i.user.logo + '"/>';
						userautolist = userautolist + 
								'</div>\
								<div class="col-md-4">\
									<b>' + i.user.username + '</b>' + 
								'</div>\
								<div class="col-md-6">'
								+ i.user.secondname + ' ' + i.user.firstname +
								'</div>\
							</div>';
					}, this);
				}
				$scope.userautolist = userautolist;
				$('#userauto').show();
			});
		}
	}

	$scope.hide = function()
	{
		if (!$('#userautolist:hover').length)
			$('#userauto').hide();	
	}

	$scope.add_participant = function($event)
	{
		var user = '';
		if ($(event.target).hasClass('row'))
			user = $.trim($($(event.target).children()[1]).text());
		else if ($($($($event.target).parent()[0]).children()[0]).prop('tagName')=='B')
			user = $.trim($($($($event.target).parent()[0]).children()[0]).text());
		else
			user = $.trim($($($($event.target).parent()[0]).children()[1]).text());
		$http.get(serv_addr + 'server/user.get?username=' + user).success(function(response){
			$scope.people.push(response.user);
			$scope.update_participant();
			$('#userauto').hide();
			$scope.participant = null;
		});
	}

	$scope.update_participant = function()
	{
		$scope.userlist = '';
		var idx = 0;
		$scope.people.forEach(function(user){
			$scope.userlist = $scope.userlist + 
				'<tr>\
					<td>';
			if (user.logo=='null')
				$scope.userlist = $scope.userlist + '<span class="glyphicon glyphicon-user"></span>';
			else
				$scope.userlist = $scope.userlist + '<img src="' + user.logo + '"/>';
			$scope.userlist = $scope.userlist + 
					'</td>\
					<td>\
						<b>' + user.username + '</b>\
					</td>\
					<td>'
						+ user.secondname + ' ' + user.firstname + 
					'</td>\
					<td>\
						<input type="text" class="form-control" id="part"\
						 value="' + (idx<parts.length ? parts[idx] : 0.0) + '" onkeyup="calc_parts()"/>\
					</td>\
					<td>\
						<input type="text" class="form-control" id="sum"\
						 readonly/>\
					</td>\
					<td>';
			if (JSON.stringify($scope.people[0])!==JSON.stringify(user))
			{
				$scope.userlist = $scope.userlist + 
						'<a href="#" class="btn btn-danger" ng-click="remove_participant($event)">\
							<span class="glyphicon glyphicon-trash"></span>\
						</a>';
			}
					'</td>\
				</tr>';
			++idx;
		}, this);
		calc_parts();
	}


	$scope.remove_participant = function($event)
	{
		var tr;
		if ($($event.target).prop('tagName')=='SPAN')
			tr = $($event.target).parents()[2];
		else if ($($event.target).prop('tagName')=='A')
			tr = $($event.target).parents()[1];
		var username = $.trim($($(tr).children()[1]).text());
		$http.get(serv_addr + 'server/user.get?username=' + username).success(function(response){
			for (var idx = 1; idx != $scope.people.length; ++idx)
			{
				if (JSON.stringify($scope.people[idx])===JSON.stringify(response.user))
				{
					delete $scope.people[idx];
					break;
				}
			}
			$scope.update_participant();
		});
	}
});

var parts = [];
function calc_parts()
{
	parts = [];
	var tr = $('form[name=new-event-form] table tbody')[0].children;
	for (var i = 0; i != tr.length; ++i)
	{
		var val = $($($(tr[i]).children()[3]).children()[0]).val();
		val = (val=='' ? 0.0 : parseFloat(val));
		parts.push(val);
	}
	calc_res();
}

function calc_res()
{
	var tr = $('form[name=new-event-form] table tbody')[0].children;
	for (var i = 0; i != tr.length; ++i)
	{
		$($($(tr[i]).children()[4]).children()[0]).val(
			parseFloat($('#event-sum-input').val())*parts[i]
		);
	}
}
