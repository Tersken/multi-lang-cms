'use strict';

function LoginCtrl($scope, $location, $filter, $timeout, $http, $auth, $rootScope) {

    $scope.init = function() {
        if($rootScope.isAuthenticated) $rootScope.isAuthenticated = false;
    };

    $scope.init();

    $scope.login = function(){
        $auth.login($scope.username, $scope.password, function(details){
                window.location = '/multi-lang-cms';
        },
        function(error){
                $scope.error = true;
        });
    }
}






