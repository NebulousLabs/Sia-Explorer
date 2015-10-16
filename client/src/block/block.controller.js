'use strict';

// Block Controller handles data processing on the block page
app.controller('BlockCtrl', ['$scope', '$routeParams', 'ConversionService', 'ExplorerService', function($scope, $routeParams, ConversionService, ExplorerService){
    // initalize variables needed on page once api has returned the data
    var setBlockData = function(data){
      $scope.block = data.Block;
      $scope.transactionIds = data.TransactionIds;
      $scope.height = data.Height;
      $scope.block.date = new Date($scope.block.timestamp*1000);
    }

    // Expose the conversion service in scope for the inline templating
    $scope.ConvSrvc = ConversionService;
    // Depending on url load block differenetly
    if ($routeParams.type === "hash"){
        $scope.hash = $routeParams.block;
        // Use the api explorer service to query the block by hash endpoint
        ExplorerService.getBlockHash($scope.hash).success(setBlockData);
    } else if ($routeParams.type == "height") {
        $scope.height = $routeParams.block;
        // Use the api explorer service to query the block by height endpoint
        ExplorerService.getBlockHeight($scope.height).success(setBlockData);
    }
}]);
