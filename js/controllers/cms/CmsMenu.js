function CmsMenuCtrl($scope, $rootScope, $ws, $modal) {
    $scope.init = function() {
        $rootScope.pageTitle = "CMS > Menu";
        $rootScope.checkLogin();
        //$scope.items = ["test1", "test2", "test3", "test4"];
        //$scope.subitems = ["subtest1", "subtest2", "subtest3", "subtest4"];
        $scope.getMenu(1);
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
    
    $scope.saveMenu = function(){
        $ws('saveMenu', 
        [1, $scope.items],
        function(result){
            console.log(result);
        }
        );
    }
    
     $scope.ok = function () {
         if($scope.level == 1){
            if($scope.items[$scope.modalItemId]['subitems'] == undefined){
             $scope.items[$scope.modalItemId]['subitems'] = [];
            }
            $scope.items[$scope.modalItemId]['subitems'].push($scope.selected.page);
         }else {
             $scope.items.push($scope.selected.page);
         }
        
        $scope.modalInstance.close();
      };

      $scope.cancel = function () {
          
        $scope.modalInstance.dismiss('cancel');
      };
    
    $scope.ItemAddModal = function(itemId, level){
        $scope.level = level;
        $scope.modalItemId = itemId;
        $scope.selected = {};
        $ws(
            "listPages",
            [['test']],
            function(result){
                $scope.pages = result.data;
                $scope.count = result.count;
            }
        );
        $scope.modalInstance = $modal.open({
          animation: true,
          templateUrl: 'partials/cms/menuItemPicker.html',
          //controller: 'ModalInstanceCtrl',
          scope: $scope,
          size: 'lg',
        });
    }
    
    $scope.removeSubItem = function(key, subkey){
        $scope.items[key].subitems.splice(subkey, 1);
    }
    
    $scope.removeItem = function(key){
        $scope.items.splice(key, 1);
    }
    
    $scope.getMenu = function(id){
        $ws('getMenu',
        [id], function(result){
            $scope.items = result;
            console.log(result);
        });
    }
    
    $scope.sortableOptions = {
        update: function(e, ui) { 
            console.log('updated');
        },
        axis: 'x',
        //'ui-floating': 'true'
      };
    
    $scope.sortableOptionsSub = {
        axis: 'y'
    }

    $scope.openDetail = function(id){
        window.location = '#/cms/id/'+id;
    }

    $scope.init();
}


