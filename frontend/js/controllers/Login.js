'use strict';

function LoginCtrl($scope, $location, $filter, $timeout, $http, $auth, $rootScope) {

    $scope.init = function() {
        if($rootScope.isAuthenticated) $rootScope.isAuthenticated = false;
    };

    $scope.init();

    $scope.login = function(){
        $rootScope.isAuthenticated = true;
        window.location = '#/';
    }
}






