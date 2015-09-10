function CmsListCtrl($scope, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "CMS > List";
        $rootScope.checkLogin();
        $scope.listPages();

    };

    $scope.listPages = function(){
        $ws(
            "listPages",
            [
                {'language' : $rootScope.language_code}
            ],
            function(result){
                $scope.pages = result.data;
                $scope.count = result.count;
            }
        );
    }//listPages

    $rootScope.$watch("language_code", function(e){
       $scope.listPages();
    });

    $scope.openDetail = function(id){
        window.location = '#/cms/id/'+id;
    }

    $scope.init();
}


