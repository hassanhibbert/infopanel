/* global $, jQuery, document */

var onlineBizPanel = (function ($, global, document) {
    var 
        // DOM references
        $listContainter,
        $listInnerContainter,
        $toggleElement,
        
        // module API
        publicAPI = {};

    //###############//
    //### Private ###//
    //###############//
    
    
    /**
    * Handler for panel clicks
    * 
    * @param {event} Click event information
    */
    function panelHandler(evt) {
        togglePanel();
        var details = ajaxManager.search('businessName', 'Liberty Travel');
        console.log(details);
    }
    
    /**
    * Toggles classes to animate the panel height
    * and up/down arrow
    */
    function togglePanel() {
        $listContainter.toggleClass('ob-expanded ob-collapse');
        $listInnerContainter.toggleClass('ob-hide');
        $toggleElement.find('i').toggleClass('chevicon-chev-up chevicon-chev-down');
    }

    /**
    * Creates elements with attributes on-the-fly
    *
    * @param {string} The element to create. Example: div, a, img...
    * @param {object} Object containing attribute name/value pairs
    * @return {element} Newly created element with attribute name/value pairs
    */
    function myCreateElement(elementType, attributes) {
        var el = document.createElement(elementType);
        if (attributes) {
            Object.keys(attributes).forEach(function (type) {
                el.setAttribute(type, attributes[type]);
            });
        }
        return el;
    }
    
    /**
    * Builds out DOM element and append them to DOM
    * 
    * @param {array} representing each object in the array "JSON Objects" 
    */
    function buildList(data) {
        // document fragment
        var docFrag = document.createDocumentFragment();
        
        data.forEach(function(dataObj) {
            // create elements
            var liTag = myCreateElement('li'),
                linkDetails = myCreateElement('a', { class: 'ob-details', href: '#details' }),
                details = myCreateElement('p'),
                phone = myCreateElement('div', { class: 'ob-phone' }),
                webLink = myCreateElement('a', { href: dataObj.website, target: '_blank' }),
                hTag = myCreateElement('h2');
            
            // append data to elements
            $(liTag).append(linkDetails, phone, webLink);
            $(hTag).append(dataObj.businessName);
            $(details).append(dataObj.details);
            $(linkDetails).append(hTag, details);
            $(phone).append(dataObj.phone);
            $(webLink).append(dataObj.website);
            
            // append everything to document fragment
            $(docFrag).append(liTag);   
        });
        
        // append to DOM
        $listInnerContainter.append(docFrag);
    }

    //##############//
    //### Public ###//
    //##############//
    
    /**
    * Collapse panel 
    */
    publicAPI.collapse = function () {
        if ($listContainter.hasClass('ob-expanded')) {
            togglePanel();
        }
    };
    
    /**
    * Expand panel 
    */
    publicAPI.expand = function () {
        if ($listContainter.hasClass('ob-collapse')) {
            togglePanel();
        }
    };
    
    /**
    * Initialize listeners, cache DOM references
    *
    * @param {object} DOM elements
    */
    publicAPI.init = function init(opt) {
        // cache references
        $listContainter = $(opt.listContainer);
        $listInnerContainter = $(opt.listInnerContainer);
        $toggleElement = $(opt.toggleElement);
        
        // get data
        ajaxManager.loadData(buildList); 

        // listener for toggle element
        $toggleElement.bind('click', panelHandler);
    };

    return publicAPI;
})(jQuery, window, document);


$(document).ready(function () {  
    onlineBizPanel.init({
        listContainer: '#online-list-containter',
        listInnerContainer: '#online-list-containter ul',
        toggleElement: '#online-biz-toggle'
    });  
});