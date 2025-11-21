$(function(){
    var langListContainer, langDropDownSlideNav;
    var focusableElementsInLangDropDownSlideNav;
    var firstFocusableElementInLangDropDownSlideNav, lastFocusableElementInLangDropDownSlideNav;

    langListContainer  = $("#langListContainer");
    langDropDownSlideNav = $("#langListDropDown");
    focusableElementsInLangDropDownSlideNav = $('#langListDropDown a, #langListDropDown [tabindex]:not([tabindex="-1"])');

    if(focusableElementsInLangDropDownSlideNav.length) {
        firstFocusableElementInLangDropDownSlideNav = focusableElementsInLangDropDownSlideNav.first();
        lastFocusableElementInLangDropDownSlideNav = focusableElementsInLangDropDownSlideNav.last();
    }

    langListContainer.on('shown.bs.dropdown', function (e) {
        firstFocusableElementInLangDropDownSlideNav.focus();
    });

    firstFocusableElementInLangDropDownSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastFocusableElementInLangDropDownSlideNav.focus();
        }
    });

    lastFocusableElementInLangDropDownSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstFocusableElementInLangDropDownSlideNav.focus();
        }
    });


    var unifyApplyNowButtonContainer;
    var focusableElementsInUnifyApplyNowButtonListDropDownSlideNav;
    var firstFocusableElementInUnifyApplyNowButtonListDropDownSlideNav, lastFocusableElementInUnifyApplyNowButtonListDropDownSlideNav;

    unifyApplyNowButtonContainer  = $("#unifyApplyNowButtonContainer");
    focusableElementsInUnifyApplyNowButtonListDropDownSlideNav = $('#unifyApplyNowButtonListDropDown a, #unifyApplyNowButtonListDropDown [tabindex]:not([tabindex="-1"])');

    if(focusableElementsInUnifyApplyNowButtonListDropDownSlideNav.length) {
        firstFocusableElementInUnifyApplyNowButtonListDropDownSlideNav = focusableElementsInUnifyApplyNowButtonListDropDownSlideNav.first();
        lastFocusableElementInUnifyApplyNowButtonListDropDownSlideNav = focusableElementsInUnifyApplyNowButtonListDropDownSlideNav.last();
    }

    unifyApplyNowButtonContainer.on('shown.bs.dropdown', function (e) {
        firstFocusableElementInUnifyApplyNowButtonListDropDownSlideNav.focus();
    });

    firstFocusableElementInUnifyApplyNowButtonListDropDownSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastFocusableElementInUnifyApplyNowButtonListDropDownSlideNav.focus();
        }
    });

    lastFocusableElementInUnifyApplyNowButtonListDropDownSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstFocusableElementInUnifyApplyNowButtonListDropDownSlideNav.focus();
        }
    });

});

