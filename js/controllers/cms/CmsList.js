function CmsListCtrl($scope, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "CMS > List";
        $rootScope.checkLogin();
        $ws(
            "listPages",
            [['test']]
        );
        //listPages

    };

    $scope.init();
}


