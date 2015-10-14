'use strict';

app.controller('MainCtrl', function($scope, $location, ExplorerService, ConversionService){
  $scope.ConvSrvc = ConversionService;

  ExplorerService.getStatus()
      .success(function(data) {
          $scope.status = data;
          $scope.status.Block.date = new Date(data.Block.timestamp * 1000);
      });
  $scope.getBlockByHash = function(){
      if ($scope.blockHash){
          $location.path('/block/hash/' + $scope.blockHash);
      }
  }
  $scope.getBlockByHeight = function(){
      if ($scope.blockHeight){
          $location.path('/block/height/' + $scope.blockHeight);
      }
  }
});
