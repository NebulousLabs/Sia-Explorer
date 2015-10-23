'use strict';

// Block Controller handles data processing on the block page
app.controller('TransactionCtrl', ['$scope', '$routeParams', 'ConversionService', 'ExplorerService', function($scope, $routeParams, ConversionService, ExplorerService){
    // Expose the conversion service in scope for the inline templating
    $scope.ConvSrvc = ConversionService;
    // get the transaction hash from the url
    $scope.transactionHash = $routeParams.hash;
    
    // get transaction data from hash
    ExplorerService.getTransaction($scope.transactionHash)
        .success(function(data){
            $scope.transaction = data.Tx;
            $scope.parentId = data.ParentID;
    });
}]);
