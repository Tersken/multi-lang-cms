function CmsDetailCtrl($scope, $routeParams, $rootScope) {
    $scope.init = function() {
        $rootScope.checkLogin();
        $scope.id = $routeParams.id;
        if(!$scope.id) $scope.newMode = true;
        /*var editor = CKEDITOR.instances['content'];
        if (editor) { editor.destroy(true); }
        CKEDITOR.replace( 'content' , {
            extraPlugins : 'maximize'
        });*/
    };

    $scope.init();

}