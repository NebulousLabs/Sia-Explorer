'use strict';

app.factory('ConversionService', function(){
    var conversionSrvc = {};

    // Convert Siacoin to a reasonable string
    conversionSrvc.hastingsToString = function(hastings) {
        if (hastings === undefined){
            return;
        }
        var postFixes = ["H", "zS", "aS", "fS", "pS", "nS", "µS", "mS", "SC", "KS", "MS", "GS", "TS", "PS"];

        var tempNumb = hastings;
        var loc = 0;
        while (tempNumb >= Math.pow(10, 3)){
            tempNumb = tempNumb / Math.pow(10, 3);
            loc += 1;
        }

        return tempNumb.toFixed(3) + ' ' + postFixes[loc];
    }

    // Estimate the number of days a contract last given blocks
    conversionSrvc.blocksToDays = function(blocks) {
        // Blocks take ~10 mins to mine
        return (blocks * 10) / (60 * 24);
    }

    // Convert bytes to a string for easy displaying
    conversionSrvc.bytesToString = function(storage){
        if (storage === undefined){
            return;
        }
        var postFixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

        var tempNumb = storage;
        var loc = 0;
        while (tempNumb >= Math.pow(10, 3)){
            tempNumb = tempNumb / Math.pow(10, 3);
            loc += 1;
        }

        return tempNumb.toFixed(3) + ' ' + postFixes[loc];
    }

    // estimate the price of hosting given a price
    conversionSrvc.getSiaPerGBPerMonth = function(host){
        return ((host.Price) / (4.32 * Math.pow(10, 12))).toFixed(3);
    }

    return conversionSrvc;
});
