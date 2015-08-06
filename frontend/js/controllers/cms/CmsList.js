function CmsListCtrl($scope, $location, $filter, $timeout, $http) {
    $scope.init = function() {
        var selected = [];
        var dataSet = [
            {
                "DT_RowId": "row_1",
                "id" : 1,
                'title': 'Frocio'
            },
            {
                "DT_RowId": "row_2",
                "id" : 2,
                'title': 'Kwattaman'
            }

        ];
        $('#cmsPageList').dataTable( {
            "data": dataSet,
            "columns": [
                { "data": "id" , "title": '#', "class": 'idColumn'},
                { "data": "title", "title": 'Title'},
            ]
        } );
        $('#cmsPageList tbody').on('click', 'tr', function () {
            var id = this.id;
            var idSplit = id.split('_');
            console.log(idSplit);
            window.location = '#/cms/page/'+ idSplit[1];
        } );
    };

    $scope.init();
}


