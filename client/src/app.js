'use strict';

var app = angular.module('siaExplorerApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            controller: "MainCtrl",
            templateUrl: 'main/main.html',
        })
        .when('/hosts/', {
            controller: "HostsCtrl",
            templateUrl: 'hosts/hosts.html',
        })
        .when('/block/:type/:block', {
            controller: "BlockCtrl",
            templateUrl: 'block/block.html',
        })
        .when('/transaction/:hash', {
            controller: "TransactionCtrl",
            templateUrl: 'transaction/transaction.html',
        })
        .otherwise({redirectTo: '/'});
    }]);

// Initialize foundation once the page has loaded.
app.run(function($timeout){
    $timeout(function() {
        $(document).foundation();
    }, 500);
});
