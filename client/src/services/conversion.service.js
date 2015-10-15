'use strict';

app.factory('ConversionService', function(){
    var conversionSrvc = {};

    conversionSrvc.hastingsToString = function(hastings) {
        return (hastings / Math.pow(10, 24)).toFixed(2);
    }

    conversionSrvc.bytesToGB = function(bytes) {
        return (bytes / Math.pow(10, 9)).toFixed(2);
    }

    conversionSrvc.bytesToTB = function(bytes) {
        return (bytes / Math.pow(10, 12)).toFixed(2);
    }

    conversionSrvc.blocksToDays = function(blocks) {
        // Blocks take ~10 mins to mine
        return (blocks * 10) / (60 * 24);
    }

    conversionSrvc.bytesToString = function(storage){
        if (storage > Math.pow(10, 12)) {
            return (storage / Math.pow(10, 12)) + ' TB';
        } else {
            return (storage / Math.pow(10, 9)) + ' GB';
        }
    }

    conversionSrvc.getSiaPerGBPerMonth = function(host){
        return ((host.Price) / (4.32 * Math.pow(10, 12))).toFixed(3);
    }

    return conversionSrvc;
});
