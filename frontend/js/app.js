'use strict';

/* App Module */

angular.module('MultiLangCms', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
	  
	 $routeProvider.
  	
         /*when('/login', { templateUrl: 'partials/login.html', controller: LoginCtrl }).
         when('/logout', { templateUrl: 'partials/login.html', controller: LoginCtrl }).*/
         when('/', { templateUrl: 'partials/home.html', controller: BaseCtrl }).
         when('/cms', { templateUrl: 'partials/cms/list.html', controller: tettenCtrl }).
         when('/cms/page/:id', { templateUrl: 'partials/cms/detail.html', controller: tetten2Ctrl }).
     // when('/faceBookNextStep', { templateUrl: 'partials/faceBookNextStep.html', controller: FacebookController }).
     // when('/googleNextStep', { templateUrl: 'partials/googleNextStep.html', controller: GoogleController }).

      otherwise({redirectTo: '/'});
      
}]);
