'use strict';

function BaseCtrl($scope, $auth, $rootScope) {

	$scope.init = function() {
        $rootScope.checkLogin();
	};





	$scope.init();
}






