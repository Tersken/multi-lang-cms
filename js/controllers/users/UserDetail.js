function UserDetailCtrl($scope, $routeParams, $rootScope, $ws) {
    $scope.init = function() {
        $rootScope.pageTitle = "Users > Detail";
        $rootScope.checkLogin();
        $scope.id = $routeParams.id;
        $scope.edituser = $scope.edituser | {};
        // config.extraPlugins = 'maximize';
    };

    $scope.updateUser = function(){
        var user = $scope.edituser;
        $scope.userError = [];
        if(user.password) {
            if(user.password != user.cpassword){
                $scope.userError.push("Passwords do not match.");
            }
        }
        if(user.email){
            var re = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            var results = user.email.match(re);
            if(results == null){
                $scope.userError.push("Email is not valid");
            }
        }else {
            $scope.userError.push("Email is required");
        }
        if($scope.userError.length == 0){
            delete user.cpassword;
            if($scope.id){ //Update user
                $ws("updateUser",
                    [user],
                    function(result){
                        window.location = "#/users";
                    }
                );

            }else { //Create user
                delete user.cpassword;
                user.uid = $scope.id;
                $ws("insertUser",
                    [user],
                    function(result){
                        window.location = "#/users";
                    }
                );
            }

        }
    }

    $scope.init();

}