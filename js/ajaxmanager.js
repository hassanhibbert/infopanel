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
        // TODO: search for key/value pair then return that object
        console.log(parsedData);
        return result;
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

// can be called to load data from ajax call
// ajaxManager.loadData(buildList); 

// ajaxManager.loadMore(50, buildList);
// ajaxManager.search('businessName', 'Royal Destination'); // returns this object