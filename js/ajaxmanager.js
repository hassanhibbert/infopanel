/* global $, jQuery, document */

var ajaxManager = (function ($, document) {

    var serviceUrl = 'js/fakeData_300.json',
        
        // cache vars
        cachedLength,
        parsedData = [],
        
        // module API
        publicAPI,
        
        // manage cached data vars
        buildItems,
        start = 0,
        end = 0,
        trackedLength = 0;

    //###############//
    //### Private ###//
    //###############//

    /**
     * Cache the data received from Ajax Request in [parsedData].
     *
     * @param {array} array from JSON file
     */
    function cacheData(data) {
        data.forEach(function (obj) {
            parsedData.push(obj);
        });
    }

    /**
     * Ajax request for data. Receives data and caches it in [parsedData], as well as caching its length.
     *
     * @param {interger} how much data to build to DOM on initial load
     * @param {function} callback function to process cached data.
     */
    function ajaxRequest(limit, cb) {
        $.ajax({
            method: 'GET',
            url: serviceUrl,
            success: function successCB(data) {
                cacheData(data);
                cachedLength = parsedData.length;
                buildItems = getBuildItems(limit);
                if (typeof cb === 'function') {
                    cb(buildItems);
                }
            },
            error: function () {
                throw "Error loading data from url";
            }
        });
    }
    
    /**
     * Splits up the cached data in to smaller segments to return
     *
     * @param {interger} limit on how much to segment the data
     * @return {array} returns a specific amount [itemLimit] of items from the cached data array.
     */
    function getBuildItems(itemLimit) {
        var diff = end - start,
            calcLimit = diff - itemLimit,
            items;
        end -= calcLimit;
        items = parsedData.slice(start, end);
        start += itemLimit;
        end += itemLimit;
        trackedLength += items.length;
        return items;
    }

    //##############//
    //### Public ###//
    //##############//

    /**
     * Search cached data to find the object that matches the provided key/value pair
     *
     * @param {string} key string to look for
     * @param {string} value string to look for
     * @return {object} returns the object with all the information associated with the provided key/value pair
     */
    function search(key, value) {
        var result;
        parsedData.forEach(function (dataObj) {
            if (dataObj[key] === value) {
                result = dataObj;
            }
        });
        return (result) ? result : 'No results found.';
    }

    /**
     * Load more items to DOM
     *
     * @param {integer} how much build items to request
     * @param {function} callback for processing data received
     */
    function loadMore(limit, cb) {
        buildItems = getBuildItems(limit);
        if (cachedLength === trackedLength) { 
            return; 
        }
        if (typeof cb === 'function') {
             cb(buildItems);
        }
    }
    
    /**
     * Load initial data
     *
     * @param {function} callback for processing data received
     * @param {interger} [optional] default number is 20 but can be changed with the [limit] argument available 
     */
    function loadData(cb, limit) {
        limit = (limit && typeof limit === 'number') ? limit : 20;
        ajaxRequest(limit, cb);
    }

    publicAPI = {
        loadData: loadData,
        search: search,
        loadMore: loadMore
    };
    
    // expose publicAPI methods
    return publicAPI;

})(jQuery, document);