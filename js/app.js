'use strict';

/* App Module */

angular.module('MultiLangCms', ['ngRoute', 'CmsServices', 'ngLoadingSpinner', 'ckeditor', 'ui.sortable', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
	  
	 $routeProvider.
  	
         /*when('/login', { templateUrl: 'partials/login.html', controller: LoginCtrl }).
         when('/logout', { templateUrl: 'partials/login.html', controller: LoginCtrl }).*/
         //when('/', { templateUrl: 'partials/home.html', controller: BaseCtrl }).
         when('/', { templateUrl: 'partials/cms/list.html', controller: CmsListCtrl }).
         when('/cms', { templateUrl: 'partials/cms/list.html', controller: CmsListCtrl }).
         when('/cms/new', { templateUrl: 'partials/cms/detail.html', controller: CmsDetailCtrl }).
         when('/cms/id/:id', { templateUrl: 'partials/cms/detail.html', controller: CmsDetailCtrl }).
         when('/cms/menu', { templateUrl: 'partials/cms/menu.html', controller: CmsMenuCtrl }).
         when('/users', { templateUrl: 'partials/users/list.html', controller: UserListCtrl }).
         when('/users/new', { templateUrl: 'partials/users/detail.html', controller: UserDetailCtrl }).
         when('/users/id/:id', { templateUrl: 'partials/users/detail.html', controller: UserDetailCtrl }).

      otherwise({redirectTo: '/'});
      
}]);

angular.module('MultiLangCms').run(['$http', '$rootScope', '$auth', function($http, $rootScope, $auth) {

       $rootScope.checkLogin = function(){
              var sid = $auth.getSessionId();
              if(!sid){
                     window.location = 'login.html';
              }else {
                     $auth.check();

              }
       }

}]);
