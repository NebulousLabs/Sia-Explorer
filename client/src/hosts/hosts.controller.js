'use strict';

app.controller('HostsCtrl', ['$scope', 'ExplorerService', 'ConversionService', function($scope, ExplorerService, ConversionService){
    $scope.ConvSrvc = ConversionService;
    $scope.totalStorage = 0;
    $scope.avgPrice = 0;

    ExplorerService.getHosts()
        .success(function(data){
            for (var i = 0; i < data.Hosts.length; i++){
                data.Hosts[i].Price = parseInt(data.Hosts[i].Price);
            }
            $scope.hosts = data.Hosts;
            getTotalStorage();
        });

    $scope.sortOrder = '';

    $scope.sortBy = function(columnName) {
        if ($scope.sortOrder == columnName) {
            $scope.sortOrder = '-' + $scope.sortOrder;
        } else {
            $scope.sortOrder = columnName;
        }
    };

    var getTotalStorage = function(){
        var cost = 0;
        for (var i = 0; i < $scope.hosts.length; i++){
          $scope.totalStorage += $scope.hosts[i].TotalStorage;
          cost += $scope.hosts[i].TotalStorage * $scope.hosts[i].Price;
        }
        $scope.avgPrice = cost / $scope.totalStorage;
    }
}]);
