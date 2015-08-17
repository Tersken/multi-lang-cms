'use strict';

/* App Module */

angular.module('MultiLangCmsLogin', ['ngRoute', 'CmsServices', 'ngLoadingSpinner']).
  config(['$routeProvider', function($routeProvider) {
	  
	 $routeProvider.
  	
         /*when('/login', { templateUrl: 'partials/login.html', controller: LoginCtrl }).
         when('/logout', { templateUrl: 'partials/login.html', controller: LoginCtrl }).*/
         //when('/', { templateUrl: 'partials/home.html', controller: BaseCtrl }).
         when('/', { templateUrl: 'partials/login.html', controller: LoginCtrl }).

      otherwise({redirectTo: '/'});
      
}]);

angular.module('MultiLangCmsLogin').run(['$http', '$rootScope', '$auth', function($http, $rootScope, $auth) {

       $rootScope.checkLogin = function(){
              var sid = $auth.getSessionId();
              if(!sid){
                     window.location = '#/login';
              }else {
                     $auth.check();

              }
       }

}]);
