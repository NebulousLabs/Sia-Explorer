'use strict';

app.controller('HostsCtrl', ['$scope', 'ExplorerService', function($scope, ExplorerService){
    ExplorerService.getHosts()
        .success(function(data){
            $scope.hosts = data.Hosts;
        });

    $scope.getTotalStorage = function(host){
        if (host.TotalStorage > Math.pow(10, 12)) {
            return (host.TotalStorage / Math.pow(10, 12)) + ' TB';
        } else {
            return (host.TotalStorage / Math.pow(10, 9)) + ' GB';
        }
    }

    $scope.getSiaPerGBPerMonth = function(host){
        return (host.Price) / (4.32 * Math.pow(10, 12));
    }

    $scope.sortOrder = '';

    $scope.sortBy = function(columnName) {
        if ($scope.sortOrder == columnName) {
            $scope.sortOrder = '-' + $scope.sortOrder;
        } else {
            $scope.sortOrder = columnName;
        }
    };


}]);
