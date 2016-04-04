/* global $, jQuery, document */

var ajaxManager = (function ($, document) {

    var serviceUrl = 'js/fakeData_5.json',
        cachedLength,
        publicAPI = {},
        parsedData = [];
    
    //###############//
    //### Private ###//
    //###############//
    
    /**
     * Cache the data received from Ajax Request in [parsedData]
     *
     * @param {object} object from JSON file
     */
    function cacheData(data) {
         data.forEach(function(obj){
             parsedData.push(obj);
         });
    }
    
    /**
     * Ajax call for data. Updates cached data, and data length for the [loadMore] method
     *
     * @param {function} callback to process the data received from ajax call
     * @param {string} url of the new service call to retrieve more data for [loadMore] method
     * @param {boolean} check to see if the method calling this function is [loadMore]
     */
    function getData(cb, newUrl, loadMethod) {     
        var buildItems,
            sURL = (newUrl) ? newUrl : serviceUrl; // assign new service url
        
        $.ajax({
            method: 'GET',
            url: sURL,
            success: function (data) {
                if (loadMethod) {
                    
                    // new items to build
                    buildItems = data.slice(cachedLength);
                    
                    // pass new items to callback. NOTE: will inserted into the DOM at this time
                    cb(buildItems);
                    
                    // cache the new build items and its length
                    cacheData(buildItems);
                    cachedLength = parsedData.length;
                } else {
                    
                    // cache build items and its length
                    cacheData(data);
                    cachedLength = parsedData.length;
                    if (typeof cb === 'function') {
                        cb(parsedData);
                    }
                }  
            },
            error: function () {
                throw "Error loading data from url";
            }
        });
    }
    
    //##############//
    //### Public ###//
    //##############//
      
    /**
     * Search cached data to find the object that matches the provided key/value
     *
     * @param {string} key name to look for
     * @param {string} value name to look for
     * @return {object} returns the object with all the information associated with the provided key/value pair
     */
    publicAPI.search = function(key, value) {
        var result;
        parsedData.forEach(function(dataObj){  
            if (dataObj[key] === value) {
                result = dataObj;
            }
        });
        return (result) ? result : 'No results found.';
    };
    
    /**
     * Load more data
     *
     * @param {integer} how much data to request
     * @param {function} callback for processing data received
     */
    publicAPI.loadMore = function(limit, cb) {
        // TODO: configue limit
        getData(cb, 'js/fakeData_10.json', true);
    };
    
    /**
     * Load initial data
     *
     * @param {function} callback for processing data received
     */
    publicAPI.loadData = function(cb) {
        getData(cb);
    };

    return publicAPI;

})(jQuery, document);
