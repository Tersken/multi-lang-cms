function CmsDetailCtrl($scope, $routeParams, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.checkLogin();
        $scope.loadEditor('cmsDetailEditor');
        if($routeParams.id){
            $scope.loadPage($routeParams.id);
        }

    };

    $scope.loadPage = function(id){
        $ws("getPage",
            [id],
            function(result){
                console.log('result', result);
                $scope.page = result;
                console.log(CKEDITOR.instances);
                CKEDITOR.instances['cmsDetailEditor'].setData($scope.page.body);
                console.log('result', result);
            }
        );
    }

    $scope.save = function(){
        $scope.page.body = CKEDITOR.instances['cmsDetailEditor'].getData();
        console.log($scope.page);
        if($scope.page.pageUid){
            $ws("updatePage",
                [$scope.page],
                function(result){
                    $scope.loadPage(result);
                }
            );
        }else {
            $ws("insertPage",
                [$scope.page],
                function(result){
                    $scope.loadPage(result);
                }
            );
        }

    }

    $scope.loadEditor = function(id)
    {
        var instance = CKEDITOR.instances[id];
        if(instance)
        {
            CKEDITOR.remove(instance);
        }
        CKEDITOR.replace(id,
        {
            extraPlugins : 'maximize'
        });

    }

    $scope.init();

}