/* global $, jQuery, document, ajaxManager */

var onlineBizPanel = (function ($, document) {
    var
    // DOM references
        $listContainter,
        $listInnerContainter,
        $toggleElement,
        $fullDetails,

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
        var $status = $toggleElement.attr('data-status');
        $('.bottom-wrap, .top-wrap').remove();      
        if ($status === 'accordion') {
            togglePanel();
        } else if ($status === 'back') {
            changeContent($listInnerContainter);
        }
    }

    function detailsHandler(evt) {
        evt.preventDefault();
        var $currentName = $(this).attr('data-businessname'),
            detailsObj = ajaxManager.search('businessName', $currentName);
        buildFullDetails(detailsObj, changeContent.bind(null, $fullDetails));
    }

    function setNewVariables() {
        var $hideElement = ($element.selector === '#ob-full-details') ? $listInnerContainter : $fullDetails,
            status = ($element.selector === '#ob-full-details') ? 'back' : 'accordion',
            toggleText = ($element.selector === '#ob-full-details') ? 'Back' : 'Online Businesses',
            $currentElement = ($element.selector === '#ob-full-details') ? $element : $listInnerContainter;
    }
    function changeContent($element) {
        setNewVariables()
            
        $toggleElement.attr('data-status', status).find('h2').text(toggleText);
        $hideElement.addClass('ob-hide');
        $hideElement.toggleClass('ob-fadeOut ob-fadeIn');
        $element.removeClass('ob-hide');
        $element.outerHeight();
        $element.toggleClass('ob-fadeOut ob-fadeIn');
    }

    function buildFullDetails(data, cb) {
        var imgElement,
        
            // document fragment
            docFrag = document.createDocumentFragment(),
            
            // create elements
            topDiv = myCreateElement('div', {class: 'top-wrap clearfix'}),
            bottomDiv = myCreateElement('div', {class: 'bottom-wrap'}), 
            hTag = myCreateElement('h2'),
            aTagPhone = myCreateElement('a', {class: 'ob-phone', href: 'tel:' + data.phone}),
            aTagWeb = myCreateElement('a', {href: data.website, target: '_blank'}),
            pTagDetails = myCreateElement('p'),
            hr = myCreateElement('hr'),
            
            // check if images exist
            logoImg = (data.logo) ? myCreateElement('img', {src: data.logo, alt: 'business logo'}) : undefined,
            mainImg = (data.mainimage) ? myCreateElement('img', {src: data.mainimage, alt: 'main image'}) : undefined;
        
        // append logo if it  exist
        if (logoImg) {
            $(topDiv).append(logoImg, hTag, aTagPhone);
        } else {
            $(topDiv).append(hTag, aTagPhone);
        }
        
        // append div to document fragment
        $(hTag).append(data.businessName);
        $(aTagPhone).append(data.phone);
        $(docFrag).append(topDiv);
        
        // append main image if it exist
        if (mainImg) {
            $(bottomDiv).append(pTagDetails, aTagWeb, hr, mainImg);
        } else {
            $(bottomDiv).append(pTagDetails, aTagWeb);
        }
        
        // append div to document fragment
        $(pTagDetails).append(data.details);
        $(aTagWeb).append(data.website);
        $(docFrag).append(bottomDiv);
        
        // append details data to DOM
        $fullDetails.append(docFrag);
        
        // check to see if image exsist and assign to imgElement
        imgElement = (logoImg) ? logoImg : mainImg;
        
        // if image exist then wait for it to load before executing callback
        // else execute callback without waiting
        (imgElement) ? $(imgElement).load(cb) : cb();
    }

    /**
     * Toggles classes to animate the panel height
     * and up/down arrow
     */
    function togglePanel() {
        $listContainter.toggleClass('ob-expanded ob-collapse');
        $listInnerContainter.toggleClass('ob-fadeOut ob-fadeIn');
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

        data.forEach(function (dataObj) {
            // create elements
            var liTag = myCreateElement('li'),
                linkDetails = myCreateElement('a', {class: 'ob-details', href: '#', 'data-businessname': dataObj.businessName}),
                details = myCreateElement('p'),
                phone = myCreateElement('div', {class: 'ob-phone'}),
                webLink = myCreateElement('a', {href: dataObj.website,target: '_blank'}),
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
        $fullDetails = $(opt.fullDetails);

        // get data
        ajaxManager.loadData(buildList);

        // listener for toggle element
        $toggleElement.bind('click', panelHandler);

        // listener for event delegation
        $listInnerContainter.on('click', 'a[class^="ob-details"]', detailsHandler);

    };

    return publicAPI;
})(jQuery, document);


$(document).ready(function () {
    onlineBizPanel.init({
        listContainer: '#online-list-containter',
        listInnerContainer: '#online-list-containter ul',
        toggleElement: '#online-biz-toggle',
        fullDetails: '#ob-full-details'
    });
});