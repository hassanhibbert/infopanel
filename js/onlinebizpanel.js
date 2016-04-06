/* global $, jQuery, document, ajaxManager */
/* jshint -W030  */

var onlineBizPanel = (function ($, document) {
    var
        // DOM references
        $listContainter,
        $listInnerContainter,
        $toggleElement,
        $fullDetails,
        $backButton,

        // module API
        publicAPI,
        
        shadowViewport = true,
        
        // scroll position
        scrollPosition = {
            top: [],
            temp: null,
            update: function(currentScrollTop) {
                this.temp = currentScrollTop;
            },
            save: function() {
                this.top.push(this.temp);
            },
            set: function (element) {
                element.scrollTop = this.top[0];
                this.top.pop(); // clear the array
            }
        };

    //###############//
    //### Private ###//
    //###############//
    
    /**
     * Toggles classes to animate the panel height
     * and up/down arrow
     */
    function expandCollapsePanel() {
        $listContainter.toggleClass('ob-expanded ob-collapse');
        $listInnerContainter.toggleClass('ob-fadeOut ob-fadeIn');
        $toggleElement.find('i').toggleClass('rotate-up');
    }
    
    /**
     * Show/Hide "Listed Details" and "Full Details" panel.
     * 
     * @param {boolean}
     * @param {element} Element to show
     */
    function changeContent(update, $showEl) {   
        var $hideEl = (update) ? $listInnerContainter : $fullDetails;
        
        $hideEl.addClass('ob-hide');
        $hideEl.toggleClass('ob-fadeOut ob-fadeIn');
        
        $showEl.removeClass('ob-hide');
        
        $showEl.outerHeight(); // trigger css reflow/repaint
        
        $showEl.toggleClass('ob-fadeOut ob-fadeIn');
    
        // set scroll top postion to the last known Y-Coords
        if (!update) {
            scrollPosition.set($listContainter[0]);
        } 
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
     * Handler for panel clicks
     * 
     * @param {event} Click event information
     */
    function handlePanelClick(evt) {
        expandCollapsePanel(); 
    }
    
     /**
     * Handler for back button clicks
     * 
     * @param {event} Click event information
     */
    function handleBackClick(evt) {      
        $backButton.addClass('ob-hide');
        $('.bottom-wrap').remove();
        $('.top-wrap').remove();        
        changeContent(false, $listInnerContainter);
    }
    
    /**
     * Handler for details clicks
     * 
     * @param {event} click event
     */
    function handleDetailsClick(evt) {
        evt.preventDefault();
        var $currentName = $(this).attr('data-businessname'),
            detailsData = ajaxManager.search('businessName', $currentName),
            bindContent = changeContent.bind(null, true, $fullDetails);
        $backButton.removeClass('ob-hide');
        buildFullDetails(detailsData, bindContent);
    }
    
     /**
     * Handler for hide/show shadow on scroll
     * 
     * @param {event} scroll event
     */
    function handleDropShadow(evt) {
        var currentScrollTop = evt.target.scrollTop; 
    
        // add drop-shadow when scrolling
        if (currentScrollTop >= 6 && shadowViewport) {
            $toggleElement.addClass('drop-shadow');
            shadowViewport = false;
        }
        
        // remove drop-shadow when scrolled to the top
        if (currentScrollTop <= 5) {
            $toggleElement.removeClass('drop-shadow');
            shadowViewport = true;
        }
        
        // update with the current scroll position.
        scrollPosition.update(currentScrollTop);
    }
    
    /**
     * Handler for mousedown. Main purpose of this handler is to store the
     * current scroll positon
     * 
     * @param {event} click event
     */
    function handleMouseDown(evt) {
        scrollPosition.save();
    }
    
    /**
     * Builds elements for full details panel and attaches it to DOM
     * 
     * @param {object} object containing the data for full details
     * @param {function} callback is executed after the details are inserted in to DOM
     */
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
            logoImg = (data.logo) ? myCreateElement('img', {src: data.logo, alt: data.businessName}) : undefined,
            mainImg = (data.mainimage) ? myCreateElement('img', {src: data.mainimage, alt: data.businessName}) : undefined;
        
        // append elements (Logo, Business name, phone number)
        (logoImg) ? $(topDiv).append(logoImg) : logoImg; // append logo if it  exist 
        $(topDiv).append(hTag);
        $(topDiv).append(aTagPhone); 
        $(hTag).append(data.businessName);
        $(aTagPhone).append(data.phone);
        $(docFrag).append(topDiv);
        
        // append elements (Description, Main image)
        $(bottomDiv).append(pTagDetails);
        $(bottomDiv).append(aTagWeb);
        (mainImg) ? $(bottomDiv).append(hr, mainImg) : mainImg; // append main image if it exist
        $(pTagDetails).append(data.details);
        $(aTagWeb).append(data.website);
        $(docFrag).append(bottomDiv);
        
        // append full details to DOM
        $fullDetails.append(docFrag);
        
        // check to see if image exsist and assign to imgElement
        imgElement = (logoImg) ? logoImg : mainImg;
        
        // if image exist then wait for it to load before executing callback
        // else execute callback without waiting
        (imgElement) ? $(imgElement).load(cb) : cb();
    }
    
     /**
     * Truncate string
     * 
     * @param {string} string to be truncated
     * @param {integer} number limit on how much to display
     * @return {string} returns truncated string
     */
    function truncate(str, num) {
        if (str.length > num) {
            return str.slice(0, num - 3) + '...';
        }
        return str;
    }
    
    /**
     * Builds out DOM element and append them to DOM
     * 
     * @param {array} contains objects with data to be iterated over 
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
                hTag = myCreateElement('h2'),
                shortDetails = truncate(dataObj.details, 73);

            // append data to elements
            $(liTag).append(linkDetails, phone, webLink);
            $(hTag).append(dataObj.businessName);
            $(details).append(shortDetails);
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
    function collapse() {
        if ($listContainter.hasClass('ob-expanded')) {
            expandCollapsePanel();
        }
    }

    /**
     * Expand panel 
     */
    function expand() {
        if ($listContainter.hasClass('ob-collapse')) {
            expandCollapsePanel();
        }
    }

    /**
     * Initialize listeners, cache DOM references
     *
     * @param {object} DOM elements
     */
    function init(opt) {
        // cache references
        $listContainter = $(opt.listContainer);
        $listInnerContainter = $(opt.listInnerContainer);
        $toggleElement = $(opt.toggleElement);
        $fullDetails = $(opt.fullDetails);
        $backButton = $(opt.backButton);

        // get data and build list to DOM
        ajaxManager.loadData(buildList);

        // listener for toggle element
        $toggleElement.bind('click', handlePanelClick);

        // listener for event delegation
        $listInnerContainter.on('click', 'a[class^="ob-details"]', handleDetailsClick);
        
        // listener for dropshadow
        $listContainter.on('scroll', handleDropShadow);
        
        // listener for back button
        $backButton.on('click', handleBackClick);
        
        $listInnerContainter.on('mousedown', handleMouseDown.bind(scrollPosition));
        
        // DEBUG: temporary listener to test load more method
        $('#loadbutton').bind('click', function(evt) {
            evt.preventDefault();
            ajaxManager.loadMore(5, buildList);
        });
    }
    
    publicAPI = {
        init: init,
        expand: expand,
        collapse: collapse
    };

    return publicAPI;
    
})(jQuery, document);


$(document).ready(function () {
    onlineBizPanel.init({
        listContainer: '#online-list-containter',
        listInnerContainer: '#online-list-containter ul',
        toggleElement: '#online-biz-toggle',
        fullDetails: '#ob-full-details',
        backButton: '#back-button'
    });
});
