$(function(){
    var searchToggleBtn, searchSlideNav;
    var focusableElementsInSearchSlideNav;
    var firstFocusableElementInSearchSlideNav, lastFocusableElementInSearchSlideNav;

    searchToggleBtn  = $("#searchToggleBtn");
    searchSlideNav = $("#searchSlideNav");
    focusableElementsInSearchSlideNav = $('#searchSlideNav input[type="search"], #searchSlideNav button, #searchSlideNav [tabindex]:not([tabindex="-1"])');

    if(focusableElementsInSearchSlideNav.length) {
        firstFocusableElementInSearchSlideNav = focusableElementsInSearchSlideNav.first();
        lastFocusableElementInSearchSlideNav = focusableElementsInSearchSlideNav.last();
    }

    var hamburgerToggleBtn, hamburgerSlideNav;
    var focusableElementsInHamburgerNav;
    var firstFocusableElementInHamburgerNav, lastFocusableElementInHamburgerNav;

    hamburgerToggleBtn  = $("#hamburgerBtnNav");
    hamburgerSlideNav = $("#nav-collapse-design1");
    focusableElementsInHamburgerNav = $('#nav-collapse-design1 a, #nav-collapse-design1 [tabindex]:not([tabindex="-1"])');

    if(focusableElementsInHamburgerNav.length) {
        firstFocusableElementInHamburgerNav = focusableElementsInHamburgerNav.first();
        lastFocusableElementInHamburgerNav = focusableElementsInHamburgerNav.last();
    }



    searchSlideNav.on('shown.bs.collapse', function (e) {
        firstFocusableElementInSearchSlideNav.focus();
        hamburgerSlideNav.collapse('hide');
    });

    searchSlideNav.on("keydown", function (e) {
        if (e.type === "keydown" && e.key !== "Escape") {
            return;
        }

        searchSlideNav.collapse('hide');
        searchToggleBtn.focus();
    });

    firstFocusableElementInSearchSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastFocusableElementInSearchSlideNav.focus()
        }
    });

    lastFocusableElementInSearchSlideNav.on("keydown", function (e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstFocusableElementInSearchSlideNav.focus();
        }
    });

    hamburgerSlideNav.on('shown.bs.collapse', function (e) {
        firstFocusableElementInHamburgerNav.focus();
        searchSlideNav.collapse('hide');
    });

    hamburgerSlideNav.on("keydown", function (e) {
        if (e.type === "keydown" && e.key !== "Escape") {
            return;
        }

        hamburgerSlideNav.collapse('hide');
        hamburgerToggleBtn.focus();
    });

    firstFocusableElementInHamburgerNav.on("keydown", function (e) {
        if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastFocusableElementInHamburgerNav.focus();
        }
    });

    lastFocusableElementInHamburgerNav.on("keydown", function (e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstFocusableElementInHamburgerNav.focus();
        }
    });

});

