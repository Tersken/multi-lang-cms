function UserDetailCtrl($scope, $location, $filter, $timeout, $http, $routeParams) {
    $scope.init = function() {
        console.log($routeParams.id);
        $scope.id = $routeParams.id;
        // config.extraPlugins = 'maximize';
    };

    $scope.init();

}