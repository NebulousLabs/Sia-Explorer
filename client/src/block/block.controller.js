'use strict';

app.controller('BlockCtrl', ['$scope', '$routeParams', 'ConversionService', 'ExplorerService', function($scope, $routeParams, ConversionService, ExplorerService){
    var setBlockData = function(data){
      $scope.block = data.Block;
      $scope.height = data.Height;
      $scope.block.date = new Date($scope.block.timestamp*1000);
    }
    $scope.ConvSrvc = ConversionService;
    if ($routeParams.type === "hash"){
        $scope.hash = $routeParams.block;
        ExplorerService.getBlockHash($scope.hash).success(setBlockData);
    } else if ($routeParams.type == "height") {
        $scope.height = $routeParams.block;
        ExplorerService.getBlockHeight($scope.height).success(setBlockData);
    }

}]);
