function UserDetailCtrl($scope, $routeParams, $rootScope) {
    $scope.init = function() {
        $rootScope.pageTitle = "Users > Detail";
        $rootScope.checkLogin();
        console.log($routeParams.id);
        $scope.id = $routeParams.id;
        // config.extraPlugins = 'maximize';
    };

    $scope.init();

}