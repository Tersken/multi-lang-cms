function CmsDetailCtrl($scope, $location, $filter, $timeout, $http, $routeParams) {
    $scope.init = function() {
        $scope.id = $routeParams.id;
        if(!$scope.id) $scope.newMode = true;
       // config.extraPlugins = 'maximize';
        CKEDITOR.replace( 'content' , {
            extraPlugins : 'maximize'
        });
    };

    $scope.init();

}