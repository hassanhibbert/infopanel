/* global $, jQuery, document */

var onlineBizPanel = (function ($, global, document) {
    var
    // DOM references
        $listContainter,
        $listInnerContainter,
        $toggleElement,

        // module API
        publicAPI = {},

        transitionEvent = whichTransitionEvent();

    //###############//
    //### Private ###//
    //###############//

    function whichTransitionEvent() {
        var t,
            el = document.createElement('fakeelement'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /**
     * Handler for panel clicks
     * 
     * @param {event} Click event information
     */
    function panelHandler(evt) {
        var $status = $toggleElement.attr('data-status');
        if ($status === 'accordion') {
            togglePanel();
        } else if ($status === 'back') {
            //backToFullList();
        }
    }

    function detailsHandler(evt) {
        evt.preventDefault();
        var $currentName = $(this).attr('data-businessname'),
            detailsObj = ajaxManager.search('businessName', $currentName);
        populateFullDetails(detailsObj);
        //viewFullDetails();
    }

    function backToFullList() {
        $toggleElement.attr('data-status', 'accordion').find('h2').text('Online Businesses');
    }

    function viewFullDetails() {
        $toggleElement.attr('data-status', 'back').find('h2').text('Back');
    }

    function animationEndHandler(evt) {
        console.log(evt);
    }

    function populateFullDetails(data) {
        var $logo = $('.top-wrap img'),
            $businessName = $('.top-wrap h2'),
            $phone = $('.top-wrap a'),
            $details = $('.bottom-wrap p'),
            $web = $('.bottom-wrap a'),
            $mainImg = $('.bottom-wrap a');
        $logo.attr('src', data.logo);
        $businessName.text(data.businessName);
        $phone.text(data.phone);
        $details.text(data.details);
        $web.attr('href', data.website).text(data.website);
        $mainImg.attr('src', data.mainimage);
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
                linkDetails = myCreateElement('a', {
                    class: 'ob-details',
                    href: '#',
                    'data-businessname': dataObj.businessName
                }),
                details = myCreateElement('p'),
                phone = myCreateElement('div', {
                    class: 'ob-phone'
                }),
                webLink = myCreateElement('a', {
                    href: dataObj.website,
                    target: '_blank'
                }),
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

        // listener for event delegation
        $listInnerContainter.on('click', 'a[class^="ob-details"]', detailsHandler);

        if (transitionEvent) {
            $listInnerContainter.bind(transitionEvent, animationEndHandler);
        }
    };

    return publicAPI;
})(jQuery, window, document);


$(document).ready(function () {
    onlineBizPanel.init({
        listContainer: '#online-list-containter',
        listInnerContainer: '#online-list-containter ul',
        toggleElement: '#online-biz-toggle'
    });
    //onlineBizPanel.expand();

});