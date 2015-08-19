function CmsListCtrl($scope, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "CMS > List";
        $rootScope.checkLogin();
        $ws(
            "listPages",
            [['test']],
            function(result){
                $scope.pages = result.data;
                $scope.count = result.count;
            }
        );
        //listPages

    };

    $scope.openDetail = function(id){
        window.location = '#/cms/id/'+id;
    }

    $scope.init();
}


