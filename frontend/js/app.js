'use strict';

/* App Module */

angular.module('MultiLangCms', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
	  
	 $routeProvider.
  	
         /*when('/login', { templateUrl: 'partials/login.html', controller: LoginCtrl }).
         when('/logout', { templateUrl: 'partials/login.html', controller: LoginCtrl }).*/
         when('/', { templateUrl: 'partials/home.html', controller: BaseCtrl }).
         when('/cms', { templateUrl: 'partials/cms/list.html', controller: CmsListCtrl }).
         when('/cms/new', { templateUrl: 'partials/cms/detail.html', controller: CmsDetailCtrl }).
         when('/cms/page/:id', { templateUrl: 'partials/cms/detail.html', controller: CmsDetailCtrl }).
         when('/users', { templateUrl: 'partials/users/list.html', controller: UserListCtrl }).
         when('/users/new', { templateUrl: 'partials/users/detail.html', controller: UserDetailCtrl }).
         when('/users/page/:id', { templateUrl: 'partials/users/detail.html', controller: UserDetailCtrl }).

      otherwise({redirectTo: '/'});
      
}]);
