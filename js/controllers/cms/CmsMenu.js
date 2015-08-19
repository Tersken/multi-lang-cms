function CmsMenuCtrl($scope, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "CMS > Menu";
        $rootScope.checkLogin();
        $scope.items = ["test1", "test2", "test3", "test4"];
        $scope.subitems = ["subtest1", "subtest2", "subtest3", "subtest4"];
        /*$ws(
            "listPages",
            [['test']],
            function(result){
                $scope.pages = result.data;
                $scope.count = result.count;
            }
        );*/
        //listPages

    };
    
    $scope.sortableOptions = {
        update: function(e, ui) { 
            console.log('updated');
        },
        axis: 'x',
        'ui-floating': 'true'
      };
    
    $scope.sortableOptionsSub = {
        axis: 'y'
    }

    $scope.openDetail = function(id){
        window.location = '#/cms/id/'+id;
    }

    $scope.init();
}


