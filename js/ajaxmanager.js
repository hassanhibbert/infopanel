/* global $, jQuery, document */

var ajaxManager = (function ($, global, document) {

    var serviceUrl = 'js/fakeData.json',
        arrLen,
        publicAPI = {},
        parsedData = [];

    function storeData(data) {
         data.forEach(function(obj){
             parsedData.push(obj);
         });
    }

    publicAPI.search = function(key, value) {
        var result;
        parsedData.forEach(function(dataObj){  
            if (dataObj[key] === value) {
                result = dataObj;
            }
        });
        return (result) ? result : 'No results found.';
    }

    publicAPI.loadMore = function(limit, cb) {
        // TODO: build only the new data then merge to parsed Data
    }

    publicAPI.loadData = function(cb) {
        $.ajax({
            method: 'GET',
            url: serviceUrl,
            success: function (data) {
                storeData(data);
                if (typeof cb === 'function') {
                    cb(parsedData);
                }
            },
            error: function () {
                throw "Error loading data from url";
            }
        });

    }

    return publicAPI;

})(jQuery, window, document);

// ajaxManager.loadMore(50, buildList);