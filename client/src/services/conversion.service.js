'use strict';

app.factory('ConversionService', function(){
    var conversionSrvc = {};

    // Convert Siacoin to a reasonable string
    conversionSrvc.hastingsToString = function(hastings) {
        return (hastings / Math.pow(10, 24)).toFixed(2);
    }

    // convert bytes to gb with 2 point precision
    conversionSrvc.bytesToGB = function(bytes) {
        return (bytes / Math.pow(10, 9)).toFixed(2);
    }

    // convert bytes to tb with 2 point precision
    conversionSrvc.bytesToTB = function(bytes) {
        return (bytes / Math.pow(10, 12)).toFixed(2);
    }

    // Estimate the number of days a contract last given blocks
    conversionSrvc.blocksToDays = function(blocks) {
        // Blocks take ~10 mins to mine
        return (blocks * 10) / (60 * 24);
    }

    // Convert bytes to a string for easy displaying
    conversionSrvc.bytesToString = function(storage){
        if (storage > Math.pow(10, 12)) {
            return (storage / Math.pow(10, 12)) + ' TB';
        } else {
            return (storage / Math.pow(10, 9)) + ' GB';
        }
    }

    // estimate the price of hosting given a price
    conversionSrvc.getSiaPerGBPerMonth = function(host){
        return ((host.Price * 4.32) / (Math.pow(10, 12))).toFixed(3);
    }

    return conversionSrvc;
});
