
var adminApp = angular.module('adminApp', [
	'ngRoute', 
	'datatables',
	'ngAnimate',
	'ui.bootstrap',
	'angularSpinner',
	'angular-loading-bar',
	'ui-notification'
	]);

adminApp.constant('SERVERURL', 'http://localhost:3004');
//adminApp.constant('SERVERURL', 'https://mean-app-admin.herokuapp.com');


adminApp.config(['$routeProvider', function($routeProvider){
		$routeProvider
		   .when('/',{
		   		redirectTo: '/admin/crud-manager'
		   })
		   .when('/admin', {
				redirectTo: '/admin/crud-manager'
			})
			.when('/admin/crud-manager',{
				  templateUrl: 'partials/crud.html',
				  controller: 'CrudCtrl'
			})
			.when('/admin/login',{
				  templateUrl: 'partials/login.html',
				  controller: 'LoginCtrl'
			})		
			.when('/admin/profile',{
				templateUrl: 'partials/profile.html',
				controller: 'ProfileCtrl'
			})
			.when('/admin/logout', {
				template: '', //A template or templateUrl is required by AngularJS, even if your controller always redirects.
				controller: 'LogoutCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

}]);

adminApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])