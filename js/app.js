'use strict';

/* App Module */

var app = angular.module('MultiLangCms', ['ngRoute', 'CmsServices', 'ngLoadingSpinner', 'ckeditor', 'ui.sortable', 'ui.bootstrap', 'angularFileUpload', 'xeditable' ]).
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
               when('/files', { templateUrl: 'partials/files/list.html', controller: FileListCtrl }).
               when('/files/new', { templateUrl: 'partials/files/detail.html', controller: FileDetailCtrl }).
               when('/files/id/:id', { templateUrl: 'partials/files/detail.html', controller: FileDetailCtrl }).

               otherwise({redirectTo: '/'});

    }]);

angular.module('MultiLangCms').run(['$http', '$rootScope', '$auth', '$cookies', 'editableOptions' ,function($http, $rootScope, $auth, $cookies, editableOptions) {
       editableOptions.theme = 'bs3';
       $rootScope.checkLogin = function(){
              var sid = $auth.getSessionId();
              if(!sid){
                     window.location = 'login.html';
              }else {
                     $auth.check();

              }
       }
       $rootScope.setLanguageCode = function(){
              $cookies.put("language", $rootScope.language_code);
       }

       if(!$rootScope.language_code){
              $rootScope.language_code = $cookies.get("language");
       }
       if(!$rootScope.language_code){
              $rootScope.language_code = 'nl';
       }


}]);