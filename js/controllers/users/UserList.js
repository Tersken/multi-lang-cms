function UserListCtrl($scope, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "Users > List";
        $rootScope.checkLogin();
        $ws(
            "listUsers",
            [['test']],
            function(result){
                $scope.users = result.data;
                $scope.count = result.count;
            }
        );
        //listPages

    };

    $scope.openDetail = function(id){
        window.location = '#/users/id/'+id;
    }

    $scope.init();
}


