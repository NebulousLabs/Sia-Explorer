'use strict';

app.controller('MainCtrl', function($scope, $location, ExplorerService, ConversionService){
  $scope.ConvSrvc = ConversionService;

  ExplorerService.getStatus()
      .success(function(data) {
          $scope.status = data;
      });
  $scope.getBlockByHash = function(){
      if ($scope.blockHash !== ''){
          $location.path('/block/' + $scope.blockHash);
      }
  }
});
