$(document).ready(function () {
    
    var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

    $('.interviewSlotWarning').one(animationEnd, function () {
        $('interviewSlotWarning').removeClass("fadeInUp");
    });

    $('.interviewSlotWarning').addClass("fadeInUp  animated");

    $('.js-dismiss').click(function () {
        $('.interviewSlotWarning').fadeOut();
    });


    var isSafari = !!navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) && typeof document.body.style.webkitFilter !== "undefined" && !window.chrome;

    if (isSafari) {
        $('select').addClass('safari');
        $('input[type="text"]').addClass('safari');
    }


    /*------------------------------------*\
    PROFILE-SIDENAV ACCORDION
    \*------------------------------------*/

    $('body').on('click touch', '.js-button--sidebar', function (event) {
        $('#mapInfoWindow--details').addClass('mapInfoWindow--details--open')

        var src = $(this).data('href')

        $('#iframesrc').attr('src', src);
   
    
    });


    var profileCurrentPage = $(".profile-sidenav").find('.is-active');

    if (profileCurrentPage.length > 0) {

        $(".profile-sidenav.is-collapsed").show();

        profileCurrentPage.closest('.profile-sidenav__section').find('.js-profile-sidenav-button').find('.icon').addClass('icon-keyboard-arrow-down').removeClass('icon-keyboard-arrow-right');
        profileCurrentPage.closest('.profile-sidenav__section').find('.js-profile-sidenav-button').attr('aria-expanded', 'true');
        profileCurrentPage.closest('.profile-sidenav__list').show();

        $(this).attr('aria-expanded', 'false');
    }

    $('.js-profile-sidenav-button').click(function () {

        var $list = $(this).siblings('.profile-sidenav__list');

        if ($list.is(":visible")) {
            $list.hide();
            $(this).attr('aria-expanded', 'false');
            //set them all to point right
            $(this).find('.icon').removeClass('icon-keyboard-arrow-down').addClass('icon-keyboard-arrow-right');
        } else {
            $list.show();
            $(this).attr('aria-expanded', 'true');
            $(this).find('.icon').removeClass('icon-keyboard-arrow-right').addClass('icon-keyboard-arrow-down');
        }

    });


  

    /*------------------------------------*\
    QUICKSEARCH GEOLOCATION
    \*------------------------------------*/

    $('body').on('click touch', '.js-geolocation', function (event) {

        event.preventDefault();

        //call geolocation function here


        //change the icon to gps-fixed when we have a location set
        $(this).find('.icon').removeClass('icon-gps-not-fixed');
        $(this).find('.icon').addClass('icon-gps-fixed');



    });

    $(".js-geolocation-input").on("input", function () {
        
        $(this).siblings().find('.icon').addClass('icon-gps-not-fixed');
        $(this).siblings().find('.icon').removeClass('icon-gps-fixed');
    });
});

// On Page Load find the location hiddenFields and check if they are populated.
// This will then set the correct class on the icon.
$(window).on('load', function () {

    var locationDiv = $(".quicksearch__location");
    var hiddenFields = $(locationDiv).find('input[type="hidden"]');

    var hasLng = false;
    var hasLat = false;
    $(hiddenFields).each(function (index) {
        if (index < 2) {

            if (index == 0 && $(this).val()) {
                hasLng = true;
            }
            else if (index == 1 && $(this).val()) {
                hasLat = true;
            }
        }
    });

    if (hasLng && hasLat) {
        $(".js-geolocation").find('.icon').removeClass('icon-gps-not-fixed');
        $(".js-geolocation").find('.icon').addClass('icon-gps-fixed');
    }
    else {
        $(".js-geolocation").find('.icon').removeClass('icon-gps-fixed');
        $(".js-geolocation").find('.icon').addClass('icon-gps-not-fixed');
    }
});


$(window).on('load', function () {
    positionProfileImage('.avatar__img--large', 128);
    positionProfileImage('.avatar__img--small', 24);
    positionProfileImage('.avatar__img--medium', 64);
    positionProfileImage('.topbar__portrait--img', 128);
});


function positionProfileImage(imageClass, containerSize) {

    var img = $(imageClass);
    var imgWidth = $(imageClass).outerWidth();
    var imgHeight = $(imageClass).outerHeight();

    if (imgWidth > imgHeight) {
        img.css({ 'height': containerSize + "px" })
    } else {
        img.css({ 'width': containerSize + "px" })
    }

    $(imageClass).css({
        'margin-left': 0 - ($(imageClass).outerWidth() / 2) + (containerSize / 2),
        'margin-top': 0 - ($(imageClass).outerHeight() / 2) + (containerSize / 2),
        'visibility': 'visible'
    });
}


function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    path = path.toLowerCase();

    $(".nav .nav__link").each(function () {

        $(this).removeAttr("aria-current")

        var data_href = $(this).attr('data-href');

        if (typeof data_href !== typeof undefined && data_href !== false) {

            data_href = data_href.replace(/\/$/, "");
            data_href = data_href.toLowerCase();

            if (data_href == "home") {
                if (window.location.href == $(this).attr("href")) {
                    $(this).addClass('is-active').attr('aria-current', 'true');
                }
            } else if (path.indexOf(data_href) != -1) {
                $(this).addClass('is-active').attr('aria-current', 'true');
            }

        }
    });
}






$(document).ready(function () {

    setNavigation();

    //add validation aria roles for screen readers
    $('.errorsummary, .red, .error-message').attr('role', 'alert');    

    $('.js-vacancyfilter-toggle').on("click", function () {
        if (!$('.js-vacancyfilter').hasClass('.is-visible')) {

            //set visible and add visible class
            $(".js-vacancyfilter").css('visibility', 'visible');
            $(".js-vacancyfilter").addClass("is-visible").attr("aria-hidden", "false");

            ITSTrapFocus($('.js-vacancyfilter'), { namespace: 'filter', onESC: function () { $('.filterblocker').trigger('click'); } });

            if ($('.filterblocker').length == 0)
                $('body').append('<div class="filterblocker"></div>');

            $('.filterblocker, .js-vacancyfilter-close').on('click', function () {

                ITSTrapFocusUndo($('.js-vacancyfilter'), { namespace: 'filter', focusOnElement: $('.js-vacancyfilter-toggle') });
               
                $(".js-vacancyfilter").removeClass("is-visible");
                $('.filterblocker').remove();
                
                $(".js-vacancyfilter").attr("aria-hidden", "true").css('visibility', 'hidden');                        
            });
        }
    });

    $(document).on('click', function (e) {

        var $popovers = $('.js-reveal-container');

        //if there are some popovers on the page
        if ($popovers.length) {

            //if clicked inside popover container
            if ($(e.target).closest('.js-reveal-container').length) {                


                //find the popover container
                var $container = $(e.target).closest('.js-reveal-container');

                if ($(e.target).closest('.js-popover-trigger').length) {
                    //if the dropdown is closed open it
                    if ($container.data("popoverState") == "closed") {
                        showPopover($container);
                    }
                    //if the dropdown is open then close it
                    else if ($container.data("popoverState") == "open") {
                        hidePopover($container);
                    }
                }
            }

            //if clicked anywhere else on the page
            else {                
                hideAllPopovers();
            }
        }
    });

    class Accordion {
        constructor(domNode) {
            this.rootEl = domNode;
            this.buttonEl = this.rootEl.querySelector('button[aria-expanded]');

            const controlsId = this.buttonEl.getAttribute('aria-controls');
            this.contentEl = document.getElementById(controlsId);

            this.open = this.buttonEl.getAttribute('aria-expanded') === 'true';

            // add event listeners
            this.buttonEl.addEventListener('click', this.onButtonClick.bind(this));
        }

        onButtonClick() {
            this.toggle(!this.open);
        }

        toggle(open) {
            // don't do anything if the open state doesn't change
            if (open === this.open) {
                return;
            }

            // update the internal state
            this.open = open;

            // handle DOM updates
            this.buttonEl.setAttribute('aria-expanded', `${open}`);
            if (open) {
                this.contentEl.removeAttribute('hidden');
            } else {
                this.contentEl.setAttribute('hidden', '');
            }
        }

        // Add public open and close methods for convenience
        open() {
            this.toggle(true);
        }

        close() {
            this.toggle(false);
        }
    }

    // init accordions
    const accordions = document.querySelectorAll('.accordion h3');
    accordions.forEach((accordionEl) => {
        new Accordion(accordionEl);
    });
    
});











function showPopover($container) {
    hideAllPopovers();

    var $body = $container.find('.js-reveal-body');  
    var $trigger = $container.find('.js-popover-trigger');  

    $body.css('display', 'block');

    ITSTrapFocus($body, { namespace: 'popover', onESC: function () { hidePopover($container); } });
    
    $trigger.attr('aria-expanded', 'true');

    $container.data("popoverState", "open");
    $container.attr("data-popover-state", "open");
    
    if (window.self !== window.top) {

        var height = $body.outerHeight() + $trigger.outerHeight() + 20;
        var width = 404;       
        
        parent.LoginWidget.resize(height, width);

        
    }
}

function hidePopover($container) {
    var $body = $container.find('.js-reveal-body');  
    var $trigger = $container.find('.js-popover-trigger');  
    //$trigger.focus();

    $body.css('display', 'none');
    $trigger.attr('aria-expanded', 'false');

    $container.data("popoverState", "closed");
    $container.attr("data-popover-state", "closed");

    ITSTrapFocusUndo($body, { namespace: 'popover' });

    if (window.self !== window.top) {

        var height = $('.login-profile-buttons').outerHeight();
        var width = $('.login-profile-buttons').outerWidth(true) + 5;
        parent.LoginWidget.resize(height, width);       
        
    }


}

function hideAllPopovers() {

    $elem = $('.js-reveal-container');

    $elem.find('.js-reveal-body').css("display", "none");
    $elem.find('.js-popover-trigger').attr("aria-expanded", "false");

    $elem.data("popoverState", "closed");
    $elem.attr("data-popover-state", "closed");


    if (window.self !== window.top) {
        var height = $('.login-profile-buttons').outerHeight();
        var width = $('.login-profile-buttons').outerWidth(true) + 5;
        
        parent.LoginWidget.resize(height, width);        
    }

}



function setFilterVisibility() {
    
   
}

//WIDGET FUNCTIONS



//SAVED JOB STUFF

function setJobAsSaved(config) {    
    var $elem = $('#' + config.clientID);
    
    if (config.displayType == "icon") {
        $elem.html('<i class="icon ' + config.icons.jobSaved + '"></i>');
        $elem.attr("title", config.resources.jobSaved + " " + config.vacTitle);
    }
    else {
        $elem.html(config.resources.jobSaved + '<i class="icon ' + config.icons.jobSaved + '"></i>');
        $elem.attr("aria-label", config.resources.jobSaved + " " + config.vacTitle);
    }

    $elem.removeAttr("onclick");
    $elem.attr("onclick", "javascript: RemoveJob(" + JSON.stringify(config) + ");return false;");
    $elem.attr("aria-pressed", "true");  
    
    $elem.removeClass('is-not-added').addClass('is-added');
    
}


function setJobAsNotSaved(config) {
    var $elem = $('#' + config.clientID);

    if (config.displayType == "icon") {
        $elem.html('<i class="icon ' + config.icons.jobNotSaved + '" aria-hidden="true"></i>'); //Save Job
        $elem.attr("title", config.resources.jobNotSaved + " " + config.vacTitle);
    }
    else {
        $elem.html(config.resources.jobNotSaved + '<i class="icon ' + config.icons.jobNotSaved + '" aria-hidden="true"></i>');
        $elem.attr("aria-label", config.resources.jobNotSaved + " " + config.vacTitle);
    }

    $elem.removeAttr("onclick");
    $elem.attr("onclick", "javascript: AddJob(" + JSON.stringify(config) + ");return false; ");
    $elem.attr("aria-pressed", "false");       
    $elem.removeClass('is-added').addClass('is-not-added');
    
}


function SetUpJobState(config) {  
    $.ajax({
        type: "POST",
        url: config.resolvedURL + "WebServices/ClientService.asmx/GetJobState",
        data: "{iVacancyID:" + config.vacID + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                setJobAsSaved(config);                
            }
            else {
                setJobAsNotSaved(config);
            }
        }
    });
}

function CallSuccess(res, config) {
    var dest = $("#" + config.clientID);
    if (res == "OK") {        
        if ($(dest)) {
            if ($(dest).hasClass('is-added')) {
                setJobAsNotSaved(config);

                if (window.parent == window.self)
                    ResetSavedJobCount(-1);
                else 
                    updateSavedJobsCount();
            }
            else if ($(dest).hasClass('is-not-added')) {
                setJobAsSaved(config);     

                if (window.parent == window.self)
                    ResetSavedJobCount(1);
                else
                    updateSavedJobsCount();
            }
        }
        else {
            alert('Fail');
        }
    }
    else {
        alert('Error');
    }
    return false;
}

function CallFailed(res) {
    alert('Error');
    return false;
}

function AddJob(config) {
    $.ajax({
        type: "POST",
        url: config.resolvedURL + "WebServices/ClientService.asmx/AddToJobsList",
        data: "{iVacancyID:" + config.vacID + " , sCandidate:'" + config.candID + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            CallSuccess(msg.d, config);
        }
    });
}

function RemoveJob(config) {        
    $.ajax({
        type: "POST",
        url: config.resolvedURL + "WebServices/ClientService.asmx/RemovedSavedVacancy",
        data: "{iVacancyID:" + config.vacID + " , sCandidate:'" + config.candID  + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            CallSuccess(msg.d, config);
        }
    });
}

function watchElements($elems, type, callback) {
    var config = { attributes: true, childList: true, subtree: true };

    var callbackfunction = function (mutationsList, observer) {
        //debugger;
        $(mutationsList).each(function () {
            if ($(this)[0].type == type) {
                if (typeof callback === "function")
                    callback();
            }
        });        
    };

    $elems.each(function () {
        var obj = new MutationObserver(callbackfunction);

        if ($(this)[0] !== null) {
            obj.observe($(this)[0], config);
        }
    });
}


function updateSavedJobsCount() {
    try {
        if (typeof parent.LoginWidget.container !== 'undefined') {
            parent.LoginWidget.refresh();
        }

        if (typeof parent.SavedJobsWidget.container !== 'undefined') {
            parent.SavedJobsWidget.refresh();
        }
    }
    catch (error) {
        console.error(error);
    }
}     

function completeFormFixedHeaders() {
   

    if ($('.container--topcontent').find('div').hasClass('banner')) {

        $('.container--topcontent').addClass('container--nonFixed');
        $('.dfw-process__nav').addClass('dfw-process__nav--nonFixed');

    }
    else {
        var $progressbar = $Eploy('.progress__total');
        var $progresslabel = $Eploy('.progress__label-value');
        var $titlebar = $Eploy('.title-bar .wrap');

        var scrollposition = $Eploy(window).scrollTop();
        var progressbarOffset = $progressbar.offset().top;
        var appended = false;

        if ($progressbar.length && $titlebar.length) {
            var html = "<div id='progress-container' class='its-o-flexi its-o-flexi--middle  title-bar__progress-container'>" +
                "<div id='progress-bar-container' class='its-o-flexi__cell'>" + $progressbar.clone()[0].outerHTML + "</div>" +
                "<div id='progress-label-container' class='its-o-flexi__fixed-cell soft--left'>" + $progresslabel.clone().html() + "</div>" +
                "</div>"

            $titlebar.append(html);
        }

        var $progressContainer = $Eploy('#progress-container');

        if (scrollposition > progressbarOffset) {
            $progressContainer.addClass('is-attached');
            appended = true;
        }

        $Eploy(window).on('scroll', function () {

            scrollposition = $Eploy(this).scrollTop();

            if (scrollposition > progressbarOffset) {
                if (appended == false) {
                    $progressContainer.addClass('is-attached');
                    appended = true;
                }
            }
            else {
                $progressContainer.removeClass('is-attached');
                appended = false;
            }
        });
    }
}
function scrollSection(btn, dir) {

    var $cont = $(btn).closest('.dragcontainer').find('.dragscroll');

    //get current scroll position
    var scrollyx = $cont.scrollLeft();

    if (dir == 'left')
        scrollyx = scrollyx - 100;
    else
        scrollyx = scrollyx + 100;

    //add scroll item width

    $cont.animate({ scrollLeft: scrollyx }, 250);




}
