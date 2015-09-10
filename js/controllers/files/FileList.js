function FileListCtrl($scope, $routeParams, $rootScope, $auth, $ws, $timeout, FileUploader, $filter) {

    $scope.init = function() {
        $rootScope.checkLogin();
        $rootScope.pageTitle = "Files > List";
        $scope.getFiles();
    };
    $scope.getFiles = function() {
        $ws(
            "listFiles",
            [
                {'language' : $rootScope.language_code}
            ],
            function(result){
                $scope.files = result.data;
                $scope.count = result.count;
            }
        );
    };

    $scope.saveFile = function(data, id) {
        //$scope.files not updated yet
        angular.extend(data, {uid: id});
        $ws("updateFile",
            [data],
            function(result){
                $scope.getFiles();
            }
        );
        //return $http.post('/saveUser', data);
    };

    // remove File
    $scope.removeFile = function(id) {
        $ws("deleteFile",
            [id],
            function(result){
                $scope.getFiles();
            }
        );
        //$scope.files.splice(index, 1);
    };

    $scope.download = function(id){
        var sid = $auth.getSessionId();
        var url = "./backend/download.php?sid="+sid+"&uid="+id;
        var iFrame = $("body").find("iframe");
        if (!(iFrame && iFrame.length > 0)) {
            iFrame = $("<iframe style='position:fixed;display:none;top:-1px;left:-1px;'/>");
            $("body").append(iFrame);
        }

        iFrame.attr("src", url);

    }



    $scope.init();
}