function UserListCtrl($scope, $rootScope) {
    $scope.init = function() {
        $rootScope.checkLogin();

    };

    $scope.init();
}


