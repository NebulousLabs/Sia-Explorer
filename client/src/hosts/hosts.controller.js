'use strict';

app.controller('HostsCtrl', ['$scope', 'ExplorerService', 'ConversionService', function($scope, ExplorerService, ConversionService){
    $scope.ConvSrvc = ConversionService;
    $scope.totalStorage = 0;
    $scope.avgPrice = 0;

    // Call the api and get the hosts that are available
    ExplorerService.getHosts()
        .success(function(data){
            // Prices are returned from the api as strings, we need ints for
            // correct sorting
            for (var i = 0; i < data.Hosts.length; i++){
                data.Hosts[i].Price = parseInt(data.Hosts[i].Price);
            }
            $scope.hosts = data.Hosts;
            getTotalStorage();
        });

    $scope.sortOrder = '';

    // function for handling which item in the list we are sorting by
    $scope.sortBy = function(columnName) {
        // if we are already sorting by this field sort in the opposite direction
        if ($scope.sortOrder == columnName) {
            $scope.sortOrder = '-' + $scope.sortOrder;
        } else {
            $scope.sortOrder = columnName;
        }
    };

    // Sum all the storage up for displaying
    var getTotalStorage = function(){
        var cost = 0;
        for (var i = 0; i < $scope.hosts.length; i++){
          $scope.totalStorage += $scope.hosts[i].TotalStorage;
          cost += $scope.hosts[i].TotalStorage * $scope.hosts[i].Price;
        }
        $scope.avgPrice = cost / $scope.totalStorage;
    }
}]);
