function CmsDetailCtrl($scope, $routeParams, $rootScope, $ws) {
  
    $scope.init = function() {
        $rootScope.checkLogin();
        if($routeParams.id){
            $scope.loadPage($routeParams.id);
        }

    };

    $scope.loadPage = function(id){
        $ws("getPage",
            [id],
            function(result){
                console.log('result', result);
                result.published = result.published == 1 ? true: false;
                $scope.page = result;
            }
        );
    }

    $scope.save = function(){
        if($scope.page.pageUid){
            $ws("updatePage",
                [$scope.page],
                function(result){
                    window.location = "/index.html#/cms";
                    $scope.loadPage(result);
                }
            );
        }else {
            $ws("insertPage",
                [$scope.page],
                function(result){
                    window.location = "/index.html#/cms";
                    $scope.loadPage(result);
                }
            );
        }

    }
    
    $scope.init();
    
    $scope.editorOptions = {
            extraPlugins : 'maximize'
        };

}