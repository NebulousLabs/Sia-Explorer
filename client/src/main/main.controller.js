'use strict';

app.controller('MainCtrl', function($scope, $location, ExplorerService, ConversionService){
  $scope.ConvSrvc = ConversionService;

  // Query for the status of siae
  ExplorerService.getStatus()
      .success(function(data) {
          $scope.status = data;
          // convert to js datetime object
          $scope.status.Block.date = new Date(data.Block.timestamp * 1000);
      });

  // redirect to the page by hash if a user request a block hash
  $scope.getBlockByHash = function(){
      if ($scope.blockHash){
          $location.path('/block/hash/' + $scope.blockHash);
      }
  }

  // redirect to the block page given a height as input
  $scope.getBlockByHeight = function(){
      if ($scope.blockHeight){
          $location.path('/block/height/' + $scope.blockHeight);
      }
  }
});
