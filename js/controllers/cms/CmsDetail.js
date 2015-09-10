function CmsDetailCtrl($scope, $routeParams, $rootScope, $ws) {
  
    $scope.init = function() {
        $rootScope.checkLogin();
        $rootScope.pageTitle = "CMS > Detail";
        if($routeParams.id){
            $scope.loadPage($routeParams.id);
        }

    };

    $scope.loadPage = function(id){
        $ws("getPage",
            [id],
            function(result){
                result.published = result.published == 1 ? true: false;
                $scope.page = result;
            }
        );
    }

    $scope.save = function(){
        var data = $scope.page;
        data.language_code = $rootScope.language_code;
        if($scope.page.pageUid){
            $ws("updatePage",
                [data],
                function(result){
                    window.location = "#/cms";
                    $scope.loadPage(result);
                }
            );
        }else {
            $ws("insertPage",
                [data],
                function(result){
                    window.location = "#/cms";
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