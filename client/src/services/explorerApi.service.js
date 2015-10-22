'use strict';

// ExplorerService is an api wrapper that handles consuming the server rest api
app.factory('ExplorerService', ['$http', function($http){
    // All api endpoints begin with /api
    var baseurl = '/api';

    var explorerService = {};

    // get hosts on the network
    explorerService.getHosts = function(){
        return $http.get(baseurl + '/hosts/')
    };

    // get the status of siae
    explorerService.getStatus = function(){
        return $http.get(baseurl + '/status/')
    };

    // get info on a block by it's hash
    explorerService.getBlockHash = function(hash){
        return $http.get(baseurl + '/block/hash/' + hash)
    };

    // get block data given a block height
    explorerService.getBlockHeight = function(height){
        return $http.get(baseurl + '/block/height/' + height)
    };

    // get a single transaction's information
    explorerService.getTransaction = function(height){
        return $http.get(baseurl + '/transaction/' + height)
    };

    return explorerService;
}]);
