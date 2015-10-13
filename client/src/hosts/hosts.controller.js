'use strict';

app.controller('HostsCtrl', ['$scope', 'ExplorerService', 'ConversionService', function($scope, ExplorerService, ConversionService){
    $scope.ConvSrvc = ConversionService;
    ExplorerService.getHosts()
        .success(function(data){
            $scope.hosts = data.Hosts;
        });

    $scope.sortOrder = '';

    $scope.sortBy = function(columnName) {
        if ($scope.sortOrder == columnName) {
            $scope.sortOrder = '-' + $scope.sortOrder;
        } else {
            $scope.sortOrder = columnName;
        }
    };
}]);
