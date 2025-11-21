var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("SiteDetailsModule", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Legacy/global", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Utility/UrlUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeSpaceEncodeForQueryParameter = exports.addArrayToQueryString = exports.updateQueryString = void 0;
    function updateQueryString(key, value, url) {
        let targetUrl = url || window.location.href;
        if (targetUrl && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            targetUrl = targetUrl.startsWith('/') ? `${baseUrl}${targetUrl}` : `${baseUrl}/${targetUrl}`;
        }
        const urlObj = new URL(targetUrl);
        if (value === null || value === undefined) {
            urlObj.searchParams.delete(key);
        }
        else {
            urlObj.searchParams.set(key, String(value));
        }
        return urlObj.toString();
    }
    exports.updateQueryString = updateQueryString;
    function addArrayToQueryString(key, values, url) {
        let targetUrl = url || window.location.href;
        if (targetUrl && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            targetUrl = targetUrl.startsWith('/') ? `${baseUrl}${targetUrl}` : `${baseUrl}/${targetUrl}`;
        }
        const urlObj = new URL(targetUrl);
        values.forEach(value => {
            if (value !== null && value !== undefined) {
                urlObj.searchParams.append(key, String(value));
            }
        });
        return urlObj.toString();
    }
    exports.addArrayToQueryString = addArrayToQueryString;
    function safeSpaceEncodeForQueryParameter(value, uriEncode = false) {
        let encodedValue = value.replace(/\s+/g, '_');
        if (uriEncode) {
            encodedValue = encodeURIComponent(encodedValue);
        }
        return encodedValue;
    }
    exports.safeSpaceEncodeForQueryParameter = safeSpaceEncodeForQueryParameter;
});
define("Modules/Shortlist", ["require", "exports", "Legacy/site", "Utility/UrlUtils"], function (require, exports, site_1, UrlUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addToShortlist = exports.shortlistedJobsCount = exports.toggleShortlist = exports.isInShortlist = exports.setShortlistButtons = exports._internalSetShortlistDropdownMisc = exports.setShortlistDropdownMisc = exports.getShortlistInfoCand = exports.getShortlist = exports.removeFromShortlist = void 0;
    const removeFromShortlist = function (jobId) {
        var _a, _b, _c, _d;
        let textvacs = Cookies.get("shortlistvacs");
        let vacancies = [];
        const isPaqEnabled = window.paqEnabled;
        try {
            vacancies = JSON.parse(textvacs);
        }
        catch (e) {
            vacancies = [];
        }
        if (vacancies.indexOf.call(vacancies, jobId) > -1) {
            vacancies.splice(vacancies.indexOf.call(vacancies, jobId), 1);
            textvacs = JSON.stringify(vacancies);
            Cookies.set("shortlistvacs", textvacs, {
                expires: 30,
                secure: true,
                path: window.siteDetails.UrlPrefix.replace(/(?!^\/)\/$/, "")
            });
            (_a = document
                .querySelector(`.shortlistedjobs div[data-jobid='${jobId}']`)) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = document
                .querySelector(`.archivedshortlistedjobs div[data-jobid='${jobId}']`)) === null || _b === void 0 ? void 0 : _b.remove();
            (_d = (_c = document
                .querySelector(`.removeshort[data-jobid='${jobId}']`)) === null || _c === void 0 ? void 0 : _c.closest(".singleshort")) === null || _d === void 0 ? void 0 : _d.remove();
            document.querySelector("#shortlist-container .job-title") ===
                null &&
                document.body.classList.remove("show-shortlist", "shortlist-open");
            window.getShortlist();
        }
        if (isPaqEnabled && window._paq) {
            window._paq.push([
                "trackEvent",
                "Shortlist",
                "RemoveVacancy",
                jobId.toString(),
            ]);
        }
    };
    exports.removeFromShortlist = removeFromShortlist;
    const getShortlist = function () {
        window.setShortlistButtons();
        window.setShortlistDropdownMisc();
        let textvacs = Cookies.get("shortlistvacs");
        if (!textvacs) {
            textvacs = "[]";
            const inlineShortlistWidget = document.querySelector(".inline-shortlist-widget");
            if (inlineShortlistWidget) {
                inlineShortlistWidget.classList.add("empty");
            }
        }
        try {
            const vacancies = JSON.parse(textvacs);
            const updateShortlistContainer = function (data = "") {
                $(".shortlist-container").html(data);
                $("body").trigger("getShortlistComplete");
            };
            if (vacancies.length === 0) {
                updateShortlistContainer();
                return;
            }
            let url = window.siteDetails.UrlPrefix +
                "api/v1/jobs/getshortlist/" +
                $("#site-request-id").val();
            url = (0, UrlUtils_1.addArrayToQueryString)("vacIds", vacancies, url);
            $.get(url)
                .done((data) => {
                updateShortlistContainer(data);
            });
        }
        catch (e) {
        }
    };
    exports.getShortlist = getShortlist;
    const getShortlistInfoCand = function (count) {
        let textvacs = Cookies.get("shortlistvacs");
        if (!textvacs) {
            textvacs = "[]";
        }
        try {
            const vacancies = JSON.parse(textvacs);
            $.post(window.siteDetails.UrlPrefix +
                "api/v1/jobs/getshortlistinfo/" +
                count, { vacs: vacancies }).done((data) => {
                if (data.status == "ok") {
                    let content = "";
                    for (let i = 0; i < data.jobs.length; i++) {
                        const job = data.jobs[i];
                        content +=
                            "<div><a href='" +
                                job.rewriteURL +
                                "'>" +
                                job.title +
                                "</a></div>";
                    }
                }
            });
        }
        catch (e) {
        }
    };
    exports.getShortlistInfoCand = getShortlistInfoCand;
    const setShortlistDropdownMisc = function () {
        (0, exports._internalSetShortlistDropdownMisc)();
    };
    exports.setShortlistDropdownMisc = setShortlistDropdownMisc;
    const _internalSetShortlistDropdownMisc = function () {
        const count = (0, exports.shortlistedJobsCount)();
        document
            .querySelectorAll(".fav-count")
            .forEach(x => x.innerText = count.toString());
        document
            .querySelectorAll(".shortlist-dropdown")
            .forEach((shortlistClass) => {
            var _a;
            if (shortlistClass == null) {
                return;
            }
            (_a = shortlistClass
                .querySelector(".inline-shortlist-widget__cart")) === null || _a === void 0 ? void 0 : _a.setAttribute("aria-label", `${count} jobs in shortlist`);
            if (shortlistClass && shortlistClass.classList.contains("auto-hide")) {
                if (count > 0) {
                    shortlistClass.style.display = "block";
                }
                else {
                    shortlistClass.style.display = "none";
                }
            }
            else {
                const favChild = shortlistClass.querySelector(".fav-count");
                if (count == 0 && favChild) {
                    favChild.style.display = "none";
                    favChild
                        .closest(".inline-shortlist-widget")
                        .classList.add("empty");
                }
                else {
                    favChild.style.display = "block";
                    favChild
                        .closest(".inline-shortlist-widget")
                        .classList.remove("empty");
                }
            }
        });
        if (site_1.customEventCallbacks.onShortlistCountChange) {
            site_1.customEventCallbacks.onShortlistCountChange(count);
        }
    };
    exports._internalSetShortlistDropdownMisc = _internalSetShortlistDropdownMisc;
    const setAttribute = (el) => {
        const jobId = el.getAttribute("data-jobid");
        el.setAttribute("onclick", `toggleShortlist('${jobId}')`);
        if ((0, exports.isInShortlist)(jobId)) {
            el.classList.add("shortlisted");
            el.innerHTML = "Shortlisted";
        }
        else {
            el.classList.remove("shortlisted");
            el.innerHTML = "Shortlist";
        }
    };
    const setShortlistButtons = function () {
        const shortlistBtns = document.querySelectorAll(".shortlistBtn, .attrax-vacancy-tile__shortlist");
        if (shortlistBtns) {
            shortlistBtns.forEach((item) => {
                setAttribute(item);
            });
        }
    };
    exports.setShortlistButtons = setShortlistButtons;
    const isInShortlist = function (jobId) {
        const textvacs = Cookies.get("shortlistvacs");
        let vacancies = [];
        try {
            vacancies = JSON.parse(textvacs);
        }
        catch (e) {
            vacancies = [];
        }
        return vacancies.indexOf.call(vacancies, jobId) > -1;
    };
    exports.isInShortlist = isInShortlist;
    const toggleShortlist = function (jobId) {
        if ((0, exports.isInShortlist)(jobId.toString())) {
            (0, exports.removeFromShortlist)(jobId);
        }
        else {
            (0, exports.addToShortlist)(jobId, $);
        }
    };
    exports.toggleShortlist = toggleShortlist;
    const shortlistedJobsCount = function () {
        const textvacs = Cookies.get("shortlistvacs");
        let vacancies = [];
        try {
            vacancies = JSON.parse(textvacs);
        }
        catch (e) {
            vacancies = [];
        }
        return vacancies.length;
    };
    exports.shortlistedJobsCount = shortlistedJobsCount;
    const addToShortlist = function (jobId, $) {
        const shortlistMaxSize = 30;
        let textvacs = Cookies.get("shortlistvacs");
        let vacancies = [];
        const isPaqEnabled = window.paqEnabled;
        try {
            vacancies = JSON.parse(textvacs);
        }
        catch (e) {
            vacancies = [];
        }
        if (vacancies.indexOf.call(vacancies, jobId) < 0) {
            if (vacancies.length >= shortlistMaxSize) {
                vacancies.shift();
            }
            vacancies.push(jobId);
            textvacs = JSON.stringify(vacancies);
            Cookies.set("shortlistvacs", textvacs, {
                expires: 30,
                secure: true,
                path: window.siteDetails.UrlPrefix.replace(/(?!^\/)\/$/, "")
            });
            window.getShortlist();
        }
        if (isPaqEnabled && window._paq) {
            window._paq.push([
                "trackEvent",
                "Shortlist",
                "AddVacancy",
                jobId.toString(),
            ]);
        }
    };
    exports.addToShortlist = addToShortlist;
});
define("Modules/AttraxCookies", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AcceptPolicyHandler = exports.createCookie = void 0;
    const createCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };
    exports.createCookie = createCookie;
    const AcceptPolicyHandler = () => {
        (0, exports.createCookie)("COP-CookieBanner", "true", 9999);
        const cookieBannerContainer = document.getElementById("cookie-banner-container");
        if (cookieBannerContainer) {
            cookieBannerContainer.style.display = "none";
        }
    };
    exports.AcceptPolicyHandler = AcceptPolicyHandler;
});
define("Utility/Configuration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const config = {
        DisableFormButtonDuringSubmission: "false",
        UseFileUploadedTextV2: "false",
        AdvancedLocationSearchShowRadiusWithoutPlace: "false",
        PushNotificationsShowNotifyButton: "true",
        PushNotificationsEnabled: "false"
    };
    exports.default = config;
});
define("Utility/Antiforgery", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AntiforgeryFormFieldName = exports.AntiforgeryHeaderName = void 0;
    exports.AntiforgeryHeaderName = "X-CSRF-TOKEN-4MATHEADER";
    exports.AntiforgeryFormFieldName = "__RequestVerificationToken";
});
define("Legacy/site", ["require", "exports", "Modules/Shortlist", "Modules/AttraxCookies", "Utility/UrlUtils", "ladda", "sweetalert", "cookies", "Utility/Configuration", "Utility/Antiforgery", "Utility/UrlUtils", "jquery", "jqueryvalidate", "bootstrap", "touchpunch", "select2"], function (require, exports, Shortlist, _AtxCookies, UrlUtils, Ladda, sweetalert_1, cookies_1, Configuration_1, Antiforgery_1, UrlUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegacySiteJs = exports.customEventCallbacks = void 0;
    const useNewFileResource = Configuration_1.default.UseFileUploadedTextV2 === "true";
    const sitePrefix = window.siteUrlPrefix;
    const isPaqEnabled = window.paqEnabled;
    window.behaviourProperties = {
        formCallbackTopOffset: 200,
        formValidationElementType: "div",
        doJobFilterOpen: true,
        notificationBarOnClick: function ($notificationsBarWidget, isContentVisible) {
            if (isContentVisible) {
                $notificationsBarWidget
                    .find(".notifications-bar-widget__content")
                    .slideDown();
            }
            else {
                $notificationsBarWidget
                    .find(".notifications-bar-widget__content")
                    .slideUp();
            }
        },
        onContentTypesWidgetHeadingPress: function (isOpen) {
        },
        onCategoryWidgetHeadingPress: function (isOpen) {
        },
        onTagsWidgetHeadingPress: function (isOpen) {
        },
        onJobSearchKeywordEnter: function ($ele) {
            $ele.closest(".search-widget").find(".jobsearchsubmit").click();
        },
    };
    window.jobFilterNoReloadController = window
        .jobFilterNoReloadController || {
        clearFilterGroup: function (optionDisplayListId) {
            const $parentList = $("[id='" + optionDisplayListId + "']");
            $parentList
                .find(".filter-option")
                .removeClass("filter-option--checked")
                .find("input")
                .prop("checked", false);
            if (optionDisplayListId == "salary-slider") {
                let newUrl = window.location.href;
                newUrl = window.UpdateQueryString("sr", null, newUrl);
                newUrl = window.UpdateQueryString("sm", null, newUrl);
                newUrl = window.UpdateQueryString("sx", null, newUrl);
                window.location.href = newUrl;
                return;
            }
            if (window.clearAllFilters) {
                $(".filter-option").removeClass("filter-option--checked");
                $(".filter-option input").attr("checked", false);
            }
            this.applyJobFilters();
        },
        initialize: function () {
            $(".filter-checkbox").css("pointer-events", "none");
            const opts = window.getUrlParameter("options");
            if (opts) {
                const activeOptionSearcher = opts
                    .split(",")
                    .map(function (x) {
                    return "[data-option-id='" + x + "']";
                })
                    .join(",");
                $(activeOptionSearcher).addClass("filter-option--checked");
            }
            $(".optionfiltergroup--has-filters").removeClass("optionfiltergroup--has-filters");
            $(".filter-option--checked")
                .closest(".optionfiltergroup")
                .addClass("optionfiltergroup--has-filters");
            $(document).trigger("job-filter-initialized");
        },
        enableAndSetNumberDisplayElement: function (optionGroupElementSelector) {
        },
        addFilterOptionId: function (optionId) {
            const strOptionId = optionId.toString();
            const $ele = $("[data-option-id='" + strOptionId + "']");
            const $input = $ele.find("input");
            const $directInput = $ele.find("> .filter-contents > .filter-checkbox > input");
            const $customCheckBox = $ele.find("> .filter-contents");
            if ($directInput.is(":checked")) {
                $input
                    .prop("checked", false)
                    .closest(".filter-option")
                    .removeClass("filter-option--checked");
                $customCheckBox.attr("aria-checked", "false");
            }
            else {
                $input
                    .prop("checked", true)
                    .closest(".filter-option")
                    .addClass("filter-option--checked");
                $customCheckBox.attr("aria-checked", "true");
            }
            this.checkParentElem($input);
            return true;
        },
        enableFilterCount: function (optionGroupElementSelector, textFormat) {
            if (optionGroupElementSelector) {
                window.jobFilterNoReloadController.filterCountElementSelector =
                    optionGroupElementSelector;
                window.jobFilterNoReloadController.filterCountFormat =
                    textFormat;
                window.jobFilterNoReloadController.enableFilterCountUpdates =
                    true;
                $(".optionfiltergroup").each((idx, elm) => {
                    const $elem = $(elm);
                    const $target = $elem.find(optionGroupElementSelector);
                    if ($target.find(".optionfiltergroup__count")
                        .length == 0) {
                        $target.append("<span class='optionfiltergroup__count'></span>");
                    }
                });
                const hasSalaryFilter = window.location.search.indexOf("sr=") >= 0 &&
                    window.location.search.indexOf("sx=200000") == -1;
                if (hasSalaryFilter) {
                    const $target = $(".salary-slider").find(optionGroupElementSelector);
                    if ($target.find(".salary-slider__count").length ==
                        0) {
                        $target.append("<span class='salary-slider__count'></span>");
                    }
                }
                const hasLocationFilter = window.location.search.indexOf("la=0") == -1 &&
                    (window.location.search.indexOf("la=") >= 0 ||
                        window.location.search.indexOf("lr=") >= 0);
                if (hasLocationFilter) {
                    const $target = $(".location-filter").find(optionGroupElementSelector);
                    if ($target.find(".location-filter__count")
                        .length == 0) {
                        $target.append("<span class='location-filter__count'></span>");
                    }
                }
                this.updateFilterDisplayText();
            }
        },
        enableDefaultFilterCounts: function () {
            this.enableFilterCount(".option-type-header-text, .salary-slider__header, .header", "({{Count}})");
        },
        updateFilterDisplayText: function () {
            if (!window.jobFilterNoReloadController
                .enableFilterCountUpdates)
                return;
            const target = window.jobFilterNoReloadController
                .filterCountElementSelector;
            const textFormat = window
                .jobFilterNoReloadController.filterCountFormat;
            $(".optionfiltergroup--has-filters").each((idx, elem) => {
                const $elem = $(elem);
                const nestedFilterCount = $elem.find(".filter-option--checked").length;
                const $textTarget = $elem
                    .find(target)
                    .find(".optionfiltergroup__count");
                $textTarget.text(textFormat.replace("{{Count}}", nestedFilterCount));
            });
            const hasSalaryFilter = window.location.search.indexOf("sr=") >= 0;
            if (hasSalaryFilter) {
                const $target = $(".salary-slider").find(".salary-slider__count");
                $target.text(textFormat.replace("{{Count}}", "1"));
            }
            const hasLocationFilter = window.location.search.indexOf("la=") >= 0 ||
                window.location.search.indexOf("lr=") >= 0;
            if (hasLocationFilter) {
                const $target = $(".location-filter").find(".location-filter__count");
                $target.text(textFormat.replace("{{Count}}", "1"));
            }
        },
        getRootUrl: function () {
            let root = "jobs";
            if (window.location.pathname
                .toLowerCase()
                .indexOf("admin/vacancies") > -1)
                root =
                    window.location.protocol +
                        "//" +
                        window.location.host +
                        "/admin/vacancies";
            else {
                root = $("#site-request-prefix").val() + "jobs";
            }
            return root;
        },
        applyJobFilters: function (resetKeyword = false) {
            const isAllChildrenChecked = ($root) => $root.find(".filter-checkbox > [type='checkbox']")
                .length ===
                $root.find(".filter-checkbox > [type='checkbox']:checked").length;
            const isCheckedWithNoChildren = ($root) => $root.find(".filter-checkbox > [type='checkbox']")
                .length === 1 &&
                $root.find("> .filter-contents [type='checkbox']:checked").length === 1;
            const isOnlySelfCheckedButChildrenExist = ($root) => $root.find("> .filter-contents [type='checkbox']:checked").length === 1 &&
                $root.find(".filter-contents [type='checkbox']:checked")
                    .length === 1 &&
                $root.find(".filter-checkbox > [type='checkbox']")
                    .length > 1;
            $(".not-real").remove();
            $(".filter-option .child-list").append("<li class='hidden not-real' style='height: 0 !important; display: none !important; opacity: 0 !important; visibility: hidden !important;' data-option-id=''></li>");
            let allSelectedOptions = $("[data-option-id]").filter((idx, root) => {
                const $o = $(root);
                const allChildrenChecked = isAllChildrenChecked($o);
                if (allChildrenChecked)
                    return true;
                const hasNoChildrenAndChecked = isCheckedWithNoChildren($o);
                if (hasNoChildrenAndChecked)
                    return true;
                const hasChildrenButOnlySelfChecked = isOnlySelfCheckedButChildrenExist($o);
                if (hasChildrenButOnlySelfChecked)
                    return true;
                return false;
            });
            const selectedOptionMap = allSelectedOptions
                .map((r, elm) => $(elm).attr("data-option-id"))
                .toArray();
            allSelectedOptions = allSelectedOptions
                .filter((idx, option) => {
                if ($(option).attr("data-option-id") === "") {
                    return false;
                }
                const allParentsInHierarchy = $(option)
                    .parents("[data-option-id]")
                    .map((rr, ee) => $(ee).attr("data-option-id"))
                    .toArray();
                for (let i = 0; i < allParentsInHierarchy.length; i++) {
                    const parentOptionId = allParentsInHierarchy[i];
                    if (selectedOptionMap.indexOf(parentOptionId) !== -1)
                        return false;
                }
                return true;
            })
                .map((r, elm) => {
                return $(elm).attr("data-option-id");
            })
                .toArray();
            const optionIdQueryString = allSelectedOptions.join(",");
            const rootUrl = this.getRootUrl();
            let newUrl;
            newUrl = window.UpdateQueryString("options", optionIdQueryString, rootUrl);
            newUrl = window.UpdateQueryString("page", 1, newUrl);
            const searchValue = document.querySelector('.search-filters-widget__filter-search-input') ?
                document.querySelector('.search-filters-widget__filter-search-input').value :
                window.getUrlParameter("q");
            if (!resetKeyword && searchValue) {
                newUrl = window.UpdateQueryString("q", searchValue, newUrl);
            }
            else if (resetKeyword) {
                newUrl = window.UpdateQueryString("q", null, newUrl);
            }
            else {
                const existingQuery = window.getUrlParameter("q");
                if (existingQuery) {
                    newUrl = window.UpdateQueryString("q", existingQuery, newUrl);
                }
            }
            const $salarySlider = $(".salary-slider");
            if ($salarySlider.length) {
                const sr = $("[name='radSalary']").val();
                const sm = $("[name='salarymin']").val();
                const sx = $("[name='salarymax']").val();
                newUrl = window.UpdateQueryString("sr", sr, newUrl);
                newUrl = window.UpdateQueryString("sm", sm, newUrl);
                newUrl = window.UpdateQueryString("sx", sx, newUrl);
            }
            const searchInput = $(".location-search-input");
            const parent = searchInput.parents(".location-filter");
            const lat = parent.find(".location-latitude").val();
            const lon = parent.find(".location-longitude").val();
            const rad = parent.find(".location-radius").val();
            const name = parent.find(".location-name").val();
            const iso = parent.find(".location-iso").val();
            newUrl = window.UpdateQueryString("ln", name, newUrl);
            newUrl = window.UpdateQueryString("la", lat, newUrl);
            newUrl = window.UpdateQueryString("lo", lon, newUrl);
            newUrl = window.UpdateQueryString("lr", rad, newUrl);
            newUrl = window.UpdateQueryString("li", iso, newUrl);
            window.location.href = newUrl;
        },
        closeFilters: function (optionDisplayListId) {
            if (optionDisplayListId === "salary-slider") {
                $(".salary-slider").slideToggle();
            }
            else {
                $(".option-display-list[id='" +
                    optionDisplayListId +
                    "']").slideToggle();
            }
        },
        checkParentElem: function ($element) {
            return;
        },
        refreshView: function () {
        },
    };
    window.PostAlertService = {
        GetEditModalForId: function (postProfileId) {
            let url = "/candidate/getpostprofilemodal/";
            if (postProfileId)
                url += postProfileId;
            return $.get(url);
        },
        CreateOrUpdatePostAlert: function (postAlertId, email, contentTypeGuids, categoryGuids, tagGuids, isActive) {
            email = email || "";
            contentTypeGuids = contentTypeGuids || [];
            categoryGuids = categoryGuids || [];
            tagGuids = tagGuids || [];
            isActive = isActive || false;
            postAlertId = postAlertId || "";
            let postAlertsConditionalUrl;
            if (sitePrefix === "/") {
                postAlertsConditionalUrl = "/candidate/savepostprofile";
            }
            else {
                postAlertsConditionalUrl = `${sitePrefix}candidate/savepostprofile`;
            }
            return $.ajax({
                type: "POST",
                url: postAlertsConditionalUrl,
                contentType: "application/json",
                headers: {
                    [Antiforgery_1.AntiforgeryHeaderName]: window.attraxAntiforgeryToken
                },
                data: JSON.stringify({
                    PostAlertId: postAlertId,
                    Email: email,
                    ContentTypes: contentTypeGuids,
                    Categories: categoryGuids,
                    Tags: tagGuids,
                    IsActive: isActive,
                }),
            });
        },
        DeletePostAlert: function (postAlertId) {
            return $.ajax({
                url: "/candidate/deletepostprofile/" + postAlertId,
                type: "POST",
                headers: {
                    [Antiforgery_1.AntiforgeryHeaderName]: window.attraxAntiforgeryToken
                }
            });
        },
        SwitchAlertState: function (postAlertId) {
            return $.ajax({
                url: "/candidate/updatepostprofilestatus/" + postAlertId,
                type: "POST",
                headers: {
                    [Antiforgery_1.AntiforgeryHeaderName]: window.attraxAntiforgeryToken
                }
            });
        },
    };
    window.preventFormSubmitIfInvalid = function (e, $form) {
        window.checkCopernicusForm($form);
        const isValid = $form.find(".input-validation-error").length <= 0;
        if (!isValid) {
            e.preventDefault();
            $form.find(".input-validation-error").one("change", function () {
                $form.find(".btn").prop("disabled", false);
                $form.find(".ladda-spinner").remove();
                $form.find(".ladda-progress").remove();
                $form.find(".ladda-button").removeClass(".ladda-button");
            });
            return false;
        }
        return true;
    };
    exports.customEventCallbacks = {};
    const enableUrlChangeOnFilter = true;
    const clearAllFilters = false;
    const isUserConnectingToXingManually = false;
    const isUserApplyingViaXing = false;
    String.prototype.cleanup = function () {
        return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
    };
    window.validateEmail = function (email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    window.UpdateLocationSearch = function (parent) {
        const behaviour = parent.find(".location-behaviour").val();
        if (behaviour === "Form") {
            window.UpdateSliderVisible(parent);
        }
        else {
            const lat = parent.find(".location-latitude").val();
            const lon = parent.find(".location-longitude").val();
            const rad = parent.find(".location-radius").val();
            const name = parent.find(".location-name").val();
            const iso = parent.find(".location-iso").val();
            let root = "jobs";
            if (window.location.pathname
                .toLowerCase()
                .indexOf("admin/vacancies") > -1)
                root =
                    window.location.protocol +
                        "//" +
                        window.location.host +
                        "/admin/vacancies";
            else {
                root = $("#site-request-prefix").val() + "jobs";
            }
            root = root + window.location.search;
            let newurl = window.UpdateQueryString("ln", name, root);
            newurl = window.UpdateQueryString("la", lat, newurl);
            newurl = window.UpdateQueryString("lo", lon, newurl);
            newurl = window.UpdateQueryString("lr", rad, newurl);
            newurl = window.UpdateQueryString("li", iso, newurl);
            newurl = window.UpdateQueryString("page", 1, newurl);
            const optVal = $("#landing-page-option-query").val();
            if (optVal)
                newurl = window.UpdateQueryString("options", optVal, newurl);
            location.href = newurl;
        }
    };
    window.clearLocationSearch = function (tgt) {
        const defaultRadius = tgt.find(".default-radius").val();
        tgt.find(".location-latitude").val("0");
        tgt.find(".location-longitude").val("0");
        tgt.find(".location-name").val("");
        tgt.find(".location-iso").val("");
        tgt.find(".location-search-input").val("");
        tgt.find(".location-radius").val(defaultRadius);
    };
    window.fillInAddress = function (parent, e, ac) {
        const place = ac.getPlace();
        if (place.address_components.length == 1) {
            var name = place.formatted_address;
            const isoCode = place.address_components[0].short_name;
            parent.find(".location-name").val(name);
            parent.find(".location-iso").val(isoCode);
            parent.find(".location-latitude").val("");
            parent.find(".location-longitude").val("");
        }
        else {
            const lat = place.geometry.location.lat();
            const lon = place.geometry.location.lng();
            var name = place.formatted_address;
            parent.find(".location-latitude").val(lat);
            parent.find(".location-longitude").val(lon);
            parent.find(".location-name").val(name);
            parent.find(".location-iso").val("");
        }
        window.UpdateLocationSearch(parent);
    };
    window.UpdateSliderVisible = function (parent) {
        const alwaysShowRadius = Configuration_1.default.AdvancedLocationSearchShowRadiusWithoutPlace === "true";
        if (!alwaysShowRadius) {
            const name = parent.find(".location-name").val();
            const iso = parent.find(".location-iso").val();
            if (name === "" || iso !== "") {
                parent.find(".location-slider").hide();
                parent.find(".location-radius-text").hide();
            }
            else {
                parent.find(".location-slider").show();
                parent.find(".location-radius-text").show();
            }
        }
    };
    window.initAutocomplete = function () {
        $(".location-search-input").each(function () {
            const searchInput = $(this);
            const parent = searchInput.parents(".location-filter");
            searchInput.on("change", function () {
                if (searchInput.val() === "") {
                    window.clearLocationSearch(parent);
                }
            });
            if (window.google && window.google.maps) {
                const crData = parent.find(".country-restrict").val();
                let countryRestrict = null;
                if (crData) {
                    if (crData !== "" && crData !== "[") {
                        countryRestrict = JSON.parse(crData);
                    }
                }
                const autoCompleteConfig = {
                    types: ["geocode"],
                    fields: [
                        "address_components",
                        "name",
                        "geometry",
                        "place_id",
                        "formatted_address",
                    ],
                };
                if (countryRestrict && countryRestrict.length > 0) {
                    autoCompleteConfig["componentRestrictions"] = {
                        country: countryRestrict,
                    };
                }
                const autocomplete = new google.maps.places.Autocomplete(this, autoCompleteConfig);
                autocomplete.addListener("place_changed", function (e) {
                    window.fillInAddress(parent, e, autocomplete);
                });
            }
            window.UpdateSliderVisible(parent);
        });
    };
    window.addCopOptionHandlers = function ($) {
        $(document).on("click", ".deleteicon, .attrax-form-item__clear-options", function () {
            $(this).val("");
            $(this)
                .siblings(".copoptions-select")
                .find(".copoptions-check")
                .each(function () {
                $(this).attr("data-state", "unchecked");
            });
            window.updateOptionStates($, $(this).siblings(".copoptions-select"));
            $(this).closest(".form-group").removeClass("onFocus");
        });
        $(".copoptions-input").on("focus", function (e) {
            $(this).prop("readonly", true);
            window.showRelatedOptions($, $(this), e);
            $(this).closest(".form-group").addClass("onFocus");
        });
        $(document).on("click", ".has-delete-icon .fa-caret-down", function (e) {
            const relatedInput = $(this).siblings(".optiondisplay");
            window.showRelatedOptions($, relatedInput, e);
        });
        $(document).on("click", ".copoption", function (e) {
            const id = $(this).attr("data-link-id");
            let selectId = "";
            if ($(this).hasClass("multiple")) {
            }
            else {
                selectId = id.replace(/-item-/gi, "-select-");
                $(this)
                    .closest("div[data-link-id='" + selectId + "']")
                    .hide();
            }
        });
        $(document)
            .off("click", ".attrax-anonymize-candidate-widget__btn-delete")
            .on("click", ".attrax-anonymize-candidate-widget__btn-delete", function () {
            window.location.href = "/candidate/deleteself";
        });
        $(document).on("click", ".copoptions-check", function () {
            const state = $(this).attr("data-state");
            let newState;
            if (state === "checked")
                newState = "unchecked";
            else
                newState = "checked";
            $(this).attr("data-state", newState);
            if (!$(this).hasClass("multiple") && newState === "checked") {
                $(this)
                    .parents(".copoptions-select")
                    .find(".copoptions-check")
                    .not($(this))
                    .each(function () {
                    $(this).attr("data-state", "unchecked");
                });
            }
            const id = $(this).attr("id");
            if ($(this).hasClass("has-children")) {
                $(this)
                    .siblings("ol[data-parent-id='" + id + "']")
                    .find(".copoptions-check")
                    .each(function () {
                    $(this).attr("data-state", newState);
                });
            }
            const parentId = $(this).attr("data-parent-id");
            if (parentId && parentId !== "") {
                $(this)
                    .parent("ol")
                    .siblings(".copoptions-check#" + parentId)
                    .each(function () {
                    if ($(this)
                        .siblings("ol[data-parent-id='" + parentId + "']")
                        .find(".copoptions-check").length === 1) {
                        $(this).addClass("indeterminate");
                    }
                });
            }
            window.updateOptionStates($, $(this).parents(".copoptions-select"), $(this).hasClass("multiple"));
        });
    };
    window.updateCopOptionsSelect = function ($) {
        $(".copoptions-select").each(function () {
            window.updateOptionStates($, $(this));
            $(this)
                .find(".copoptions-check.checked")
                .each(function () {
                const id = $(this).attr("id");
                if ($(this).hasClass("has-children")) {
                    $(this)
                        .siblings("ol[data-parent-id='" + id + "']")
                        .find(".copoptions-check")
                        .each(function () {
                        $(this).removeClass("checked");
                        $(this).removeClass("unchecked");
                        $(this).removeClass("indeterminate");
                        $(this).addClass("checked");
                    });
                }
            });
            const selectedText = [];
            $(this)
                .find(".copoptions-check.checked")
                .each(function () {
                selectedText.push($(this).text());
            });
            let dataList = $(this).attr("data-link-id");
            dataList = dataList.replace(/-select-/gi, "-item-");
            const selector = dataList.replace(/-item-/gi, "-input-");
            const $dataLink = $("input[data-link-id='" + selector + "']");
            if (selectedText.length > 0) {
                $dataLink.val(selectedText.length + " Items selected");
            }
        });
    };
    window.showRelatedOptions = function ($, $element, event) {
        event.preventDefault();
        event.stopPropagation();
        if (!$element.parent().hasClass("open")) {
            $element.trigger("attrax.copoptions.before-show");
            event.preventDefault();
            event.stopPropagation();
            const id = $element.attr("data-link-id");
            const selectId = id.replace(/-input-/gi, "-select-");
            $(".copoptions-select")
                .not("div[data-link-id='" + selectId + "']")
                .hide();
            $("div[data-link-id='" + selectId + "']").show();
            $element.parent().addClass("open");
            $element.trigger("attrax.copoptions.after-show");
        }
        else {
            $element.trigger("attrax.copoptions.before-hide");
            $(".copoptions-select").hide();
            $element.parent().removeClass("open");
            $element.trigger("attrax.copoptions.after-hide");
        }
        $element.off("blur").on("blur", function () {
            $element.parent().removeClass("open");
        });
    };
    window.UpdateQueryString = UrlUtils.updateQueryString;
    window.removeHashFromUrlInPlace = function () {
        let scrollV, scrollH, loc = window.location;
        if ("pushState" in history)
            history.pushState("", document.title, loc.pathname + loc.search);
        else {
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;
            loc.hash = "";
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
        }
    };
    window.setSearchPageSize = function (size) {
        let newurl = window.UpdateQueryString("page", 1);
        newurl = window.UpdateQueryString("size", size, newurl);
        location.href = newurl;
    };
    window.getUrlParameter = function (sParam) {
        const sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split("&");
        let sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split("=");
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    window.triggerJobsPagination = function () {
        const size = window.getUrlParameter("size");
        if (size !== null && size > 0) {
            $("#pagesize").val(size);
        }
        $("#pagesize").change(function () {
            const val = this.value;
            let newurl = window.UpdateQueryString("page", 1);
            newurl = window.UpdateQueryString("size", val, newurl);
            location.href = newurl;
        });
    };
    window.checkCopernicusForm = function (formElem) {
        $(".field-validation-valid").text("");
        const jsonData = [];
        let optionsData = [];
        let validated = true;
        formElem.find(".copformitem").each(function () {
            $(this).removeClass("input-validation-error");
        });
        window.formValidationSuccess(formElem);
        formElem.find(".copformitem, .attrax-form-item__input").each(function () {
            optionsData = [];
            if ($(this).hasClass("optiondisplay")) {
                const optionId = $(this).val();
                if ($.isArray(optionId)) {
                    optionId.forEach(function (e) {
                        if (parseInt(e) !== -1) {
                            optionsData.push(parseInt(e));
                        }
                    });
                }
                else {
                    const val = parseInt(optionId.toString());
                    if (!val || isNaN(val) || val < 0) {
                        if ($(this).attr("data-required") &&
                            $(this).attr("data-required").toLowerCase() ===
                                "true" &&
                            !optionId) {
                            $(this)
                                .siblings(".field-validation-valid")
                                .append("Please select an option<br/>");
                            validated = false;
                        }
                    }
                    else {
                        optionsData.push(parseInt(optionId.toString()));
                    }
                }
                jsonData.push({
                    id: $(this).attr("data-id"),
                    fieldname: $(this).attr("data-entityfieldname"),
                    fieldid: $(this).attr("data-id"),
                    objectid: $(this).attr("data-objectid"),
                    type: $(this).attr("data-type"),
                    label: $(this).attr("data-label"),
                    options: optionsData,
                });
                optionsData = [];
            }
            else {
                const itemLabel = $(this).attr("data-label");
                let itemValue = $(this).val();
                if ($(this).hasClass("file")) {
                    itemValue = $(this).attr("data-fileid");
                }
                if ($(this).attr("data-type") === "fileupload") {
                    itemValue = $(this).val();
                }
                if ($(this).attr("data-type") === "consentpolicy") {
                    if ($(this).is(":checked"))
                        itemValue = "true";
                }
                const itemId = $(this).attr("data-id");
                const objectId = $(this).attr("data-objectid");
                const fieldId = $(this).attr("data-objectid");
                const entityfieldname = $(this).attr("data-entityfieldname");
                const maxlength = $(this).attr("maxlength");
                const objecttype = $(this).attr("data-type");
                const $validationContainer = $(this).siblings(".field-validation-valid");
                if ($(this).attr("data-required") &&
                    $(this).attr("data-required").toLowerCase() === "true") {
                    if (itemValue.toString().trim().length === 0) {
                        $validationContainer.append($(this).attr("data-label") + " is required, please complete.<br/>");
                        validated = false;
                        $(this).addClass("input-validation-error");
                        return;
                    }
                    if ($(this).attr("data-type") === "consentpolicy" &&
                        itemValue !== "true") {
                        $validationContainer.append($(this).attr("data-label") + " is required, please complete.<br/>");
                        validated = false;
                        $(this).addClass("input-validation-error");
                        return;
                    }
                }
                if (maxlength != null &&
                    itemValue !== null &&
                    typeof parseInt(maxlength) === "number") {
                    if (itemValue.toString().length > parseInt(maxlength)) {
                        $validationContainer.append($(this).attr("data-label") +
                            "'s length is bigger than the accepted one.<br/>");
                        validated = false;
                        $(this).addClass("input-validation-error");
                    }
                }
                if ($(this).attr("data-regex") !== null &&
                    $(this).attr("data-regex") !== "") {
                    const regex = new RegExp($(this).attr("data-regex"));
                    const existingValidationMessages = $validationContainer.length;
                    const isEmailValidation = objecttype == "email";
                    if (!regex.test(itemValue.toString())) {
                        validated = false;
                        $validationContainer.append($(this).attr("data-label") + " Is not valid");
                        $(this).addClass("input-validation-error");
                        $(this).one("change", function () {
                            $(this).removeClass("input-validation-error");
                            $(this).siblings(".field-validation-valid").empty();
                            if (window.Ladda)
                                Ladda.stopAll();
                        });
                    }
                    else {
                        $(this).siblings(".field-validation-valid").text("");
                    }
                }
                if ($(this).attr("type") === "checkbox") {
                    itemValue = $(this).is(":checked").toString();
                }
                jsonData.push({
                    id: itemId,
                    fieldname: entityfieldname,
                    fieldid: fieldId,
                    objectid: objectId,
                    type: objecttype,
                    label: itemLabel,
                    value: itemValue,
                });
            }
        });
        if (validated)
            return { jsonData: jsonData, optionsData: optionsData };
        return null;
    };
    window.submitCopernicusForm = function (formElem, options) {
        const callback = options.callback;
        const buttonClicked = options.buttonClicked;
        const recaptchaId = options.recaptchaId;
        const onFail = options.onFail;
        let laddaInstance;
        if (buttonClicked) {
            laddaInstance = Ladda.create(buttonClicked);
            laddaInstance.start();
        }
        const res = window.checkCopernicusForm(formElem);
        let validated = false;
        let jsonData = null;
        let optionsData = null;
        if (!res) {
            validated = false;
        }
        else {
            jsonData = res.jsonData;
            optionsData = res.optionsData;
            validated = true;
        }
        const recaptchaVal = window.recaptchaToken;
        if (!validated) {
            if (laddaInstance)
                laddaInstance.stop();
            window.formValidationFailed(formElem);
            if (options.onFail) {
                options.onFail();
            }
            return false;
        }
        else {
            if (laddaInstance)
                laddaInstance.start();
            window.formValidationSuccess(formElem);
        }
        const token = formElem
            .find("[name='__RequestVerificationToken']")
            .val();
        if (!validated) {
            if (laddaInstance)
                laddaInstance.stop();
            window.formValidationFailed(formElem);
            return false;
        }
        if (optionsData.length > 0) {
            $.post("/candidate/updateoptions", { options: optionsData, [Antiforgery_1.AntiforgeryFormFieldName]: window.attraxAntiforgeryToken }).done((data) => {
                if (data.status === "ok") {
                    window.postCopernicusForm(jsonData, recaptchaVal, function () {
                        if (callback)
                            callback();
                        if (laddaInstance &&
                            buttonClicked &&
                            !buttonClicked.hasClass("btn--workflow-submit"))
                            laddaInstance.remove();
                    }, token, formElem);
                }
            });
        }
        else {
            window.postCopernicusForm(jsonData, recaptchaVal, function () {
                if (callback)
                    callback();
                if (laddaInstance &&
                    buttonClicked &&
                    !$(buttonClicked).hasClass("btn--workflow-submit"))
                    laddaInstance.remove();
            }, token, formElem);
        }
    };
    window.postCopernicusForm = function (jsonData, recaptchaValue, callback, token, formElem) {
        const headerObj = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Recaptcha": window.recaptchaToken,
            "X-COP-Form": "true",
        };
        if (token) {
            headerObj[Antiforgery_1.AntiforgeryHeaderName] = token;
            jsonData["__RequestVerificationToken"] = token;
        }
        const isCopForm = formElem.attr("data-cop-form");
        let action = window.location.href;
        if (isCopForm)
            action = formElem.attr("action");
        $.ajax({
            headers: headerObj,
            type: "POST",
            url: action,
            data: JSON.stringify(jsonData),
        })
            .fail(() => {
            Ladda.stopAll();
        })
            .done((data, textstatus, request) => {
            if (isCopForm) {
                return;
            }
            if (request.status == 302) {
            }
            if (request.getResponseHeader("x-cop-validation")) {
                document.open();
                document.write(request);
                document.close();
                return;
            }
            if (textstatus === "success") {
                jsonData.forEach(function (el) {
                    if (el.fieldname !== "") {
                        $("." + el.id).text(el.value);
                    }
                    else {
                        $(".dyna-item[data-objectid='" +
                            el.fieldid +
                            "'] .dyna-value").text(el.value);
                    }
                });
                if (callback)
                    callback();
            }
            else {
                if (data.message)
                    (0, sweetalert_1.default)(data.message);
                if (callback)
                    callback();
            }
            if (request.getResponseHeader("X-COP-Redirect")) {
                window.location.href =
                    request.getResponseHeader("X-COP-Redirect");
            }
        })
            .always((data, textstatus, request) => {
            if (request.status == 302) {
            }
            if (isCopForm) {
                const arr = request
                    .getAllResponseHeaders()
                    .trim()
                    .split(/[\r\n]+/);
                const headerMap = {};
                arr.forEach(function (line) {
                    const parts = line.split(": ");
                    const header = parts.shift().toUpperCase();
                    const value = parts.join(": ");
                    headerMap[header] = value;
                });
                if (headerMap["X-COP-REDIRECT"]) {
                    window.location.href =
                        headerMap["X-COP-REDIRECT"];
                    return;
                }
                window.processCopForm(request, formElem, callback);
            }
        });
    };
    window.processCopForm = function (data, formElem, callback) {
        let obj = null;
        try {
            obj = JSON.parse(data.responseText);
        }
        catch (e) {
            obj = {};
        }
        if (obj.formErrors &&
            $.isArray(obj.formErrors) &&
            obj.formErrors.length > 0) {
            if (formElem.find(".cop-form-errors").length <= 0)
                formElem.append("<div class='validation-summary-errors cop-form-errors'></div>");
            if ($.isArray(obj.formErrors)) {
                for (let i = 0; i < obj.formErrors.length; i++) {
                    if (formElem
                        .find(".cop-form-errors")
                        .text()
                        .indexOf(obj.formErrors[i]) == -1)
                        formElem
                            .find(".cop-form-errors")
                            .append(obj.formErrors[i] + "<br/>");
                }
            }
            else {
                formElem.find(".cop-form-errors").append(obj.formErrors);
            }
            Ladda.stopAll();
            window.formValidationFailed(formElem);
        }
        else {
            if (callback)
                callback();
            $(formElem).trigger("cop-form-success");
        }
    };
    window.SubmitWorkflowForm = function (form, btn) {
        window.submitCopernicusForm($(form), {
            buttonClicked: btn,
            callback: function () {
            },
        });
    };
    window.LoginSingleClick = function (form, reloadOnSuccess, $button) {
        const headers = {};
        try {
            headers["X-CSRF-TOKEN-4MATHEADER"] =
                SingleClickData.AntiForgeryToken;
        }
        catch (e) {
            headers["X-CSRF-TOKEN-4MATHEADER"] = $(form)
                .find("__RequestVerificationToken")
                .val();
        }
        $(form).addClass("loading");
        window.submitCopernicusForm($(form), {
            callback: function () {
                if ($(".singleClickProfile").length > 0 &&
                    form.find("#setSingleClick").val() === "true") {
                    CreateSingleClickProfile($(".singleClickProfile"));
                    if (reloadOnSuccess) {
                        location.reload();
                    }
                }
                else {
                }
                $(form).removeClass("loading");
            },
        });
    };
    window.setupSingleClickJobAlertWidget = function () {
        $(document)
            .off("click", ".loginAjaxSubmit, .login-widget__btn-submit")
            .on("click", ".loginAjaxSubmit, .login-widget__btn-submit", function () {
            const $thisBtn = $(this);
            const hasSingleClick = $(".singleClickProfile").length > 0 ||
                $("#single-click-job-alert").length > 0;
            if ($(this.parentNode).hasClass("loading")) {
                event.preventDefault();
            }
            else {
                window.LoginSingleClick($(this).closest(".loginForm, .login-widget__form"), hasSingleClick, $thisBtn);
            }
        });
        if ($("div.singleClickProfile").length < 1) {
            return;
        }
        if ($("button.loginAjaxSubmit").length === 0) {
            return;
        }
        if ($(".singleClickProfile").attr("data-userstatus") !== "0" &&
            $(".singleClickProfile").attr("data-profileId")) {
            AddSwitchSingleClick();
        }
        else if ($(".singleClickProfile").attr("data-userstatus") !== "0" &&
            !$(".singleClickProfile").attr("data-profileId")) {
            AddCreateSingleClick();
        }
        else if ($(".singleClickProfile").attr("data-userstatus") === "0") {
            AddRegisterSingleClick();
        }
        $(document)
            .off("click", ".registerSubmit")
            .on("click", ".registerSubmit", function () {
            const form = $(this).closest("form");
            if (form.hasClass("loading")) {
                event.preventDefault();
            }
            else {
                RegisterSingleClickUser(form);
            }
        });
    };
    window.updateOptionStates = function ($, $copSelect, multiSelect) {
        multiSelect = multiSelect || false;
        $copSelect.find(".copoptions-check").each(function () {
            const itemClass = window.checkedStateClassFromChildren($(this));
            $(this)
                .removeClass("checked unchecked indeterminate")
                .addClass(itemClass);
        });
        const selectedOptions = [];
        const selectedText = [];
        $copSelect.find(".copoptions-check.checked").each(function () {
            const dataParentId = $(this).attr("data-parent-id");
            const parent = $copSelect.find("li[id='" + dataParentId + "']");
            if (parent) {
                if (!parent.hasClass("checked")) {
                    selectedOptions.push($(this).attr("id"));
                }
            }
            else {
                selectedOptions.push($(this).attr("id"));
            }
            selectedText.push($(this).text());
        });
        let dataList = $copSelect.attr("data-link-id");
        dataList = dataList.replace(/-select-/gi, "-item-");
        let selector = dataList.replace(/-item-/gi, "-value-");
        $("input[data-link-id='" + selector + "']").val(selectedOptions.join());
        selector = dataList.replace(/-item-/gi, "-input-");
        const $dataLink = $("input[data-link-id='" + selector + "']");
        if (multiSelect) {
            if (selectedText.length == 0) {
                $dataLink.val("");
            }
            else if (selectedText.length == 1) {
                $dataLink.val(selectedText[0]);
            }
            else {
                $dataLink.val(selectedText.length + " Items selected");
            }
        }
        else {
            $dataLink.val(selectedText[0]);
        }
    };
    window.removeFromShortlist = Shortlist.removeFromShortlist;
    window.getShortlist = Shortlist.getShortlist;
    window.getShortlistInfoCand = Shortlist.getShortlistInfoCand;
    window.setShortlistDropdownMisc = Shortlist.setShortlistDropdownMisc;
    window.setShortlistButtons = Shortlist.setShortlistButtons;
    window.isInShortlist = Shortlist.isInShortlist;
    window.toggleShortlist = Shortlist.toggleShortlist;
    window.shortlistedJobsCount = Shortlist.shortlistedJobsCount;
    window.addToShortlist = Shortlist.addToShortlist;
    window.AcceptPolicyHandler = _AtxCookies.AcceptPolicyHandler;
    window.createCookie = _AtxCookies.createCookie;
    window.customEventCallbacks = exports.customEventCallbacks;
    window.showPolicy = function (instanceId, policyType) {
        const consentElem = $("[data-consentid='" + instanceId + "']");
        const consentHeading = consentElem
            .children(".consent-heading")
            .first()
            .html();
        const consentBody = consentElem
            .children(".consent-body")
            .first()
            .html();
        const consentCheck = consentElem.children(".consent-checkbox").first();
        if (policyType === "FullInfoWithCheckbox") {
            (0, sweetalert_1.default)({
                title: consentHeading,
                html: consentBody,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Please review and accept the consent policy to continue.",
                cancelButtonText: "Cancel consent policy",
            })
                .then(function (result) {
                if (result.value) {
                    consentCheck.prop("checked", true);
                }
                else if (result.dismiss === sweetalert_1.default.DismissReason.cancel) {
                    consentCheck.prop("checked", false);
                }
            }, function () {
                consentCheck.prop("checked", false);
            })
                .catch(sweetalert_1.default.noop);
        }
        else if (policyType === "FullInfoText") {
            (0, sweetalert_1.default)({
                title: consentHeading,
                html: consentBody,
                showCancelButton: false,
                confirmButtonText: "Close consent policy",
            });
        }
    };
    window.formValidationSuccess = function (form) {
        $(form).find(".form-validation-message").hide();
        $(form).find(".cop-form-errors").html("");
    };
    window.formValidationFailed = function (form) {
        const formTopElem = $(form).children(".formTop");
        if (formTopElem && formTopElem.length > 0) {
            let configvalue = "";
            try {
                configvalue = JSON.parse("false".toLowerCase());
            }
            catch (e) {
                configvalue = false;
            }
            const showFormValidationMessage = configvalue;
            if (showFormValidationMessage) {
                const validationItems = $("<ul class='form-validation-summary'></ul>");
                $(form)
                    .find(".field-validation-valid")
                    .each(function (idx, val) {
                    const text = val.innerText.trim();
                    if (text === "")
                        return;
                    validationItems.append("<li>" + text + "</li>");
                });
                $(form)
                    .find(".field-validation-error")
                    .each(function (idx, val) {
                    const elemFor = $(val).attr("data-valmsg-for");
                    let elemTitle = $(form)
                        .find("input[name='" + elemFor + "']")
                        .attr("data-label");
                    if (!elemTitle)
                        elemTitle = $(form)
                            .find("textarea[name='" + elemFor + "']")
                            .attr("data-label");
                    if (!elemTitle)
                        elemTitle = $(form)
                            .find("select[name='" + elemFor + "']")
                            .attr("data-label");
                    let text = elemTitle;
                    if ($(val).find("span").length > 0)
                        text += " - " + $(val).find("span")[0].innerText;
                    validationItems.append("<li>" + text + "</li>");
                });
                $(form)
                    .find(".error")
                    .each(function (idx, val) {
                    const text = val.innerText.trim();
                    if (text === "")
                        return;
                    validationItems.append("<li>" + text + "</li>");
                });
                let validationElement = $(form).find(".form-validation-message");
                if (!validationElement || validationElement.length === 0) {
                    validationElement = formTopElem.after("<" +
                        window.behaviourProperties
                            .formValidationElementType +
                        " class='form-validation-message'>Form validation message</" +
                        window.behaviourProperties
                            .formValidationElementType +
                        ">");
                }
                $(form).find(".form-validation-summary").remove();
                $(form)
                    .find(".form-validation-message")
                    .html("Form validation message");
                $(form)
                    .find(".form-validation-message")
                    .append(validationItems);
                $(form)
                    .find(".form-validation-message")
                    .append($(form).find(".cop-form-errors").html());
                validationElement.show();
            }
            let firstErrorElement = $(form)
                .find(".text-danger:visible")
                .filter(":not(:empty)");
            if (!firstErrorElement || !firstErrorElement.length) {
                firstErrorElement = formTopElem;
            }
            if (firstErrorElement && firstErrorElement.length > 0) {
                $("html,body").animate({ scrollTop: firstErrorElement.offset().top - 200 }, "slow");
            }
        }
    };
    window.onXingAuthLogin = function (userData) {
        if (!$("#body").length)
            return;
        if (userData.error) {
            return;
        }
        $(".social-login-btn--xing").show();
        $(".social-login-btn__xing-login-btn").hide();
        $(".social-login-btn__name").text(userData.user.display_name);
        $(document)
            .off("click", ".social-login-btn__continue-as")
            .on("click", ".social-login-btn__continue-as", function () {
            window.onAttraxLoginViaXingRequested(userData.user, false);
        });
        if (window.issUserConnectingToXingManually) {
            window.isUserConnectingToXingManually = false;
            window.onAttraxLoginViaXingRequested(userData.user, false);
        }
        if (window.isUserApplyingViaXing) {
            window.isUserApplyingViaXing = false;
            window.onAttraxLoginViaXingRequested(userData.user, true);
        }
    };
    window.onAttraxLoginViaXingRequested = function (xingUser, isApply) {
        let url = "/Candidate";
        if (isApply) {
            url += "/ApplyWithXing";
            const jobId = window.getUrlParameter("jid");
            xingUser.jobId = jobId;
        }
        else {
            url += "/LoginWithXing";
        }
        $.post(url, xingUser).done(function (resp) {
            if (resp.value && resp.value.redirectUrl) {
                window.location.pathname = resp.value.redirectUrl;
            }
            else {
                window.location.reload(true);
            }
        });
    };
    window.checkedStateClassFromChildren = function ($startElem) {
        let totalChildren = 0;
        let checkedChildren = 0;
        if ($startElem.hasClass("has-children")) {
            var id = $startElem.attr("id");
            totalChildren = $startElem
                .siblings("ol[data-parent-id='" + id + "']")
                .find(".copoptions-check").length;
            checkedChildren = 0;
            $startElem
                .siblings("ol[data-parent-id='" + id + "']")
                .find(".copoptions-check")
                .each(function () {
                if ($(this).attr("data-state") !== "unchecked")
                    checkedChildren = checkedChildren + 1;
            });
        }
        else {
            totalChildren = 1;
            const dataParentId = $(this).attr("data-parent-id");
            const parent = $("li[id='" + dataParentId + "']");
            if (parent && parent.hasClass("checked")) {
                checkedChildren = 1;
                alert(dataParentId);
            }
            else if ($startElem.attr("data-state") !== "unchecked") {
                checkedChildren = 1;
            }
        }
        if (totalChildren === checkedChildren &&
            $startElem
                .siblings("ol[data-parent-id='" + id + "']")
                .find(".copoptions-check").length == 1)
            return "indeterminate";
        if (totalChildren === checkedChildren)
            return "checked";
        if (checkedChildren === 0)
            return "unchecked";
        return "indeterminate";
    };
    window.fileUploadComplete = function (serverData, formField, fileType) {
        var _a, _b, _c, _d, _e;
        const cloudFileField = $("#cloudfile-" + formField.attr("data-link-id"));
        if ((serverData &&
            serverData.responseJSON &&
            serverData.responseJSON.fileid &&
            serverData.responseJSON.status === "ok") ||
            (serverData.status && serverData.status === "ok")) {
            let fileId = null;
            if (serverData.responseJSON && serverData.responseJSON.fileid)
                fileId = serverData.responseJSON.fileid;
            if (!fileId && serverData.fileid)
                fileId = serverData.fileid;
            $(formField).siblings(".field-validation-valid").html("");
            let resourceMessage = "";
            if (useNewFileResource) {
                resourceMessage = "File uploaded, {link}"
                    .replaceAll("{filename}", (_b = (_a = serverData === null || serverData === void 0 ? void 0 : serverData.responseJSON) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "")
                    .replaceAll("{link}", `<a class="file-uploaded-link" href="${sitePrefix}assets/file/${fileId}" target="_blank">{linkText}</a>`)
                    .replaceAll("{linkText}", `download it here`);
            }
            else {
                resourceMessage =
                    fileType +
                        ' File uploaded. Download it <a href="' +
                        window.location.origin +
                        "/assets/file/" +
                        fileId +
                        '" target="_blank">Here</a>';
                try {
                    let filenameReplacement = "";
                    if (serverData &&
                        serverData.responseJSON &&
                        serverData.responseJSON.name)
                        filenameReplacement = serverData.responseJSON.name;
                    resourceMessage = resourceMessage.replace("{filename}", filenameReplacement);
                }
                catch (e) {
                    console.log(e);
                }
            }
            cloudFileField.html(resourceMessage);
            formField.val(fileId);
            cloudFileField.addClass("upload-success");
            cloudFileField.removeClass("upload-fail");
            cloudFileField
                .parents(".cop-form-existingfiles")
                .find(".existingfile-selected")
                .removeClass("existingfile-selected");
            cloudFileField.parent().find(".field-validation-error").remove();
        }
        else {
            if (useNewFileResource) {
                cloudFileField.html("Error uploading file, please try again"
                    .replaceAll("{error}", (_d = (_c = serverData === null || serverData === void 0 ? void 0 : serverData.responseJSON) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : ""));
            }
            else if ((_e = serverData === null || serverData === void 0 ? void 0 : serverData.responseJSON) === null || _e === void 0 ? void 0 : _e.message) {
                cloudFileField.html(serverData.responseJSON.message);
            }
            else {
                if (fileType === 'Local') {
                    cloudFileField.html("Error uploading file: your file is either the wrong file type or size or the file name may contain special characters. Please ensure the file type is either DOC, DOCX or PDF format, under 2MB in size and does not contain any special characters in the file name and upload it again.");
                }
                else {
                    cloudFileField.html("Error uploading file: your file is either the wrong file type or size or the file name may contain special characters. Please ensure the file type is either DOC, DOCX or PDF format, under 2MB in size and does not contain any special characters in the file name and upload it again. " + fileType + " File");
                }
            }
            cloudFileField.addClass("upload-fail");
            cloudFileField.removeClass("upload-success");
            cloudFileField
                .parents(".cop-form-existingfiles")
                .find(".existingfile-selected")
                .removeClass("existingfile-selected");
            formField.val(null);
        }
    };
    window.fileUploadSuccess = function (formFieldId, fileId, fileType) {
        $("#cloudfile").html(fileType +
            ' File uploaded. Download it <a href="' +
            window.location.origin +
            "/assets/file/" +
            fileId +
            '" target="_blank">Here</a>');
        $("#" + formFieldId).val(fileId);
    };
    window.dropbox = function (formFieldId) {
        const formField = $("input[data-link-id='" + formFieldId + "'].copformitem").first();
        $(".dropbox-file-data-label")
            .attr("data-filename", "")
            .removeClass("has-value");
        const options = {
            success: function (files) {
                $(".dropbox-file-data-label")
                    .attr("data-filename", files[0].name)
                    .addClass("has-value");
                $.post("/upload/dropbox", {
                    fileurl: files[0].link,
                    filename: files[0].name,
                }).done((data) => {
                    window.fileUploadComplete(data, formField, "Dropbox");
                });
            },
            cancel: function () {
            },
            linkType: "direct",
            multiselect: false,
            extensions: [".doc", ".docx", ".pdf"],
        };
        Dropbox.choose(options);
    };
    window.fileUpload = function (fieldId) {
        const selector = "hidden-file-upload-" + fieldId;
        document.getElementById(selector).click();
    };
    window.performSearch = function (keyword, titleonly, selectedOptions, la, lo, ln, lr, li) {
        let root = "jobs";
        if (window.location.pathname
            .toLowerCase()
            .indexOf("admin/vacancies") > -1)
            root =
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/admin/vacancies";
        else {
            root = $("#site-request-prefix").val() + "jobs";
        }
        const safeKeyword = (0, UrlUtils_2.safeSpaceEncodeForQueryParameter)(keyword);
        let newurl = window.UpdateQueryString("q", safeKeyword, root);
        if (titleonly != null) {
            newurl = window.UpdateQueryString("jto", titleonly, newurl);
        }
        if (selectedOptions != null) {
            newurl = window.UpdateQueryString("options", selectedOptions.toString(), newurl);
        }
        newurl = window.UpdateQueryString("page", "1", newurl);
        if (la)
            newurl = window.UpdateQueryString("la", la, newurl);
        if (lo)
            newurl = window.UpdateQueryString("lo", lo, newurl);
        if (ln)
            newurl = window.UpdateQueryString("ln", ln, newurl);
        if (lr)
            newurl = window.UpdateQueryString("lr", lr, newurl);
        if (li)
            newurl = window.UpdateQueryString("li", li, newurl);
        window.location.href = newurl;
    };
    window.pagination = function (page) {
        const newUrl = window.UpdateQueryString("page", page);
        location.href = newUrl;
    };
    window.removeFilter = function (optionId) {
        const liElem = $("li[data-option-id='" + optionId + "']");
        $(liElem)
            .find("input")
            .each(function (i, x) {
            $(x).prop("checked", false);
        });
        const parentOptionIds = [];
        const parentElem = liElem
            .parent("ul")
            .parent("li")
            .find("input[type='checkbox']")
            .first();
        if (parentElem.length) {
            const parentOid = parentElem.attr("name").replace("checkfor-", "");
            parentOptionIds.push(parentOid);
            parentElem.prop("checked", false);
        }
        const optCheckboxes = $("#jobfilters").find("input[type='checkbox']");
        const opts = [];
        optCheckboxes.each(function (i, x) {
            if ($(this).is(":checked")) {
                const name = $(this).attr("name");
                const oid = name.replace("checkfor-", "");
                if ($.inArray(oid, parentOptionIds) < 0)
                    opts.push(oid);
            }
        });
        let root = "jobs";
        if (window.location.pathname
            .toLowerCase()
            .indexOf("admin/vacancies") > -1)
            root =
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/admin/vacancies";
        else {
            root = $("#site-request-prefix").val() + "jobs";
        }
        root = root + window.location.search;
        let newurl = window.UpdateQueryString("options", opts, root);
        newurl = window.UpdateQueryString("page", "1", newurl);
        location.href = newurl;
    };
    window.addFilter = function (optionId) {
        let opts = window.getUrlParameter("options");
        if (opts == undefined || opts == null)
            opts = $("#landing-page-option-query").val();
        if (opts == undefined || opts == null)
            opts = "";
        const optionsArray = opts.split(",");
        if (optionsArray.length > 0) {
            const indexOfOption = optionsArray.indexOf(optionId.toString());
            if (indexOfOption != -1) {
                optionsArray.splice(indexOfOption, 1);
            }
            else {
                optionsArray.push(optionId.toString());
            }
            opts = optionsArray.join(",");
        }
        else {
            opts = optionId.toString();
        }
        let root = "jobs";
        if (window.location.pathname
            .toLowerCase()
            .indexOf("admin/vacancies") > -1)
            root =
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/admin/vacancies";
        else {
            root = $("#site-request-prefix").val() + "jobs";
        }
        root = root + window.location.search;
        let newurl = window.UpdateQueryString("options", opts, root);
        newurl = window.UpdateQueryString("page", "1", newurl);
        location.href = newurl;
    };
    window.deselectKeyword = function () {
        window.jobFilterNoReloadController.applyJobFilters(true);
    };
    class LegacySiteJs {
        static InitializeSite() {
            window.JobAlertService = {
                GetHeaders: function (id) {
                    const rvt = $("#profile-" + id)
                        .find("input[name='__RequestVerificationToken']")
                        .val();
                    const headers = {};
                    headers["X-CSRF-TOKEN-4MATHEADER"] = rvt;
                    return headers;
                },
                GetProfileFormId: function (id) {
                    return $("#profile-" + id)
                        .find("input[name='FormId']")
                        .val();
                },
                SwitchAlertState: function (id, successCallback, failureCallback) {
                    const headers = window.JobAlertService.GetHeaders(id);
                    $.ajax({
                        method: "POST",
                        url: "/api/v1/account/switchprofilestatus/" + id,
                        headers: headers,
                    })
                        .done((newStatus) => {
                        if (successCallback)
                            successCallback(newStatus);
                    })
                        .fail(() => {
                        if (failureCallback)
                            failureCallback();
                        alert(DisplayJobAlertData.UpdateErrorText);
                    });
                },
                NewProfile: function (successCallback, failureCallback) {
                    const id = 0;
                    const headers = window.JobAlertService.GetHeaders(id);
                    headers["content-type"] = "application/x-www-form-urlencoded";
                    $.ajax({
                        method: "POST",
                        data: $("#profile-" + id).serialize(),
                        url: "/api/v1/account/profile/" +
                            window.JobAlertService.GetProfileFormId(id),
                        headers: headers,
                    })
                        .done(() => {
                        if (successCallback)
                            successCallback();
                    })
                        .fail(() => {
                        if (failureCallback)
                            failureCallback();
                    });
                },
                EditProfile: function (id, successCallback, failureCallback) {
                    const headers = window.JobAlertService.GetHeaders(id);
                    headers["content-type"] = "application/x-www-form-urlencoded";
                    $.ajax({
                        method: "PUT",
                        data: $("#profile-" + id).serialize(),
                        url: "/api/v1/account/profile/" +
                            window.JobAlertService.GetProfileFormId(id) +
                            "/" +
                            id,
                    })
                        .done(() => {
                        if (window.useBootstrapJs) {
                            $(".modal-dialog").modal("hide");
                        }
                        if (successCallback)
                            successCallback();
                    })
                        .fail(() => {
                        if (failureCallback)
                            failureCallback();
                    });
                },
                SkipProfile: function () {
                    if (window.SkipProfile) {
                        window.SkipProfile();
                    }
                    else {
                        document.location =
                            location.protocol +
                                "//" +
                                location.host +
                                $("#site-request-prefix").val() +
                                "candidatehome";
                    }
                },
                DeleteProfile: function (id, successCallback, failureCallback) {
                    const headers = window.JobAlertService.GetHeaders(id);
                    headers["content-type"] = "application/x-www-form-urlencoded";
                    $.ajax({
                        method: "DELETE",
                        url: "/api/v1/account/profile/" + id,
                    })
                        .done(() => {
                        if (window.useBootstrapJs) {
                            $(".modal-dialog").modal("hide");
                        }
                        if (successCallback)
                            successCallback();
                    })
                        .fail(() => {
                        if (failureCallback)
                            failureCallback();
                    });
                },
                OnLoad: function ($) {
                    this.SetInputHandlers($);
                },
                GetProfileId: function (element) {
                    let profileId = 0;
                    if ($(this).hasClass("profile"))
                        profileId = $(element).attr("data-profileId");
                    else
                        profileId = $(element)
                            .parents(".profile")
                            .attr("data-profileId");
                    if (profileId)
                        return parseInt(profileId.toString());
                    return profileId;
                },
                SetInputHandlers: function ($) {
                    $(document)
                        .off("click", "#skipprofile")
                        .on("click", "#skipprofile", function () {
                        window.JobAlertService.SkipProfile();
                    });
                    $(document)
                        .off("click", ".jobalertprofilewidget__submit-btn, .attraxdisplayjobalertwidget__btn-save")
                        .on("click", ".jobalertprofilewidget__submit-btn, .attraxdisplayjobalertwidget__btn-save", function (e) {
                        Ladda.create(this).start();
                        e.preventDefault();
                        const profileId = window.JobAlertService.GetProfileId(this);
                        if (profileId === 0) {
                            window.JobAlertService.NewProfile(function () {
                                if (window.NewProfile)
                                    window.NewProfile();
                                else
                                    location.reload();
                            }, function () {
                                if (window.JobAlertService
                                    .NewProfile)
                                    window.JobAlertService.NewProfile();
                                else
                                    location.reload();
                            });
                        }
                        else {
                            window.JobAlertService.EditProfile(profileId, function () {
                                location.reload();
                            }, function () {
                                location.reload();
                            });
                        }
                    });
                    $(document)
                        .off("click", ".profileDelete")
                        .on("click", ".profileDelete", function (e) {
                        const profileId = window.JobAlertService.GetProfileId(this);
                        window.JobAlertService.DeleteProfile(profileId, function () {
                            $(".profile[data-profileId='" +
                                profileId +
                                "']").remove();
                        }, null);
                    });
                    $(document)
                        .off("click", ".profileEdit")
                        .on("click", ".profileEdit", function (e) {
                        if (window.useBootstrapJs) {
                            const self = this;
                            $(self)
                                .parent(".profile")
                                .find(".formPopup")
                                .modal("show");
                        }
                    });
                    $(document)
                        .off("click", ".profileStatusCheckbox")
                        .on("click", ".profileStatusCheckbox", function (e) {
                        if ($(this).hasClass("singleclickv1-newprofile"))
                            return;
                        const profileId = window.JobAlertService.GetProfileId(this.parentNode);
                        if ($(this.parentNode).hasClass("loading")) {
                            event.preventDefault();
                        }
                        else {
                            if ($(this).prop("checked")) {
                                $("label[for='" + this.id + "']").text($(this).parent().attr("data-active"));
                            }
                            else {
                                $("label[for='" + this.id + "']").text($(this).parent().attr("data-inactive"));
                            }
                            const $parent = $(this.parentNode);
                            $parent.addClass("loading");
                            window.JobAlertService.SwitchAlertState(profileId, function (newStatus) {
                                $parent.removeClass("loading");
                                const checkbox = $parent.find("input:checkbox:first");
                                const label = $parent.find("label:first");
                                checkbox.prop("checked", newStatus);
                                if (newStatus)
                                    label.text($parent.attr("data-active"));
                                else
                                    label.text($parent.attr("data-inactive"));
                            }, function () {
                                $parent.removeClass("loading");
                                const checkbox = $parent.find("input:checkbox:first");
                                const label = $parent.find("label:first");
                                checkbox.prop("checked", false);
                                label.text($parent.attr("data-inactive"));
                            });
                        }
                    });
                    $(document)
                        .off("click", ".singleclickv1-newprofile")
                        .on("click", ".singleclickv1-newprofile", function (e) {
                        $("#single-click-job-alert").fadeIn();
                    });
                },
            };
            $(document).ready(function () {
                window.JobAlertService.OnLoad($);
            });
            window.enableUrlChangeOnFilter = true;
            $(document).ready(function () {
                $(".form-date").each(function () {
                    const $formGroup = $(this).closest(".form-group");
                    $formGroup.css("position", "relative");
                    $formGroup.uniqueId();
                    $(this).datetimepicker({
                        todayBtn: true,
                        todayHighlight: true,
                        minView: 2,
                        maxView: 2,
                        startView: 2,
                        widgetParent: $formGroup.attr("id"),
                    });
                });
                $(".user-profile-contact-buttons-widget .recaptcha-dismiss").on("click", function () {
                    window.location.reload();
                });
                window.addCopOptionHandlers($);
                if (window.location.href.indexOf("/admin") === -1) {
                    let $allSubmitButtons = $("button[type=submit]").filter((idx, elem) => {
                        return ($(elem).parents(".script-widget").length ===
                            0);
                    });
                    $allSubmitButtons.addClass("attrax-ladda-enable");
                    Ladda.bind(".attrax-ladda-enable");
                }
                $("#cop-outer-toolbar").fadeIn();
                $.extend({
                    getUrlVars: function () {
                        const vars = [];
                        let hash;
                        const hashes = window.location.href
                            .slice(window.location.href.indexOf("?") +
                            1)
                            .split("&");
                        for (let i = 0; i < hashes.length; i++) {
                            hash = hashes[i].split("=");
                            if (vars[hash[0]] == null) {
                                vars.push(hash[0]);
                                vars[hash[0]] = hash[1];
                            }
                            else {
                                if ($.isArray(vars[hash[0]])) {
                                    vars[hash[0]].push(hash[1]);
                                }
                                else {
                                    vars[hash[0]] = [
                                        vars[hash[0]],
                                        hash[1],
                                    ];
                                }
                            }
                        }
                        return vars;
                    },
                    getUrlVar: function (name) {
                        return $.getUrlVars()[name];
                    },
                });
                function removeURLParameter(url, parameter) {
                    const urlparts = url.split("?");
                    if (urlparts.length >= 2) {
                        const prefix = encodeURIComponent(parameter) + "=";
                        const pars = urlparts[1].split(/[&;]/g);
                        for (let i = pars.length; i-- > 0;) {
                            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                                pars.splice(i, 1);
                            }
                        }
                        url =
                            urlparts[0] +
                                (pars.length > 0 ? "?" + pars.join("&") : "");
                        return url;
                    }
                    else {
                        return url;
                    }
                }
                function removeGoalParameter() {
                    const pageUrl = window.location.href;
                    const newPageUrl = removeURLParameter(pageUrl, "goal");
                    history.pushState(null, "", newPageUrl);
                }
                if ($.isArray($.getUrlVar("goal"))) {
                    const goalArray = $.getUrlVar("goal");
                    if ($.inArray("socialhubcv", goalArray) != -1) {
                        (0, sweetalert_1.default)({
                            title: "Thank you",
                            text: "Your CV has been sent and our recruiter will respond ASAP",
                            type: "success",
                        }).then(function () {
                            removeGoalParameter();
                        });
                    }
                    else if ($.inArray("socialhubjobspec", goalArray) != -1) {
                        (0, sweetalert_1.default)({
                            title: "Thank you",
                            text: "Your job specification has been sent and our recruiter will respond ASAP",
                            type: "success",
                        }).then(function () {
                            removeGoalParameter();
                        });
                    }
                    else if ($.inArray("socialhubmessage", goalArray) != -1) {
                        (0, sweetalert_1.default)({
                            title: "Thank you",
                            text: "The message has been sent and our recruiter will respond ASAP",
                            type: "success",
                        }).then(function () {
                            removeGoalParameter();
                        });
                    }
                    else if ($.inArray("postalertthankyou", goalArray) != -1) {
                        (0, sweetalert_1.default)({
                            title: "You\u0027re signed up!",
                            text: "Look out for the latest content and insights from us, straight to your inbox.",
                            type: "success",
                        }).then(function () {
                            removeGoalParameter();
                        });
                    }
                    else if ($.inArray("jobalert", goalArray) != -1) {
                        let jobAlertResourceTitle = "Thanks!";
                        if (jobAlertResourceTitle.indexOf("DEFAULT") > -1) {
                            jobAlertResourceTitle = "Thanks!";
                        }
                        let jobAlertResourceMessage = "Your job alert has been set up successfully!";
                        if (jobAlertResourceMessage.indexOf("DEFAULT") > -1) {
                            jobAlertResourceMessage =
                                "Your job alert has been set up successfully!";
                        }
                        (0, sweetalert_1.default)({
                            title: jobAlertResourceTitle,
                            text: jobAlertResourceMessage,
                            type: "success",
                        }).then(function () {
                            removeGoalParameter();
                        });
                    }
                }
                else {
                    let goalUrlVar = $.getUrlVar("goal");
                    if (!goalUrlVar)
                        goalUrlVar = "";
                    const goalValue = goalUrlVar.toLowerCase();
                    switch (goalValue) {
                        case "socialhubcv":
                            (0, sweetalert_1.default)({
                                title: "Thank you",
                                text: "Your CV has been sent and our recruiter will respond ASAP",
                                type: "success",
                            }).then(function () {
                                removeGoalParameter();
                            });
                            break;
                        case "socialhubjobspec":
                            (0, sweetalert_1.default)({
                                title: "Thank you",
                                text: "Your job specification has been sent and our recruiter will respond ASAP",
                                type: "success",
                            }).then(function () {
                                removeGoalParameter();
                            });
                            break;
                        case "socialhubmessage":
                            (0, sweetalert_1.default)({
                                title: "Thank you",
                                text: "The message has been sent and our recruiter will respond ASAP",
                                type: "success",
                            }).then(function () {
                                removeGoalParameter();
                            });
                            break;
                        case "postalertthankyou":
                            (0, sweetalert_1.default)({
                                title: "You\u0027re signed up!",
                                text: "Look out for the latest content and insights from us, straight to your inbox.",
                                type: "success",
                            }).then(function () {
                                removeGoalParameter();
                            });
                            break;
                        case "jobalert":
                            let jobAlertResourceTitle = "Thanks!";
                            if (jobAlertResourceTitle.indexOf("DEFAULT") >
                                -1) {
                                jobAlertResourceTitle = "Thanks!";
                            }
                            let jobAlertResourceMessage = "Your job alert has been set up successfully!";
                            if (jobAlertResourceMessage.indexOf("DEFAULT") >
                                -1) {
                                jobAlertResourceMessage =
                                    "Your job alert has been set up successfully!";
                            }
                            (0, sweetalert_1.default)({
                                title: jobAlertResourceTitle,
                                text: jobAlertResourceMessage,
                                type: "success",
                            }).then(function () {
                                removeGoalParameter();
                            });
                            break;
                    }
                }
                Shortlist.getShortlist();
                window.updateCopOptionsSelect($);
                $(".location-slider").each(function () {
                    $(this).slider({
                        range: false,
                        min: 1,
                        max: $(this)
                            .parents(".location-filter")
                            .find(".max-radius")
                            .val(),
                        value: $(this)
                            .parents(".location-filter")
                            .find(".default-radius")
                            .val(),
                        create: function (event, ui) {
                        },
                        slide: function (event, ui) {
                            const parent = $(event.target).parents(".location-filter");
                            parent
                                .find(".location-radius-value")
                                .val(ui.value);
                        },
                        stop: function (event, ui) {
                            const parent = $(event.target).parents(".location-filter");
                            parent
                                .find(".location-radius-value")
                                .val(ui.value);
                            parent.find(".location-radius").val(ui.value);
                            window.UpdateLocationSearch(parent);
                        },
                    });
                });
                $("select.select2--in-place").select2();
                $("select.select2, .attrax-form-item--select2").each(function () {
                    const data = $(this).attr("data-select2-tree");
                    if (data) {
                        const jsonData = JSON.parse(data);
                        $(this).select2({
                            data: jsonData,
                        });
                        const selectedVals = $(this).attr("data-selectedvals");
                        if (selectedVals)
                            $(this)
                                .val(selectedVals)
                                .trigger("change");
                    }
                    else {
                        $(this).select2();
                        const label = $(this).siblings('label').text().trim();
                        const container = $(this).siblings('.select2-container');
                        const input = container.find('.select2-search__field');
                        input.attr('aria-label', `${label} selection input`);
                    }
                });
                window.initAutocomplete();
            });
            $(document).ready(function () {
                const frontendLanguagePackCookieName = "languagepackid-front";
                $(".language-pack-switcher-widget__select").on("change", function () {
                    const selectedLanguage = $(this)
                        .val()
                        .toLowerCase();
                    if (selectedLanguage ===
                        "00000000-0000-0000-0000-000000000000") {
                        cookies_1.default.remove(frontendLanguagePackCookieName);
                    }
                    else {
                        cookies_1.default.set(frontendLanguagePackCookieName, selectedLanguage, { expires: 365 });
                    }
                    window.location.reload();
                });
                $(".edit-post-alert__form").on("submit", function (ev) {
                    ev.preventDefault();
                    const $form = $(this);
                    const $nearestEditPostAlertModal = $form.closest(".edit-post-alert");
                    const $btn = $nearestEditPostAlertModal.find(".edit-post-alert__save-button");
                    const $postAlertEmail = $nearestEditPostAlertModal.find(".edit-post-alert__email");
                    const $postAlertContentTypeListbox = $nearestEditPostAlertModal.find(".edit-post-alert__content-types");
                    const $postAlertCategoryListbox = $nearestEditPostAlertModal.find(".edit-post-alert__category");
                    const $postAlertTagListbox = $nearestEditPostAlertModal.find(".edit-post-alert__tags");
                    const $postAlertIsActive = $nearestEditPostAlertModal.find(".edit-post-alert__is-active");
                    const postAlertExistingId = $nearestEditPostAlertModal.attr("data-post-alert-id");
                    const postAlertEmailText = $postAlertEmail.val();
                    const postAlertContentTypes = $postAlertContentTypeListbox.select2("val");
                    const postAlertCategories = $postAlertCategoryListbox.select2("val");
                    const postAlertTags = $postAlertTagListbox.select2("val");
                    const postAlertIsActive = $postAlertIsActive.is(":checked");
                    const $closestForm = $nearestEditPostAlertModal.find("form");
                    const isValid = $closestForm.valid();
                    if (isValid) {
                        $btn.attr("disabled", "disabled");
                        window.PostAlertService.CreateOrUpdatePostAlert(postAlertExistingId, postAlertEmailText, postAlertContentTypes, postAlertCategories, postAlertTags, postAlertIsActive).done(function () {
                            if (window.useBootstrapJs) {
                                $nearestEditPostAlertModal.modal("hide");
                            }
                            const re = /#$/;
                            window.removeHashFromUrlInPlace();
                            let newUrld = window.location.href.replace(re, "");
                            newUrld = window.UpdateQueryString("goal", "postalertthankyou", newUrld);
                            window.location.href = newUrld;
                        });
                    }
                    else {
                    }
                });
            });
            $(document)
                .off("click", ".search-filters-widget__filter-search-btn")
                .on("click", ".search-filters-widget__filter-search-btn", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                window.jobFilterNoReloadController.applyJobFilters();
            });
            $(document)
                .off("click", ".post-alert-list-widget__delete")
                .on("click", ".post-alert-list-widget__delete", function (e) {
                const $this = $(this);
                const $closestProfileRow = $(this).closest(".post-alert-list-widget__post-profile");
                const profileId = $closestProfileRow.attr("data-postprofileid");
                $closestProfileRow.addClass("loading");
                window.PostAlertService.DeletePostAlert(profileId)
                    .done(function () {
                    $closestProfileRow.slideUp(function () {
                        $closestProfileRow.remove();
                    });
                })
                    .always(function () {
                    $closestProfileRow.removeClass("loading");
                });
            });
            $(document)
                .off("change", ".post-alert-list-widget__status-checkbox")
                .on("change", ".post-alert-list-widget__status-checkbox", function (e) {
                const $this = $(this);
                const $closestPostAlertRow = $this.closest(".post-alert-list-widget__post-profile");
                const $labelForCurrentCheckbox = $closestPostAlertRow.find("label[for='" + $this.attr("id") + "']");
                const profileId = $closestPostAlertRow.attr("data-postProfileId");
                if ($closestPostAlertRow.hasClass("loading")) {
                    event.preventDefault();
                    return;
                }
                const activeAlertText = $closestPostAlertRow
                    .find(".post-alert-list-widget__status-wrapper")
                    .attr("data-active-text");
                const inactiveAlertText = $closestPostAlertRow
                    .find(".post-alert-list-widget__status-wrapper")
                    .attr("data-inactive-text");
                $this.attr("disabled", "disabled");
                $closestPostAlertRow.addClass("loading");
                window.PostAlertService.SwitchAlertState(profileId)
                    .always(function () {
                    $closestPostAlertRow.removeClass("loading");
                })
                    .done(function (newStatus) {
                    $this.prop("checked", newStatus);
                    if (newStatus) {
                        $labelForCurrentCheckbox.text(activeAlertText);
                    }
                    else {
                        $labelForCurrentCheckbox.text(inactiveAlertText);
                    }
                })
                    .always(function () {
                    $this.removeAttr("disabled");
                });
            });
            $(document)
                .off("click", ".btn--workflow-submit")
                .on("click", ".btn--workflow-submit", function (e) {
                const $this = $(this);
                const $form = $this.closest("form");
                return window.preventFormSubmitIfInvalid(e, $form);
            });
            $(document)
                .off("click", ".btn--workflow-submit")
                .on("click", ".btn--workflow-submit", function (e) {
                const form = $(this).parents("form");
                window.SubmitWorkflowForm(form, $(this)[0]);
            });
            $(document)
                .off("click", ".post-alert-list-widget__edit-alert")
                .on("click", ".post-alert-list-widget__edit-alert", function (e) {
                const $parentPostAlertListWidget = $(this).closest(".post-alert-list-widget");
                const $parentPostProfileRow = $(this).closest(".post-alert-list-widget__post-profile");
                const targetPostAlertId = $parentPostProfileRow.attr("data-postprofileid");
                window.PostAlertService.GetEditModalForId(targetPostAlertId).done(function (modalResult) {
                    $parentPostAlertListWidget
                        .find(".post-alert-list-widget__modal-container")
                        .html(modalResult);
                    $parentPostAlertListWidget.find(".edit-post-alert-modal").modal("show");
                    $(".edit-post-alert-modal select.select2").each(function () {
                        const data = $(this).attr("data-select2-tree");
                        if (data) {
                            const jsonData = JSON.parse(data);
                            $(this).select2({
                                data: jsonData,
                            });
                            const selectedVals = $(this).attr("data-selectedvals");
                            if (selectedVals)
                                $(this)
                                    .val(selectedVals)
                                    .trigger("change");
                        }
                        else {
                            $(this).select2();
                        }
                    });
                });
            });
            $(document)
                .off("click", ".post-alert-list-widget__new-post")
                .on("click", ".post-alert-list-widget__new-post", function (e) {
                const $parentPostAlertListWidget = $(this).closest(".post-alert-list-widget");
                const $parentPostProfileRow = $(this).closest(".post-alert-list-widget__post-profile");
                const targetPostAlertId = $parentPostProfileRow.attr("data-postprofileid");
                window.PostAlertService
                    .GetEditModalForId()
                    .done(function (modalResult) {
                    $parentPostAlertListWidget
                        .find(".post-alert-list-widget__modal-container")
                        .html(modalResult);
                    $parentPostAlertListWidget.find(".edit-post-alert-modal").modal("show");
                    $(".edit-post-alert-modal select.select2").each(function () {
                        const data = $(this).attr("data-select2-tree");
                        if (data) {
                            const jsonData = JSON.parse(data);
                            $(this).select2({
                                data: jsonData,
                            });
                            const selectedVals = $(this).attr("data-selectedvals");
                            if (selectedVals)
                                $(this)
                                    .val(selectedVals)
                                    .trigger("change");
                        }
                        else {
                            $(this).select2();
                        }
                    });
                });
            });
            $(document)
                .off("click", ".notifications-bar-widget__toggle-btn")
                .on("click", ".notifications-bar-widget__toggle-btn", function () {
                const $this = $(this);
                const $root = $this.closest(".notifications-bar-widget");
                $root.toggleClass("notifications-bar-widget--hidden");
                const isVisible = !$root.hasClass("notifications-bar-widget--hidden");
                window.behaviourProperties.notificationBarOnClick($root, isVisible);
            });
            $(document)
                .off("click", ".formbuilder-file-upload")
                .on("click", ".formbuilder-file-upload", function () {
                window.fileUpload($(this).attr("data-link-id"));
            });
            $(document)
                .off("click", ".formbuilder-dropbox-file-upload")
                .on("click", ".formbuilder-dropbox-file-upload", function () {
                window.dropbox($(this).attr("data-link-id"));
            });
            $(document)
                .off("click", ".formbuilder-existingfile")
                .on("click", ".formbuilder-existingfile", function () {
                $(this)
                    .parents(".cop-form-existingfiles")
                    .find(".existingfile-selected")
                    .removeClass("existingfile-selected");
                const currentFileId = $(this).attr("data-file-id");
                const dummyServerData = {
                    fileid: currentFileId,
                    status: "ok",
                };
                const dataFieldId = $(this).attr("data-link-id");
                const fileField = $("input[data-link-id='" + dataFieldId + "'].copformitem").first();
                window.fileUploadComplete(dummyServerData, fileField, "Existing");
                $(this).addClass("existingfile-selected");
                $(this).parents("form").find("input[name='lastaction']").val(3);
            });
            $(document)
                .off("change", ".hidden-file-upload")
                .on("change", ".hidden-file-upload", function () {
                const firstFile = $(this)[0].files[0];
                if (!firstFile) {
                    return;
                }
                $(".existingfile-selected").removeClass("existingfile-selected");
                const formData = new FormData();
                const sanitizedFileName = firstFile.name.replace(/'/g, "_");
                formData.append("file", firstFile, sanitizedFileName);
                if ($(this).attr("data-objectid"))
                    formData.append("objectid", $(this).attr("data-objectid"));
                const dataFieldId = $(this).attr("data-link-id");
                const formField = $("input[data-link-id='" + dataFieldId + "'].copformitem").first();
                $.ajax({
                    url: `${sitePrefix}upload/file/document`,
                    type: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                }).always((data) => {
                    window.fileUploadComplete(data, formField, "Local");
                });
            });
            $(document)
                .off("click", "#shortlist-container")
                .on("click", "#shortlist-container", function (e) {
                e.stopPropagation();
            });
            $(document)
                .off("click", ".candidate-logout-button")
                .on("click", ".candidate-logout-button", function (e) {
                $.get("/api/v1/account/logoff", function () {
                    window.location.replace(window.siteUrlPrefix);
                });
            });
            $(document)
                .off("click", "#open-edit-modal")
                .on("click", "#open-edit-modal", function (e) {
                $(".field-validation-valid").text("");
                $("#CandFirstName").val($(".CandFirstName").first().text());
                $("#CandLastName").val($(".CandLastName").first().text());
                $(".dyna-item").each(function () {
                    const objId = $(this).attr("data-objectid");
                    const itemVal = $(this).find(".dyna-value").text();
                    $(".copformitem[data-objectid='" + objId + "']").val(itemVal);
                });
            });
            $(document)
                .off("keydown", "input.jobsearchinput, .attrax-search-widget__search-input")
                .on("keydown", "input.jobsearchinput, .attrax-search-widget__search-input", function (e) {
                if (e.keyCode === 13) {
                    window.behaviourProperties.onJobSearchKeywordEnter($(this));
                }
            });
            $(document)
                .off("click", ".attrax-user-profile-contact-buttons-widget__btn-send")
                .on("click", ".attrax-user-profile-contact-buttons-widget__btn-send", function (e) {
                e.preventDefault();
                if (!$("#send-cv-form").valid())
                    return;
                window.fireRecaptchaVerify("UserProfileSendCv", function () {
                    window.onSubmitSendCvForm();
                });
            });
            $(document)
                .off("click", "#editInfoBtn, .attrax-candidate-info-widget__btn-save")
                .on("click", "#editInfoBtn, .attrax-candidate-info-widget__btn-save", function (e) {
                e.preventDefault();
                window.submitCopernicusForm($("#theForm"), {
                    callback: function () {
                        $("#myModal").modal("hide");
                        window.location.replace(window.location.href);
                        window.location.reload(true);
                    },
                    buttonClicked: this,
                });
            });
            $(document)
                .off("click", ".jobsearchsubmit")
                .on("click", ".jobsearchsubmit", function (e) {
                window.jobsearchsubmit(e);
            });
            $(document)
                .off("click", ".copcheckbox")
                .on("click", ".copcheckbox", function () {
                const id = $(this).attr("id").replace("chk-", "");
                $("#" + id).val($(this).is(":checked"));
            });
            $(document)
                .off("click", "#newprofile")
                .on("click", "#newprofile", function () {
                $(".profile[data-profileid='0']").find("form").show();
            });
            $(document)
                .off("click", ".forgotpassbtn")
                .on("click", ".forgotpassbtn", function () {
                const $forgotPassElem = $(this).parent().find(".forgotpass");
                $forgotPassElem.toggle();
                const isForgotPassElemVisible = $forgotPassElem.is(":visible");
                $forgotPassElem.removeClass("is-visible");
                $("body").removeClass("forgot-password-visible");
                if (isForgotPassElemVisible) {
                    $forgotPassElem.addClass("is-visible");
                    $("body").addClass("forgot-password-visible");
                }
            });
            $(document)
                .off("click", ".forgotpass__close-btn")
                .on("click", ".forgotpass__close-btn", function () {
                const $forgotPassElem = $(this).parent();
                $forgotPassElem.toggle();
                const isForgotPassElemVisible = $forgotPassElem.is(":visible");
                $forgotPassElem.removeClass("is-visible");
                $("body").removeClass("forgot-password-visible");
                if (isForgotPassElemVisible) {
                    $forgotPassElem.addClass("is-visible");
                    $("body").addClass("forgot-password-visible");
                }
            });
            $(document)
                .off("click", ".submitForgot")
                .on("click", ".submitForgot", function () {
                $(this).on("keyup keypress", function (e) {
                    const keyCode = e.keyCode || e.which;
                    if (keyCode === 13) {
                        e.preventDefault();
                        return false;
                    }
                });
                const $emailField = $(this)
                    .closest(".forgotpass")
                    .find(".forgotpassinput");
                try {
                    if ($emailField.find(".attrax-form-item__input").length) {
                        const isValid = $emailField.find(".attrax-form-item__input")
                            .valid &&
                            $emailField
                                .find(".attrax-form-item__input")
                                .valid();
                        if (!isValid)
                            return;
                    }
                }
                catch (e) {
                }
                let email = $(this)
                    .parents(".forgotpass")
                    .find(".forgotpassinput")
                    .val()
                    .toString()
                    .trim();
                if (email == "") {
                    var $emailInput = $(this)
                        .parents(".forgotpass")
                        .find(".forgotpassinput")
                        .find(".attrax-form-item__input");
                    if ($emailInput.length) {
                        email = $emailInput.val().toString().trim();
                    }
                }
                if (email.length == 0) {
                    $(this)
                        .parents(".forgotpass")
                        .find(".forgotpassinvalid")
                        .hide();
                    $(this)
                        .parents(".forgotpass")
                        .find(".forgotpassempty")
                        .show();
                    return false;
                }
                if (!window.validateEmail(email)) {
                    $(this)
                        .parents(".forgotpass")
                        .find(".forgotpassempty")
                        .hide();
                    $(this)
                        .parents(".forgotpass")
                        .find(".forgotpassinvalid")
                        .show();
                    return false;
                }
                const forgotPassOk = $(this)
                    .parents(".forgotpass")
                    .find(".forgotpasssuccess");
                $.post("/candidate/forgotpassword", { email: email, [Antiforgery_1.AntiforgeryFormFieldName]: window.attraxAntiforgeryToken }).done((data) => {
                    if (data.status == "ok") {
                        forgotPassOk.show();
                    }
                });
                return false;
            });
            $(document)
                .off("click", ".view-more-filters")
                .on("click", ".view-more-filters", function () {
                $(this).prev("ul").children("li.hidden").removeClass("hidden");
            });
            $(document)
                .off("click", ".filter-expand-hide .on-open")
                .on("click", ".filter-expand-hide .on-open", function () {
                const $this = $(this);
                $this.hide();
                $this
                    .parent()
                    .children(".on-closed")
                    .css({ display: "inline-block" });
                $this
                    .closest(".filter-option")
                    .children(".child-list")
                    .children("li")
                    .addClass("hidden");
            });
            $(document)
                .off("click touch", ".filter-expand-hide .on-closed")
                .on("click touch", ".filter-expand-hide .on-closed", function (e) {
                e.stopPropagation();
                const $this = $(this);
                $this.hide();
                $this
                    .parent()
                    .children(".on-open")
                    .css({ display: "inline-block" });
                $this
                    .closest(".filter-option")
                    .children(".child-list")
                    .children("li")
                    .removeClass("hidden");
            });
            $(document)
                .off("click", ".list-widget__tab")
                .on("click", ".list-widget__tab", function () {
                $(".list-widget__tab").removeClass("list-widget__tab--active");
                $(this).addClass("list-widget__tab--active");
                const parentElem = $(this).parents(".cop-widget").attr("id");
                const showElem = $(this).attr("data-show");
                $("#" + parentElem)
                    .find(".list-widget__list")
                    .hide();
                $("#" + parentElem)
                    .find("#" + showElem)
                    .show();
            });
            $(document)
                .off("click", ".clear-search")
                .on("click", ".clear-search", function (e) {
                const tgt = $(e.target).parents(".location-filter");
                window.clearLocationSearch(tgt);
                window.UpdateLocationSearch(tgt);
            });
            $(document)
                .off("change", ".location-radius-value")
                .on("change", ".location-radius-value", function (e) {
                const tgt = $(e.target).parents(".location-filter");
                const rad = parseInt(tgt.find(".location-radius-value").val().toString());
                tgt.find(".location-radius").val(rad);
                try {
                    tgt.find(".location-slider").slider("value", rad);
                }
                catch (e) {
                }
                window.UpdateLocationSearch(tgt);
            });
            function doJobAlertSubmit($form, isV2) {
                var form = $form;
                if (form.valid()) {
                    const $btn = $(form).closest('.attrax-popup-modal__inner').find(".attrax-job-alert-widget__btn-save");
                    $btn.attr('disabled', 'disabled');
                    let email;
                    if (isV2) {
                        email = $(form).find(".JobAlertEmail input").val();
                    }
                    else {
                        email = $(form).find(".JobAlertEmail").val();
                    }
                    const jsonData = {
                        Email: email,
                        OptionsList: $(form).find(".copOptions").val(),
                        Keywords: $(form).find(".copKeywords").val(),
                        SiteId: $(form).find(".copSiteId").val(),
                        GeoRangeJsonString: $(form).find(".copGeoRange").val(),
                        SalaryRangeJsonString: $(form)
                            .find(".copSalaryRange")
                            .val(),
                    };
                    let singleClickAlertsConditionalUrl;
                    if (sitePrefix === "/") {
                        singleClickAlertsConditionalUrl = "/candidate/singleclickjobalert";
                    }
                    else {
                        singleClickAlertsConditionalUrl = `${sitePrefix}/candidate/singleclickjobalert`;
                    }
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(jsonData),
                        url: singleClickAlertsConditionalUrl,
                        contentType: "application/json",
                        headers: {
                            [Antiforgery_1.AntiforgeryHeaderName]: window.attraxAntiforgeryToken
                        }
                    }).done(function (data) {
                        if (data.status == "ok") {
                            $(form)
                                .find(".single-click-job-alert-thank-you")
                                .show();
                            $(form).find(".single-click-job-alert-error").hide();
                            $(".single-click-job-alert-form").hide();
                            $(".open-single-click-job-alert-modal").hide();
                            $(".JobAlertEmail").hide();
                            $("#single-click-job-alert").modal("hide");
                            let newUrl = window.location.href;
                            newUrl = window.UpdateQueryString("goal", "jobalert", newUrl);
                            window.location.href = newUrl;
                        }
                        else {
                            $(".JobAlertEmail").show();
                            $(form)
                                .find(".single-click-job-alert-thank-you")
                                .hide();
                            $(form).find(".single-click-job-alert-error").show();
                        }
                    });
                    return false;
                }
                else {
                    form.find(".text-danger").text("Please enter a valid email");
                }
            }
            $(document)
                .off("click", ".single-click-job-alert-button")
                .on("click", ".single-click-job-alert-button", function (e) {
                e.preventDefault();
                const $form = $(e.target).parents("form");
                doJobAlertSubmit($form, false);
            });
            $(document)
                .off("click", ".attrax-job-alert-widget__btn-save")
                .on("click", ".attrax-job-alert-widget__btn-save", function (e) {
                e.preventDefault();
                const $form = $(this)
                    .parents(".attrax-job-alert-widget__form-modal")
                    .find("form");
                doJobAlertSubmit($form, true);
            });
            $(document)
                .off("click", ".content-types-widget .content-types-widget__heading")
                .on("click", ".content-types-widget .content-types-widget__heading", function (e) {
                const $closestWidget = $(this).closest(".content-types-widget");
                const isOpen = $closestWidget.hasClass("content-types-widget--opened");
                if (isOpen) {
                    $closestWidget.removeClass("content-types-widget--opened");
                }
                else {
                    $(".content-types-widget").removeClass("content-types-widget--opened");
                    $(".post-categories-widget").removeClass("post-categories-widget--opened");
                    $(".tags-widget").removeClass("tags-widget--opened");
                    $closestWidget.addClass("content-types-widget--opened");
                }
                if (window.behaviourProperties
                    .onContentTypesWidgetHeadingPress)
                    window.behaviourProperties.onContentTypesWidgetHeadingPress(!isOpen);
            });
            $(document)
                .off("click", ".post-categories-widget .category-label")
                .on("click", ".post-categories-widget .category-label", function (e) {
                const $closestWidget = $(this).closest(".post-categories-widget");
                const isOpen = $closestWidget.hasClass("post-categories-widget--opened");
                if (isOpen) {
                    $closestWidget.removeClass("post-categories-widget--opened");
                }
                else {
                    $(".content-types-widget").removeClass("content-types-widget--opened");
                    $(".post-categories-widget").removeClass("post-categories-widget--opened");
                    $(".tags-widget").removeClass("tags-widget--opened");
                    $closestWidget.addClass("post-categories-widget--opened");
                }
                if (window.behaviourProperties
                    .onCategoryWidgetHeadingPress)
                    window.behaviourProperties.onCategoryWidgetHeadingPress(!isOpen);
            });
            $(document)
                .off("click", ".tags-widget .tags-widget__heading")
                .on("click", ".tags-widget .tags-widget__heading", function (e) {
                const $closestWidget = $(this).closest(".tags-widget");
                const isOpen = $closestWidget.hasClass("tags-widget--opened");
                if (isOpen) {
                    $closestWidget.removeClass("tags-widget--opened");
                }
                else {
                    $(".content-types-widget").removeClass("content-types-widget--opened");
                    $(".post-categories-widget").removeClass("post-categories-widget--opened");
                    $(".tags-widget").removeClass("tags-widget--opened");
                    $closestWidget.addClass("tags-widget--opened");
                }
                if (window.behaviourProperties.onTagsWidgetHeadingPress)
                    window.behaviourProperties.onTagsWidgetHeadingPress(!isOpen);
            });
            window.jobsearchsubmit = function (e) {
                const closestSection = $(e.target).closest(".keywordsearchwrapper");
                const isv2 = closestSection.find(".jobsearchinput").is("div");
                let keyword = "";
                if (isv2) {
                    keyword = closestSection.find(".jobsearchinput input").val();
                }
                else {
                    keyword = closestSection.find(".jobsearchinput").val();
                }
                const checkbox = closestSection.find(".jobtitleonlycheck");
                const la = closestSection.find(".location-latitude").val();
                const lo = closestSection.find(".location-longitude").val();
                const ln = closestSection.find(".location-name").val();
                const lr = closestSection.find(".location-radius").val();
                const li = closestSection.find(".location-iso").val();
                let selectedOptions = closestSection
                    .find(".optiondisplay :selected")
                    .map(function () {
                    return $(this).val();
                })
                    .get();
                const hierarchyOptions = closestSection
                    .find(".copoptions-select .copoptions-check[data-state='checked']")
                    .filter(function () {
                    const parentId = $(this).attr("data-parent-id");
                    const parent = closestSection.find(`.copoptions-check[id='${parentId}']`);
                    if (parent.attr('data-state') !== 'checked') {
                        return true;
                    }
                    const allChildren = closestSection.find(`.copoptions-check[data-parent-id='${parentId}']`);
                    const allChildrenChecked = allChildren.filter(function () {
                        return $(this).attr('data-state') === 'checked';
                    });
                    return allChildrenChecked.length !== allChildren.length;
                })
                    .map(function () {
                    return $(this).attr("id");
                })
                    .get();
                const optstr = closestSection.find(".contextoptions").val();
                let contextOptions = null;
                if (optstr) {
                    contextOptions = optstr.split(",");
                }
                selectedOptions = selectedOptions.concat(hierarchyOptions);
                selectedOptions = selectedOptions.concat(contextOptions);
                if (selectedOptions !== null &&
                    selectedOptions.length > 0 &&
                    checkbox != null &&
                    checkbox.length > 0) {
                    window.performSearch(keyword, checkbox.is(":checked"), selectedOptions, la, lo, ln, lr, li);
                }
                else if (selectedOptions !== null && selectedOptions.length > 0) {
                    window.performSearch(keyword, null, selectedOptions, la, lo, ln, lr, li);
                }
                else if (checkbox !== null && checkbox.length > 0) {
                    window.performSearch(keyword, checkbox.is(":checked"), null, la, lo, ln, lr, li);
                }
                else {
                    window.performSearch(keyword, false, null, la, lo, ln, lr, li);
                }
            };
            window.onSubmitApplyForm = function ($form, token) {
                window.submitCopernicusForm($form, {
                    recaptchaId: window.recaptchaToken,
                    buttonClicked: $form.find("button")[0],
                    callback: function () {
                    },
                });
            };
            window.onSubmitMessageMeForm = function ($override) {
                let $formToSubmit = $override || $("#message-me-form");
                window.submitCopernicusForm($formToSubmit, {
                    recaptchaId: window.recaptchaToken,
                    buttonClicked: $("#submit-message-me")[0],
                    callback: function () {
                        if (window.useBootstrapJs) {
                            $("#message-me").modal("hide");
                        }
                        if (isPaqEnabled && window._paq) {
                            const formId = $("#message-me-form")
                                .find("[name='FormId']")
                                .val();
                            if (formId)
                                window._paq.push([
                                    "trackEvent",
                                    "Form",
                                    "SubmitSocialHubSendMessageForm",
                                    formId,
                                ]);
                        }
                        if (window.location.href.indexOf("?") < 0) {
                            var re = /#$/;
                            var newUrld = window.location.href.replace(re, "");
                            newUrld = newUrld.replace(/#\/$/, "");
                            window.location.href =
                                newUrld + "?goal=socialhubmessage";
                        }
                        else {
                            var fullUrl = window.location.href.split("?");
                            var params = fullUrl[1].split("&");
                            var paramstring = "";
                            for (var i = 0; i < params.length; i++) {
                                if (params[i].indexOf("goal=") > -1) {
                                    paramstring += "goal=socialhubmessage";
                                }
                                else {
                                    var fullUrl = window.location.href.split("?");
                                    var params = fullUrl[1].split("&");
                                    var paramstring = "";
                                    for (var i = 0; i < params.length; i++) {
                                        if (params[i].indexOf("goal=") > -1) {
                                            paramstring += "goal=socialhubmessage";
                                        }
                                        else {
                                            paramstring += params[i];
                                        }
                                        paramstring += "&";
                                    }
                                    var re = /#$/;
                                    var newUrld = fullUrl[0].replace(re, "");
                                    newUrld = newUrld.replace(/#\/$/, "");
                                    window.location.href =
                                        newUrld + "?" + paramstring;
                                }
                            }
                        }
                    },
                });
            };
            window.onSubmitSendCvForm = function () {
                window.submitCopernicusForm($("#send-cv-form"), {
                    callback: function () {
                        if (isPaqEnabled && window._paq) {
                            const formId = $("#send-cv")
                                .find("[name='FormId']")
                                .val();
                            if (formId)
                                window._paq.push([
                                    "trackEvent",
                                    "Form",
                                    "SubmitSocialHubSendCvForm",
                                    formId,
                                ]);
                        }
                        $("#send-cv").modal("hide");
                        if (window.location.href.indexOf("?") == -1) {
                            window.location.href =
                                window.location.href +
                                    "?goal=socialhubcv&goal=c1v";
                        }
                        else {
                            window.location.href =
                                window.location.href.split("?")[0] +
                                    "?goal=socialhubcv&goal=c1v";
                        }
                    },
                    buttonClicked: $("#submit-send-cv")[0],
                });
            };
            window.onSubmitJobSpecForm = function () {
                window.submitCopernicusForm($("#send-jobspec-form"), {
                    callback: function () {
                        if (isPaqEnabled && window._paq) {
                            const formId = $("#send-jobspec-form")
                                .find("[name='FormId']")
                                .val();
                            if (formId)
                                window._paq.push([
                                    "trackEvent",
                                    "Form",
                                    "SubmitSocialHubSendJobSpecForm",
                                    formId,
                                ]);
                        }
                        $("#send-jobspec").modal("hide");
                        if (window.location.href.indexOf("?") == -1) {
                            window.location.href =
                                window.location.href +
                                    "?goal=socialhubjobspec";
                        }
                        else {
                            window.location.href =
                                window.location.href.split("?")[0] +
                                    "?goal=socialhubjobspec";
                        }
                    },
                    buttonClicked: $("#submit-send-jobspec")[0],
                });
            };
            window.setupSingleClickJobAlertWidget();
            $("#print_document").click(function () {
                window.print();
            });
            window.defaultJobFilterLoadCallback = function (container) {
                if (!container) {
                    container = ".search-filters-widget";
                }
                $(container + " #jobfilters .optionfiltergroup .filter-option").addClass("hidden");
                $(container + " #jobfilters .optionfiltergroup >ul >li").removeClass("hidden");
                const $checkedFilterOptions = $(".filter-option input[checked]").closest(".filter-option");
                $checkedFilterOptions.removeClass("hidden");
                $checkedFilterOptions.siblings().removeClass("hidden");
                $checkedFilterOptions
                    .children(".child-list")
                    .children("li")
                    .removeClass("hidden");
                const $filterOptionsWithChildListsWithAnyVisibleItems = $(".filter-option").has(".child-list > li:not(.hidden)");
                $filterOptionsWithChildListsWithAnyVisibleItems
                    .children(".filter-expand-hide")
                    .children(".on-closed")
                    .hide();
                $filterOptionsWithChildListsWithAnyVisibleItems
                    .children(".filter-expand-hide")
                    .children(".on-open")
                    .css({ display: "inline-block" });
                const $filterOptionsWithChildListsWithOnlyHiddenItems = $(".filter-option").filter(function (idx, $elm) {
                    const countHiddenElements = $($elm).find(".child-list > li.hidden").length;
                    const countAllListElements = $($elm).find(".child-list > li").length;
                    return countHiddenElements === countAllListElements;
                });
                $filterOptionsWithChildListsWithOnlyHiddenItems
                    .children(".filter-expand-hide")
                    .children(".on-closed")
                    .css({ display: "inline-block" });
                $filterOptionsWithChildListsWithOnlyHiddenItems
                    .children(".filter-expand-hide")
                    .children(".on-open")
                    .hide();
                $checkedFilterOptions.parents("li").removeClass("hidden");
                $checkedFilterOptions
                    .parents(".filter-option")
                    .removeClass("hidden");
            };
            $(document).ready(function () {
                window.defaultJobFilterLoadCallback(".search-filters-widget");
            });
            let placeSearch;
            const componentForm = {
                street_number: "short_name",
                route: "long_name",
                locality: "long_name",
                administrative_area_level_1: "short_name",
                country: "long_name",
                postal_code: "short_name",
            };
            function geolocate() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        const geolocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        const circle = new google.maps.Circle({
                            center: geolocation,
                            radius: position.coords.accuracy,
                        });
                        autocomplete.setBounds(circle.getBounds());
                    });
                }
            }
            $(document).click(function (event) {
                if (!$(event.target).parents("#supportchatwidget").length &&
                    !$(event.target).closest(".copoptions-select").length &&
                    !$(event.target).closest(".copoptions-input").length &&
                    !$(event.target).closest(".attrax-form-item--attrax-options")
                        .length) {
                    if ($(".copoptions-select").is(":visible")) {
                        $(".copoptions-select")
                            .closest(".open")
                            .removeClass("open");
                        $(".copoptions-select").hide();
                        $(".copoptions-input").prop("readonly", false);
                    }
                }
            });
            window.clearAllFilters = false;
            $(document).ready(function () {
                window.jobFilterNoReloadController.initialize();
                $(".option-display-list .filter-option > .filter-contents").on("change", "input", function () {
                    window.jobFilterNoReloadController.checkParentElem($(this));
                });
                $(document)
                    .off("click", ".optionfiltergroup h3")
                    .on("click", ".optionfiltergroup h3", function () {
                    const $groupParent = $(this).closest(".optionfiltergroup");
                    if (window.behaviourProperties.doJobFilterOpen) {
                        $groupParent
                            .siblings()
                            .find(".option-display-list")
                            .slideUp();
                    }
                    $groupParent.siblings().removeClass("category-opened");
                    $groupParent.toggleClass("category-opened");
                    if (window.behaviourProperties.doJobFilterOpen) {
                        $groupParent
                            .find(".option-display-list")
                            .slideToggle();
                    }
                });
                $("#single-click-job-alert").detach().appendTo("body");
                $(".xing-login-proxy").click(function (e) {
                    const $this = $(this);
                    if ($this.attr("data-from-candidate-home") == "true") {
                        window.isUserConnectingToXingManually = true;
                    }
                    if ($this.attr("data-from-application") == "true") {
                        window.isUserApplyingViaXing = true;
                    }
                    $("iframe").contents().find("#xing-login").click();
                    e.preventDefault();
                });
            });
        }
    }
    exports.LegacySiteJs = LegacySiteJs;
});
define("Handlers/ModalHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModalHandler = void 0;
    class ModalHandler {
        static Handle($) {
            $(document).on("keyup", function (e) {
                const key = e.key;
                if (key === "Escape") {
                    $(document).trigger("attrax.closemodal");
                }
            });
            $(document)
                .off("attrax.openmodal")
                .on("attrax.openmodal", function () {
                $(".attrax-popup-modal__overlay").addClass("attrax-popup-modal__overlay--visible");
                $(document.body).addClass("body--noscroll");
            });
            $(document)
                .off("attrax.closemodal")
                .on("attrax.closemodal", function () {
                $(".attrax-popup-modal__overlay").removeClass("attrax-popup-modal__overlay--visible");
                $(".attrax-popup-modal").addClass("attrax-popup-modal--hidden");
                $(document.body).removeClass("body--noscroll");
            });
            $(document)
                .off("click", "[data-attrax-role='Modal']")
                .on("click", "[data-attrax-role='Modal']", function () {
                const targetModalSelector = $(this).attr("data-attrax-target");
                const $targetModal = $(targetModalSelector);
                $targetModal.removeClass("attrax-popup-modal--hidden");
                $(document).trigger("attrax.openmodal");
            });
            var closeModalTargets = "" +
                ".attrax-job-alert-widget__btn-cancel, " +
                ".attrax-popup-modal__close-btn, .user-profile-send-message__btn-close, " +
                ".user-profile-send-cv__btn-close, " +
                ".user-profile-send-job-spec__btn-close, " +
                ".attrax-login-widget__btn-cancel, " +
                ".attraxdisplayjobalertwidget__btn-close, " +
                ".attrax-anonymize-candidate-widget__btn-cancel, " +
                ".attrax-candidate-info-widget__btn-close, " +
                ".attrax-social-hub-profile-widget__btn-cancel, " +
                ".attrax-social-hub-profile-widget__btn-cancel, " +
                ".attrax-application-thankyou-widget__btn-cancel";
            $(document)
                .off("click", closeModalTargets)
                .on("click", closeModalTargets, function () {
                $(document).trigger("attrax.closemodal");
            });
        }
    }
    exports.ModalHandler = ModalHandler;
});
define("Utility/StringUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isString = exports.StringUtils = void 0;
    class StringUtils {
        static IsNullOrWhitespace(input) {
            if (typeof input === 'undefined' || input == null)
                return true;
            return input.replace(/\s/g, '').length < 1;
        }
    }
    exports.StringUtils = StringUtils;
    const isString = (i) => {
        return typeof i === 'string';
    };
    exports.isString = isString;
});
define("Forms/AttraxFormSubmitOptions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttraxFormSubmitOptions = void 0;
    class AttraxFormSubmitOptions {
    }
    exports.AttraxFormSubmitOptions = AttraxFormSubmitOptions;
});
define("Handlers/FormValidationHandler", ["require", "exports", "ladda", "Utility/StringUtils", "Forms/AttraxFormSubmitOptions", "jqueryvalidate"], function (require, exports, Ladda, StringUtils_1, AttraxFormSubmitOptions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormValidationHandler = void 0;
    class FormValidationHandler {
        constructor(app) {
            this.app = app;
            this.validators = [];
        }
        GetValidationRulesAndMessages($form) {
            function ensurePropertyExists(name, objects) {
                for (let i = 0; i < objects.length; i++)
                    if (!objects[i][name])
                        objects[i][name] = {};
            }
            const results = {};
            const messages = {};
            $form
                .find(".attrax-form-item__input, .edit-post-alert__email:not(.hidden)")
                .each(function (idx, elm) {
                const $formItem = $(elm);
                const formItemNameOrId = $formItem.is("[name]")
                    ? $formItem.attr("name")
                    : $formItem.attr("id");
                let formItemLabel = $formItem
                    .siblings(".attrax-form-item__label")
                    .text()
                    .replace("*", "");
                if (StringUtils_1.StringUtils.IsNullOrWhitespace(formItemLabel))
                    formItemLabel = "";
                const dataRequired = $formItem.attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    results[formItemNameOrId]["normalizer"] = function (v) {
                        try {
                            if (!v) {
                                return v;
                            }
                            if (v.trim) {
                                return v.trim();
                            }
                            return v;
                        }
                        catch (e) {
                            return v;
                        }
                    };
                    messages[formItemNameOrId]["required"] =
                        "{0} is required, please complete.".replace("{0}", formItemLabel);
                }
                const maxLength = $formItem.attr("maxlength");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(maxLength) &&
                    typeof parseInt(maxLength) === "number") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["maxlength"] = maxLength;
                    messages[formItemNameOrId]["maxlength"] =
                        "{0}\u0027 is too long."
                            .replace("{0}", formItemLabel)
                            .replace("{1}", maxLength);
                }
                const dataRegex = $formItem.attr("data-regex");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRegex)) {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["regex"] = dataRegex;
                    messages[formItemNameOrId]["regex"] =
                        "{0}\u0027  format is invalid.".replace("{0}", formItemLabel);
                }
                const passwordPolicy = $formItem.attr("data-password-policy-target");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(passwordPolicy)) {
                    $formItem.on("input", () => {
                        $(passwordPolicy)
                            .find(".attrax-form-item__input")
                            .attr("checked", "");
                    });
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["passwordpolicy"] = true;
                    messages[formItemNameOrId]["passwordpolicy"] =
                        "The password policy has not been met".replace("{0}", formItemLabel);
                }
            });
            $form
                .find(".attrax-form-item--placeofresidence .place-of-residence__input--displayString, " +
                ".attrax-form-item--placeofresidence .place-of-residence__residence-list-manual-input, " +
                ".attrax-form-item--placeofresidence .place-of-residence__residence-list-manual-select, " +
                ".attrax-form-item--candidateeducation .candidate-education__school-location-input, " +
                ".attrax-form-item--candidateeducation .candidate-education__officelocation-list-manual-select, " +
                ".attrax-form-item--candidateeducation .candidate-education__officelocation-list-manual-input, " +
                ".attrax-form-item--candidateworkexperience .candidate-work-experience__officelocation-input, " +
                ".attrax-form-item--candidateworkexperience .candidate-work-experience__officelocation-list-manual-input, " +
                ".attrax-form-item--candidateworkexperience .candidate-work-experience__officelocation-list-manual-select")
                .each(function (idx, elm) {
                const $formItem = $(elm);
                const formItemNameOrId = $formItem.attr("name");
                const dataRequired = $formItem
                    .closest(".attrax-form-item")
                    .attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(formItemNameOrId)) {
                    const isRequired = (dataRequired && dataRequired.toLowerCase() === "true");
                    let formItemLabel = $formItem
                        .closest(".attrax-form-item")
                        .find(".attrax-form-item__label")
                        .text()
                        .replace("*", "");
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["autosuggestedlocation"] = true;
                    if (isRequired) {
                        messages[formItemNameOrId]["autosuggestedlocation"] =
                            "{0} is required, please complete.".replace("{0}", formItemLabel);
                    }
                    else {
                        messages[formItemNameOrId]["autosuggestedlocation"] = "";
                    }
                }
            });
            $form.find("[data-matchgroupname]").each(function (idx, elm) {
                const $formItem = $(elm);
                const formItemNameOrId = $formItem.attr("id");
                const isMatchGroup = $formItem.attr("data-matchgroupname");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(isMatchGroup)) {
                    const $othersInGroup = $form.find("[data-matchgroupname='" +
                        $formItem.attr("data-matchgroupname") +
                        "']");
                    if ($othersInGroup.length) {
                        $othersInGroup.on("input", function () {
                            const $this = $(this);
                            $othersInGroup.each(function (idx1, elm1) {
                                if ($this == $(elm1))
                                    return;
                                $(elm1).valid();
                            });
                        });
                        ensurePropertyExists(formItemNameOrId, [results, messages]);
                        results[formItemNameOrId]["mustmatchgroup"] = true;
                        messages[formItemNameOrId]["mustmatchgroup"] =
                            "__js.validationv3.emailgroupmustmatch__";
                    }
                }
            });
            $form
                .find(".attrax-form-item--optiondisplaylist")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("select[data-type='optiondisplaylist']");
                const formItemNameOrId = $formItem.is("[name]")
                    ? $formItem.attr("name")
                    : $formItem.attr("id");
                let formItemLabel = $formItem
                    .siblings(".attrax-form-item__label")
                    .text()
                    .replace("*", "");
                if (StringUtils_1.StringUtils.IsNullOrWhitespace(formItemLabel))
                    formItemLabel = "";
                const dataRequired = $formItem.attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "{0} is required, please complete.".replace("{0}", formItemLabel);
                }
            });
            $form
                .find(".attrax-form-item--attrax-options")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("input[data-type='optiondisplaylist']");
                const formItemNameOrId = $formItem.is("[name]")
                    ? $formItem.attr("name")
                    : $formItem.attr("id");
                let formItemLabel = $formItem
                    .siblings(".attrax-form-item__label")
                    .text()
                    .replace("*", "");
                if (StringUtils_1.StringUtils.IsNullOrWhitespace(formItemLabel))
                    formItemLabel = "";
                const dataRequired = $formItem.attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "{0} is required, please complete.".replace("{0}", formItemLabel);
                }
            });
            $form
                .find(".smartrecruiters-form-control--text, .smartrecruiters-form-control--textarea")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("input, textarea");
                const formItemNameOrId = $formItem.is("[name]")
                    ? $formItem.attr("name")
                    : $formItem.attr("id");
                const dataRequired = $(elm).attr("data-mandatory");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "__js.validation.smartrecruitersscreeningquestions.requiredfield__";
                }
            });
            $form
                .find(".smartrecruiters-form-control--radio")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("input");
                const formItemNameOrId = $formItem.attr("name");
                const dataRequired = $(elm).attr("data-mandatory");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "__js.validation.smartrecruitersscreeningquestions.requiredfield__";
                }
            });
            $form
                .find(".smartrecruiters-form-control--single-select")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("select");
                const formItemNameOrId = $formItem.attr("name");
                const dataRequired = $(elm).attr("data-mandatory");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "__js.validation.smartrecruitersscreeningquestions.requiredfield__";
                }
            });
            $form
                .find(".smartrecruiters-form-control--checkbox")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("input");
                const formItemNameOrId = $formItem.attr("name");
                const dataRequired = $(elm).attr("data-mandatory");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "__js.validation.smartrecruitersscreeningquestions.requiredfield__";
                }
            });
            $form
                .find(".smartrecruiters-form-control--multiselect")
                .each(function (idx, elm) {
                const $formItem = $(elm).find("select");
                const formItemNameOrId = $formItem.attr("name");
                const dataRequired = $(elm).attr("data-mandatory");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "__js.validation.smartrecruitersscreeningquestions.requiredfield__";
                }
            });
            $form.find(".attrax-form-item--consent").each(function (idx, elm) {
                const $formItem = $(elm);
                if ($formItem.find(".attrax-form-item__input").length) {
                    return;
                }
                const $inputElem = $formItem.find("input");
                const formItemNameOrId = $inputElem.is("[name]")
                    ? $inputElem.attr("name")
                    : $inputElem.attr("id");
                let formItemLabel = $inputElem.attr("data-label");
                if (StringUtils_1.StringUtils.IsNullOrWhitespace(formItemLabel))
                    formItemLabel = "";
                const dataRequired = $inputElem.attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] =
                        "Consent is required in order to continue.".replace("{0}", formItemLabel);
                }
            });
            $form
                .find(".attrax-form-item--fileupload .copformitem")
                .each(function (idx, elem) {
                const $formItem = $(elem);
                const formItemNameOrId = $formItem.is("[name]")
                    ? $formItem.attr("name")
                    : $formItem.attr("id");
                let resource = "A file is required, please upload.";
                if (resource.indexOf("DEFAULT") > -1)
                    resource = "{0} is required, please complete.";
                const dataRequired = $formItem.attr("data-required");
                if (!StringUtils_1.StringUtils.IsNullOrWhitespace(dataRequired) &&
                    dataRequired.toLowerCase() === "true") {
                    ensurePropertyExists(formItemNameOrId, [results, messages]);
                    results[formItemNameOrId]["required"] = true;
                    messages[formItemNameOrId]["required"] = resource.replace("{0}", "File");
                }
            });
            return [results, messages];
        }
        static CreateValidationMessage(message, target) {
            if (target !== null)
                return $(`<a class="attrax-validation__item" data-javascript-target='${target}' href='#/'>${message}</a>`);
            return $(`<p class="attrax-validation__item">${message}</p>`);
        }
        AddPasswordStrengthIndicators() {
            const $ = this.app.$;
            $("[data-attrax-role='PasswordStrengthIndicator']").each((idx, val) => {
                const $this = $(val);
                const $strengthTarget = $($this.attr("data-attrax-target"));
                const $strengthTargetFormItem = $this.closest(".attrax-form-item--password-strength-indicator");
                const minPasswordLength = +$this.attr("data-requires-min-length");
                const rules = {
                    requiresUpperCase: $this.hasClass("attrax-form-item__validation--requires-upper"),
                    requiresLowerCase: $this.hasClass("attrax-form-item__validation--requires-lower"),
                    requiresNonAlpha: $this.hasClass("attrax-form-item__validation-requires-non-alpha"),
                    requiresDigit: $this.hasClass("attrax-form-item__validation--requires-digit"),
                    requiresMinLength: $this.is("[data-requires-min-length]")
                        ? minPasswordLength
                        : false,
                };
                if (rules.requiresDigit)
                    $this.append("<div class='attrax-password-validation attrax-password-validation--requires-digit'>Your password requires a digit</div>");
                if (rules.requiresLowerCase)
                    $this.append("<div class='attrax-password-validation attrax-password-validation--requires-lower'>Your password requires a lowercase letter</div>");
                if (rules.requiresUpperCase)
                    $this.append("<div class='attrax-password-validation attrax-password-validation--requires-upper'>Your password requires an uppercase letter</div>");
                if (rules.requiresNonAlpha)
                    $this.append("<div class='attrax-password-validation attrax-password-validation--requires-non-alpha'>Your password requires a special symbol</div>");
                if (rules.requiresMinLength)
                    $this.append("<div class='attrax-password-validation attrax-password-validation--requires-min-length'>Requires minimum length.</div>");
                $strengthTarget.on("input", function () {
                    const val = $(this).val().toString();
                    $this
                        .find(".attrax-password-validation--requires-lower")
                        .removeClass("attrax-password-validation--success");
                    $this
                        .find(".attrax-password-validation--requires-upper")
                        .removeClass("attrax-password-validation--success");
                    $this
                        .find(".attrax-password-validation--requires-non-alpha")
                        .removeClass("attrax-password-validation--success");
                    $this
                        .find(".attrax-password-validation--requires-digit")
                        .removeClass("attrax-password-validation--success");
                    $this
                        .find(".attrax-password-validation--requires-min-length")
                        .removeClass("attrax-password-validation--success");
                    if (/[a-z]/.test(val))
                        $this
                            .find(".attrax-password-validation--requires-lower")
                            .addClass("attrax-password-validation--success");
                    if (/[A-Z]/.test(val))
                        $this
                            .find(".attrax-password-validation--requires-upper")
                            .addClass("attrax-password-validation--success");
                    if (/\W/.test(val))
                        $this
                            .find(".attrax-password-validation--requires-non-alpha")
                            .addClass("attrax-password-validation--success");
                    if (/[0-9]/.test(val))
                        $this
                            .find(".attrax-password-validation--requires-digit")
                            .addClass("attrax-password-validation--success");
                    if (val.length >= minPasswordLength)
                        $this
                            .find(".attrax-password-validation--requires-min-length")
                            .addClass("attrax-password-validation--success");
                    const isValid = $this
                        .find(".attrax-password-validation")
                        .not(".attrax-password-validation--success").length ===
                        0;
                    if (isValid)
                        $strengthTargetFormItem
                            .find(".attrax-form-item__input")
                            .attr("checked", "checked");
                    else
                        $strengthTargetFormItem
                            .find(".attrax-form-item__input")
                            .removeAttr("checked");
                });
            });
        }
        AddValidateOnSubmitHandler() {
            const self = this;
            const $ = self.app.$;
            const _formService = self.app.FormsService;
            self.AddValidateMethods();
            self.AddPasswordStrengthIndicators();
            const $forms = $(".attrax-form-widget, " +
                ".attrax-login-widget .login-widget-form-partial, " +
                ".attrax-login-widget .forgot-pass, " +
                ".attrax-registration-widget .attrax-registration-widget__form, " +
                ".attrax-registration-widget .attrax-registration-widget__user-info-form, " +
                ".attrax-workflow-widget .workflow-widget__content, " +
                ".attrax-job-application-widget, " +
                ".attrax-social-hub-profile-widget .attrax-popup-modal__inner, " +
                ".attrax-user-profile-contact-buttons-widget__sendmessage-modal, " +
                ".attrax-user-profile-contact-buttons-widget__sendcv-modal, " +
                ".attrax-user-profile-contact-buttons-widget__sendjobspec-modal, " +
                ".attrax-job-alert-widget .attrax-popup-modal__body, " +
                ".attrax-job-alert-signup-widget form, " +
                ".edit-post-alert, " +
                ".sr-apply-form");
            const $body = $("body");
            $body.on("select2:select select2:close", ".select2--in-place", function () {
                $(this).valid();
            });
            $forms.each(function (idx, val) {
                const $root = $(val);
                const $form = $root.is("form") ? $root : $root.find("form");
                if ($form.hasClass("form--standard-post-no-validate")) {
                    return;
                }
                let $formButton = $root.find("[data-attrax-role='FormSubmit']");
                if (!$formButton.length) {
                    const formId = $form.attr("id");
                    $formButton = $("[data-attrax-role='FormSubmit'][data-attrax-target='" +
                        formId +
                        "']");
                }
                const $formValidationSummary = $form.find(".attrax-validations");
                const rulesAndMessagesTuple = self.GetValidationRulesAndMessages($form);
                $form.removeData("unobtrusiveValidation");
                $form.removeData("validator");
                $formButton.on("click", function (e) {
                    const $button = $(this);
                    if (!$form.hasClass("form--validation-default")) {
                        $button.attr('disabled', 'disabled');
                    }
                    if (!$form.hasClass("form--standard-post")) {
                        e.preventDefault();
                        $form.submit();
                    }
                });
                const formValidator = $form.validate({
                    ignore: ".candidate-work-experience__title-input:hidden, .candidate-work-experience__from-input:hidden, .candidate-work-experience__to-input:hidden," +
                        ".candidate-education__institution-input:hidden, .candidate-education__degree-input:hidden, .candidate-education__major-input:hidden",
                    rules: rulesAndMessagesTuple[0],
                    messages: rulesAndMessagesTuple[1],
                    errorClass: "attrax-form-item--error",
                    validClass: "attrax-form-item--valid",
                    errorPlacement: function (error, element) {
                        const $element = $(element);
                        const $error = $(error);
                        $error.addClass("attrax-form-item__validation-error");
                        const $srFieldset = $element.closest(".smartrecruiters-radio__fieldset");
                        const isSmartRadioButton = $srFieldset.length;
                        if (isSmartRadioButton) {
                            $srFieldset.append(error);
                            return;
                        }
                        const $autosuggest = $element.closest(".attrax-autosuggest");
                        const isAutosuggest = $autosuggest.length;
                        if (isAutosuggest) {
                            $autosuggest.find(".attrax-form-item__validation-error").remove();
                            $autosuggest.append(error);
                            return;
                        }
                        $element.parent().append(error);
                    },
                    onkeyup: false,
                    onfocusout: function (element) {
                        if (element) {
                            const ignoredClasses = [
                                "select2--in-place",
                                "place-of-residence__input--displayString",
                                "manual-select",
                                "candidate-work-experience__officelocation-input",
                                "candidate-education__school-location-input"
                            ];
                            for (let i = 0; i < ignoredClasses.length; i++) {
                                if (element.classList.contains(ignoredClasses[i])) {
                                    return;
                                }
                            }
                        }
                        this.element(element);
                        if (!$form.hasClass("form--validation-default") && this.valid()) {
                            $formButton.removeAttr('disabled');
                        }
                    },
                    invalidHandler: function (event, validator) {
                        if (!$form.hasClass("form--validation-default")) {
                            $formButton.removeAttr('disabled');
                        }
                        Ladda.stopAll();
                        $formValidationSummary.empty();
                        $.each(validator.errorList, function (idx, elm) {
                            const targetId = elm.element.id;
                            const validationTarget = `${$form.attr("id")} ${targetId}`;
                            const $validationLink = FormValidationHandler.CreateValidationMessage(elm.message, validationTarget);
                            $validationLink.on("click", function () {
                                $(elm.element).focus();
                            });
                            $formValidationSummary.append($validationLink);
                            $(elm.element).one("change", function () {
                                $("[data-javascript-target='" +
                                    validationTarget +
                                    "']").remove();
                            });
                        });
                    },
                    submitHandler: function (f) {
                        if ($form.hasClass("form--validation-default")) {
                            return true;
                        }
                        if ($form.hasClass("form--validation-ignore")) {
                            return;
                        }
                        if ($form.hasClass("form--validation-submit")) {
                            return;
                        }
                        if ($form.hasClass("form--workflow-submit")) {
                            const button = $form.find(".btn");
                            window.SubmitWorkflowForm($form, button[0]);
                            return;
                        }
                        const formSubmitOptions = new AttraxFormSubmitOptions_1.AttraxFormSubmitOptions();
                        formSubmitOptions.FormElement = $form;
                        formSubmitOptions.Button = $formButton;
                        formSubmitOptions.RequestVerificationToken = $form
                            .find("[name='__RequestVerificationToken']")
                            .val()
                            .toString();
                        _formService.SubmitForm(formSubmitOptions);
                    },
                });
                if (!$form.hasClass("form--validation-default")) {
                    $form.on('input change', function () {
                        if (formValidator.valid()) {
                            $formButton.removeAttr('disabled');
                        }
                    });
                }
                self.validators.push({
                    form: $form,
                    validator: formValidator,
                });
                $form.data("attrax-validator", formValidator);
            });
        }
        AddValidateMethods() {
            const $ = this.app.$;
            $.validator.addMethod("regex", function (value, element, regexp) {
                const re = new RegExp(regexp);
                return this.optional(element) || re.test(value);
            });
            $.validator.addMethod("passwordpolicy", function (value, element, isPasswordPolicy) {
                if (!isPasswordPolicy)
                    return true;
                const $passwordPolicyChecker = $($(element).attr("data-password-policy-target"));
                const isPasswordPolicyMet = $passwordPolicyChecker
                    .closest(".attrax-form-item--password-strength-indicator")
                    .find(".attrax-form-item__input")
                    .attr("checked") === "checked";
                return this.optional(element) || isPasswordPolicyMet;
            });
            $.validator.addMethod("mustmatchgroup", function (value, element, isMatchGroup) {
                if (!isMatchGroup)
                    return true;
                const $el = $(element);
                const $form = $el.closest("form");
                const groupName = $el.attr("data-matchgroupname");
                const $others = $form.find("[data-matchgroupname='" + groupName + "']");
                if ($others.length < 2) {
                    return true;
                }
                const values = [];
                $others.each(function () {
                    values.push($(this).val());
                });
                return values.every((v, i, arr) => v == arr[0]);
            });
            $.validator.addMethod("autosuggestedlocation", function (value, element, isMatchGroup) {
                if (!isMatchGroup)
                    return true;
                const $el = $(element).closest(".attrax-autosuggest");
                const method = $el.attr("data-method");
                const $display = $el.find(".attrax-autosuggest__displayString");
                const dataRequired = $el
                    .closest(".attrax-form-item")
                    .attr("data-required");
                const isRequired = dataRequired && dataRequired.toLowerCase() !== "true";
                if (!dataRequired || isRequired) {
                    const isDisplayStringEmpty = $display.val() === "";
                    if (isDisplayStringEmpty) {
                        return true;
                    }
                }
                if (method === "autocomplete") {
                    const entries = $el.find(".attrax-autosuggest__selected-item");
                    const filteredEntries = entries.filter((index, entry) => entry.value !== "");
                    return filteredEntries.length > 0;
                }
                if (method === "manual") {
                    let entries = $el
                        .find(".attrax-autosuggest__manual-input")
                        .filter((index, entry) => entry.value !== "");
                    const select = $el.find(".attrax-autosuggest__manual-select");
                    const $selectedOption = $(select).find("option:selected");
                    if ($selectedOption.is(":first-child")) {
                        return false;
                    }
                    return entries.length > 0;
                }
                return true;
            });
        }
    }
    exports.FormValidationHandler = FormValidationHandler;
});
define("Handlers/CopOptionsV2Handler", ["require", "exports", "jqueryvalidate"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CopOptionsV2Handler = void 0;
    class CopOptionsV2Handler {
        constructor(app) {
            this.app = app;
        }
    }
    exports.CopOptionsV2Handler = CopOptionsV2Handler;
});
define("Utility/SmartRecruiterCountries", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmartRecruitersCountries = void 0;
    exports.SmartRecruitersCountries = [
        {
            country: "Afghanistan",
            countryCode: "AF",
        },
        {
            country: "Åland Islands",
            countryCode: "AX",
        },
        {
            country: "Albania",
            countryCode: "AL",
        },
        {
            country: "Algeria",
            countryCode: "DZ",
        },
        {
            country: "American Samoa",
            countryCode: "AS",
        },
        {
            country: "Andorra",
            countryCode: "AD",
        },
        {
            country: "Angola",
            countryCode: "AO",
        },
        {
            country: "Anguilla",
            countryCode: "AI",
        },
        {
            country: "Antarctica",
            countryCode: "AQ",
        },
        {
            country: "Antigua and Barbuda",
            countryCode: "AG",
        },
        {
            country: "Argentina",
            countryCode: "AR",
        },
        {
            country: "Armenia",
            countryCode: "AM",
        },
        {
            country: "Aruba",
            countryCode: "AW",
        },
        {
            country: "Ascension Island",
            countryCode: "AC",
        },
        {
            country: "Australia",
            countryCode: "AU",
        },
        {
            country: "Austria",
            countryCode: "AT",
        },
        {
            country: "Azerbaijan",
            countryCode: "AZ",
        },
        {
            country: "Bahamas",
            countryCode: "BS",
        },
        {
            country: "Bahrain",
            countryCode: "BH",
        },
        {
            country: "Bangladesh",
            countryCode: "BD",
        },
        {
            country: "Barbados",
            countryCode: "BB",
        },
        {
            country: "Belarus",
            countryCode: "BY",
        },
        {
            country: "Belgium",
            countryCode: "BE",
        },
        {
            country: "Belize",
            countryCode: "BZ",
        },
        {
            country: "Benin",
            countryCode: "BJ",
        },
        {
            country: "Bermuda",
            countryCode: "BM",
        },
        {
            country: "Bhutan",
            countryCode: "BT",
        },
        {
            country: "Bolivia",
            countryCode: "BO",
        },
        {
            country: "Bosnia and Herzegovina",
            countryCode: "BA",
        },
        {
            country: "Botswana",
            countryCode: "BW",
        },
        {
            country: "Bouvet Island",
            countryCode: "BV",
        },
        {
            country: "Brazil",
            countryCode: "BR",
        },
        {
            country: "British Indian Ocean Territory",
            countryCode: "IO",
        },
        {
            country: "Brunei Darussalam",
            countryCode: "BN",
        },
        {
            country: "Bulgaria",
            countryCode: "BG",
        },
        {
            country: "Burkina Faso",
            countryCode: "BF",
        },
        {
            country: "Burundi",
            countryCode: "BI",
        },
        {
            country: "Cambodia",
            countryCode: "KH",
        },
        {
            country: "Cameroon",
            countryCode: "CM",
        },
        {
            country: "Canada",
            countryCode: "CA",
        },
        {
            country: "Cape Verde",
            countryCode: "CV",
        },
        {
            country: "Caribbean Netherlands",
            countryCode: "BQ",
        },
        {
            country: "Cayman Islands (the)",
            countryCode: "KY",
        },
        {
            country: "Central African Republic",
            countryCode: "CF",
        },
        {
            country: "Chad",
            countryCode: "TD",
        },
        {
            country: "Chile",
            countryCode: "CL",
        },
        {
            country: "China",
            countryCode: "CN",
        },
        {
            country: "Christmas Island",
            countryCode: "CX",
        },
        {
            country: "Cocos (Keeling) Islands",
            countryCode: "CC",
        },
        {
            country: "Colombia",
            countryCode: "CO",
        },
        {
            country: "Comoros",
            countryCode: "KM",
        },
        {
            country: "Congo - Brazzaville",
            countryCode: "CG",
        },
        {
            country: "Congo - Kinshasa",
            countryCode: "CD",
        },
        {
            country: "Cook Islands",
            countryCode: "CK",
        },
        {
            country: "Costa Rica",
            countryCode: "CR",
        },
        {
            country: "Côte d'Ivoire",
            countryCode: "CI",
        },
        {
            country: "Croatia",
            countryCode: "HR",
        },
        {
            country: "Cuba",
            countryCode: "CU",
        },
        {
            country: "Curaçao",
            countryCode: "CW",
        },
        {
            country: "Cyprus",
            countryCode: "CY",
        },
        {
            country: "Czech Republic",
            countryCode: "CZ",
        },
        {
            country: "Denmark",
            countryCode: "DK",
        },
        {
            country: "Diego Garcia",
            countryCode: "DG",
        },
        {
            country: "Djibouti",
            countryCode: "DJ",
        },
        {
            country: "Dominica",
            countryCode: "DM",
        },
        {
            country: "Dominican Republic",
            countryCode: "DO",
        },
        {
            country: "Ecuador",
            countryCode: "EC",
        },
        {
            country: "Egypt",
            countryCode: "EG",
        },
        {
            country: "El Salvador",
            countryCode: "SV",
        },
        {
            country: "Equatorial Guinea",
            countryCode: "GQ",
        },
        {
            country: "Eritrea",
            countryCode: "ER",
        },
        {
            country: "Estonia",
            countryCode: "EE",
        },
        {
            country: "Ethiopia",
            countryCode: "ET",
        },
        {
            country: "Falkland Islands",
            countryCode: "FK",
        },
        {
            country: "Faroe Islands",
            countryCode: "FO",
        },
        {
            country: "Fiji",
            countryCode: "FJ",
        },
        {
            country: "Finland",
            countryCode: "FI",
        },
        {
            country: "France",
            countryCode: "FR",
        },
        {
            country: "French Guiana",
            countryCode: "GF",
        },
        {
            country: "French Polynesia",
            countryCode: "PF",
        },
        {
            country: "French Southern Territories",
            countryCode: "TF",
        },
        {
            country: "Gabon",
            countryCode: "GA",
        },
        {
            country: "Gambia",
            countryCode: "GM",
        },
        {
            country: "Georgia",
            countryCode: "GE",
        },
        {
            country: "Germany",
            countryCode: "DE",
        },
        {
            country: "Ghana",
            countryCode: "GH",
        },
        {
            country: "Gibraltar",
            countryCode: "GI",
        },
        {
            country: "Greece",
            countryCode: "GR",
        },
        {
            country: "Greenland",
            countryCode: "GL",
        },
        {
            country: "Grenada",
            countryCode: "GD",
        },
        {
            country: "Guadeloupe",
            countryCode: "GP",
        },
        {
            country: "Guam",
            countryCode: "GU",
        },
        {
            country: "Guatemala",
            countryCode: "GT",
        },
        {
            country: "Guernsey",
            countryCode: "GG",
        },
        {
            country: "Guinea",
            countryCode: "GN",
        },
        {
            country: "Guinea-Bissau",
            countryCode: "GW",
        },
        {
            country: "Guyana",
            countryCode: "GY",
        },
        {
            country: "Haiti",
            countryCode: "HT",
        },
        {
            country: "Heard Island and McDonald Islands",
            countryCode: "HM",
        },
        {
            country: "Honduras",
            countryCode: "HN",
        },
        {
            country: "Hong Kong",
            countryCode: "HK",
        },
        {
            country: "Hungary",
            countryCode: "HU",
        },
        {
            country: "Iceland",
            countryCode: "IS",
        },
        {
            country: "India",
            countryCode: "IN",
        },
        {
            country: "Indonesia",
            countryCode: "ID",
        },
        {
            country: "Iran",
            countryCode: "IR",
        },
        {
            country: "Iraq",
            countryCode: "IQ",
        },
        {
            country: "Ireland",
            countryCode: "IE",
        },
        {
            country: "Isle of Man",
            countryCode: "IM",
        },
        {
            country: "Israel",
            countryCode: "IL",
        },
        {
            country: "Italy",
            countryCode: "IT",
        },
        {
            country: "Jamaica",
            countryCode: "JM",
        },
        {
            country: "Japan",
            countryCode: "JP",
        },
        {
            country: "Jersey",
            countryCode: "JE",
        },
        {
            country: "Jordan",
            countryCode: "JO",
        },
        {
            country: "Kazakhstan",
            countryCode: "KZ",
        },
        {
            country: "Kenya",
            countryCode: "KE",
        },
        {
            country: "Kiribati",
            countryCode: "KI",
        },
        {
            country: "Kosovo",
            countryCode: "XK",
        },
        {
            country: "Kuwait",
            countryCode: "KW",
        },
        {
            country: "Kyrgyzstan",
            countryCode: "KG",
        },
        {
            country: "Laos",
            countryCode: "LA",
        },
        {
            country: "Latvia",
            countryCode: "LV",
        },
        {
            country: "Lebanon",
            countryCode: "LB",
        },
        {
            country: "Lesotho",
            countryCode: "LS",
        },
        {
            country: "Liberia",
            countryCode: "LR",
        },
        {
            country: "Libya",
            countryCode: "LY",
        },
        {
            country: "Liechtenstein",
            countryCode: "LI",
        },
        {
            country: "Lithuania",
            countryCode: "LT",
        },
        {
            country: "Luxembourg",
            countryCode: "LU",
        },
        {
            country: "Macao",
            countryCode: "MO",
        },
        {
            country: "Macedonia",
            countryCode: "MK",
        },
        {
            country: "Madagascar",
            countryCode: "MG",
        },
        {
            country: "Malawi",
            countryCode: "MW",
        },
        {
            country: "Malaysia",
            countryCode: "MY",
        },
        {
            country: "Maldives",
            countryCode: "MV",
        },
        {
            country: "Mali",
            countryCode: "ML",
        },
        {
            country: "Malta",
            countryCode: "MT",
        },
        {
            country: "Marshall Islands (the)",
            countryCode: "MH",
        },
        {
            country: "Martinique",
            countryCode: "MQ",
        },
        {
            country: "Mauritania",
            countryCode: "MR",
        },
        {
            country: "Mauritius",
            countryCode: "MU",
        },
        {
            country: "Mayotte",
            countryCode: "YT",
        },
        {
            country: "Mexico",
            countryCode: "MX",
        },
        {
            country: "Micronesia",
            countryCode: "FM",
        },
        {
            country: "Moldova",
            countryCode: "MD",
        },
        {
            country: "Monaco",
            countryCode: "MC",
        },
        {
            country: "Mongolia",
            countryCode: "MN",
        },
        {
            country: "Montenegro",
            countryCode: "ME",
        },
        {
            country: "Montserrat",
            countryCode: "MS",
        },
        {
            country: "Morocco",
            countryCode: "MA",
        },
        {
            country: "Mozambique",
            countryCode: "MZ",
        },
        {
            country: "Myanmar (Burma)",
            countryCode: "MM",
        },
        {
            country: "Namibia",
            countryCode: "NA",
        },
        {
            country: "Nauru",
            countryCode: "NR",
        },
        {
            country: "Nepal",
            countryCode: "NP",
        },
        {
            country: "Netherlands",
            countryCode: "NL",
        },
        {
            country: "New Caledonia",
            countryCode: "NC",
        },
        {
            country: "New Zealand",
            countryCode: "NZ",
        },
        {
            country: "Nicaragua",
            countryCode: "NI",
        },
        {
            country: "Nigeria",
            countryCode: "NE",
        },
        {
            country: "Nigeria",
            countryCode: "NG",
        },
        {
            country: "Niue",
            countryCode: "NU",
        },
        {
            country: "Norfolk Island",
            countryCode: "NF",
        },
        {
            country: "North Korea",
            countryCode: "KP",
        },
        {
            country: "Northern Mariana Islands",
            countryCode: "MP",
        },
        {
            country: "Norway",
            countryCode: "NO",
        },
        {
            country: "Oman",
            countryCode: "OM",
        },
        {
            country: "Pakistan",
            countryCode: "PK",
        },
        {
            country: "Palau",
            countryCode: "PW",
        },
        {
            country: "Palestinian Territories",
            countryCode: "PS",
        },
        {
            country: "Panama",
            countryCode: "PA",
        },
        {
            country: "Papua New Guinea",
            countryCode: "PG",
        },
        {
            country: "Paraguay",
            countryCode: "PY",
        },
        {
            country: "Peru",
            countryCode: "PE",
        },
        {
            country: "Philippines",
            countryCode: "PH",
        },
        {
            country: "Pitcairn Islands",
            countryCode: "PN",
        },
        {
            country: "Poland",
            countryCode: "PL",
        },
        {
            country: "Portugal",
            countryCode: "PT",
        },
        {
            country: "Puerto Rico",
            countryCode: "PR",
        },
        {
            country: "Qatar",
            countryCode: "QA",
        },
        {
            country: "Réunion",
            countryCode: "RE",
        },
        {
            country: "Romania",
            countryCode: "RO",
        },
        {
            country: "Russia",
            countryCode: "RU",
        },
        {
            country: "Rwanda",
            countryCode: "RW",
        },
        {
            country: "Saint Barthélemy",
            countryCode: "BL",
        },
        {
            country: "Saint Helena",
            countryCode: "SH",
        },
        {
            country: "Saint Kitts and Nevis",
            countryCode: "KN",
        },
        {
            country: "Saint Lucia",
            countryCode: "LC",
        },
        {
            country: "Saint Martin",
            countryCode: "MF",
        },
        {
            country: "Saint Pierre and Miquelon",
            countryCode: "PM",
        },
        {
            country: "Saint Vincent and the Grenadines",
            countryCode: "VC",
        },
        {
            country: "Samoa",
            countryCode: "WS",
        },
        {
            country: "San Marino",
            countryCode: "SM",
        },
        {
            country: "São Tomé and Príncipe",
            countryCode: "ST",
        },
        {
            country: "Saudi Arabia",
            countryCode: "SA",
        },
        {
            country: "Senegal",
            countryCode: "SN",
        },
        {
            country: "Serbia",
            countryCode: "RS",
        },
        {
            country: "Seychelles",
            countryCode: "SC",
        },
        {
            country: "Sierra Leone",
            countryCode: "SL",
        },
        {
            country: "Singapore",
            countryCode: "SG",
        },
        {
            country: "Sint Maarten",
            countryCode: "SX",
        },
        {
            country: "Slovakia",
            countryCode: "SK",
        },
        {
            country: "Slovenia",
            countryCode: "SI",
        },
        {
            country: "Solomon Islands",
            countryCode: "SB",
        },
        {
            country: "Somalia",
            countryCode: "SO",
        },
        {
            country: "South Africa",
            countryCode: "ZA",
        },
        {
            country: "South Georgia and the South Sandwich Islands",
            countryCode: "GS",
        },
        {
            country: "South Korea",
            countryCode: "KR",
        },
        {
            country: "South Sudan",
            countryCode: "SS",
        },
        {
            country: "Spain",
            countryCode: "ES",
        },
        {
            country: "Sri Lanka",
            countryCode: "LK",
        },
        {
            country: "Sudan",
            countryCode: "SD",
        },
        {
            country: "Suriname",
            countryCode: "SR",
        },
        {
            country: "Svalbard and Jan Mayen",
            countryCode: "SJ",
        },
        {
            country: "Swaziland",
            countryCode: "SZ",
        },
        {
            country: "Sweden",
            countryCode: "SE",
        },
        {
            country: "Switzerland",
            countryCode: "CH",
        },
        {
            country: "Syria",
            countryCode: "SY",
        },
        {
            country: "Taiwan",
            countryCode: "TW",
        },
        {
            country: "Tajikistan",
            countryCode: "TJ",
        },
        {
            country: "Tanzania",
            countryCode: "TZ",
        },
        {
            country: "Thailand",
            countryCode: "TH",
        },
        {
            country: "Timor-Leste",
            countryCode: "TL",
        },
        {
            country: "Togo",
            countryCode: "TG",
        },
        {
            country: "Tokelau",
            countryCode: "TK",
        },
        {
            country: "Tonga",
            countryCode: "TO",
        },
        {
            country: "Trinidad and Tobago",
            countryCode: "TT",
        },
        {
            country: "Tristan da Cunha",
            countryCode: "TA",
        },
        {
            country: "Tunisia",
            countryCode: "TN",
        },
        {
            country: "Turkey",
            countryCode: "TR",
        },
        {
            country: "Turkmenistan",
            countryCode: "TM",
        },
        {
            country: "Turks and Caicos Islands (the)",
            countryCode: "TC",
        },
        {
            country: "Tuvalu",
            countryCode: "TV",
        },
        {
            country: "Uganda",
            countryCode: "UG",
        },
        {
            country: "Ukraine",
            countryCode: "UA",
        },
        {
            country: "United Arab Emirates",
            countryCode: "AE",
        },
        {
            country: "United Kingdom",
            countryCode: "GB",
        },
        {
            country: "United States of America",
            countryCode: "US",
        },
        {
            country: "United States Outlying Islands",
            countryCode: "UM",
        },
        {
            country: "Uruguay",
            countryCode: "UY",
        },
        {
            country: "Uzbekistan",
            countryCode: "UZ",
        },
        {
            country: "Vanuatu",
            countryCode: "VU",
        },
        {
            country: "Vatican City",
            countryCode: "VA",
        },
        {
            country: "Venezuela",
            countryCode: "VE",
        },
        {
            country: "Vietnam",
            countryCode: "VN",
        },
        {
            country: "Virgin Islands (British)",
            countryCode: "VG",
        },
        {
            country: "Virgin Islands (U.S.)",
            countryCode: "VI",
        },
        {
            country: "Wallis and Futuna",
            countryCode: "WF",
        },
        {
            country: "Western Sahara",
            countryCode: "EH",
        },
        {
            country: "Yemen",
            countryCode: "YE",
        },
        {
            country: "Zambia",
            countryCode: "ZM",
        },
        {
            country: "Zimbabwe",
            countryCode: "ZW",
        },
    ];
});
define("Forms/FormsService", ["require", "exports", "Handlers/FormValidationHandler", "Utility/SmartRecruiterCountries", "Utility/Configuration", "Utility/Antiforgery"], function (require, exports, FormValidationHandler_1, SmartRecruiterCountries_1, Configuration_2, Antiforgery_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormsService = exports.createLocationJsonData = exports.isEducationField = void 0;
    const disableFormButtonDuringFormSubmit = Configuration_2.default.DisableFormButtonDuringSubmission === "true";
    function isEducationField(typ) {
        return typ === "candidateeducation";
    }
    exports.isEducationField = isEducationField;
    function createLocationJsonData(officelocation, manualLocation, countryCode) {
        let locationDetails = null;
        if (officelocation && officelocation.toString().trim() !== "") {
            locationDetails = officelocation.toString().trim();
        }
        else if (manualLocation && manualLocation.toString().trim() !== "") {
            locationDetails = manualLocation.toString().trim();
            if (countryCode && countryCode.toString().trim() !== "") {
                locationDetails += ", " + countryCode;
            }
        }
        return locationDetails;
    }
    exports.createLocationJsonData = createLocationJsonData;
    class FormsService {
        constructor(app) {
            this.getCountryCode = (country) => {
                const countriesList = SmartRecruiterCountries_1.SmartRecruitersCountries;
                let countryCode;
                countriesList.forEach((item) => {
                    if (item.country === country) {
                        countryCode = item.countryCode;
                    }
                });
                return countryCode;
            };
            this.app = app;
        }
        AddLabelClickHandlers() {
            const $ = this.app.$;
            $("label[data-for]").each(function (idx, val) {
                const $label = $(val);
                $label.on("click", function (e) {
                    e.preventDefault();
                    const $inputSibling = $label.siblings("#" + $label.attr("data-for"));
                    $inputSibling.focus();
                    if ($inputSibling.is("[type=checkbox]"))
                        $inputSibling.click();
                });
            });
        }
        SubmitForm(formSubmitOptions) {
            if (!formSubmitOptions.FormElement.valid()) {
                return;
            }
            try {
                if (disableFormButtonDuringFormSubmit && (formSubmitOptions === null || formSubmitOptions === void 0 ? void 0 : formSubmitOptions.Button)) {
                    formSubmitOptions.Button.addClass("attrax-button--loading");
                    formSubmitOptions.Button.attr("disabled", "disabled");
                }
                const jsonData = this.GetJsonDataForForm(formSubmitOptions.FormElement);
                const isPaqEnabled = window.paqEnabled;
                const isCopernicusForm = formSubmitOptions.FormElement.attr("data-cop-form") &&
                    formSubmitOptions.FormElement.attr("data-cop-form").toLowerCase() === "true";
                const formAction = isCopernicusForm
                    ? formSubmitOptions.FormElement.attr("action")
                    : "";
                window.fireRecaptchaVerify("FormWidgetSubmit", () => {
                    if (isPaqEnabled && window._paq) {
                        try {
                            const paqFormId = formSubmitOptions.FormElement.attr("id");
                            window._paq.push([
                                "trackEvent",
                                "Form",
                                "Submit form",
                                paqFormId,
                            ]);
                        }
                        catch (e) {
                        }
                    }
                    this.PostForm(isCopernicusForm, window.recaptchaToken, formSubmitOptions.RequestVerificationToken, jsonData, formAction, formSubmitOptions.FormElement).done((data) => {
                        if (data && data.formErrors) {
                            const $formValidationContainer = formSubmitOptions.FormElement.find(".attrax-validation-summary");
                            for (let i = 0; i < data.formErrors.length; i++) {
                                const $formErrorValidation = FormValidationHandler_1.FormValidationHandler.CreateValidationMessage(data.formErrors[i], null);
                                $formValidationContainer.append($formErrorValidation);
                            }
                        }
                        if (formSubmitOptions && formSubmitOptions.FormElement) {
                            formSubmitOptions.FormElement.trigger("attrax-form-ajax-complete");
                        }
                    })
                        .always(() => {
                        setTimeout(() => {
                            if (disableFormButtonDuringFormSubmit && (formSubmitOptions === null || formSubmitOptions === void 0 ? void 0 : formSubmitOptions.Button)) {
                                formSubmitOptions.Button.removeClass("attrax-button--loading");
                                formSubmitOptions.Button.removeAttr("disabled");
                            }
                        }, 2000);
                    });
                });
            }
            catch (e) {
                if (disableFormButtonDuringFormSubmit && (formSubmitOptions === null || formSubmitOptions === void 0 ? void 0 : formSubmitOptions.Button)) {
                    formSubmitOptions.Button.removeClass("attrax-button--loading");
                    formSubmitOptions.Button.removeAttr("disabled");
                }
            }
        }
        AddWidgetHandlers() {
            const $ = this.app.$;
            $(".attrax-login-widget__btn-login").on("click", function () {
                $(this)
                    .closest(".attrax-login-widget")
                    .find(".attrax-login-widget__form")
                    .submit();
            });
            $(".attrax-search-widget__search-button").click(function (e) {
                window.jobsearchsubmit(e);
            });
        }
        GetJsonDataForForm($form) {
            const jsonData = [];
            $form
                .find(".attrax-form-item__input, " +
                ".attrax-form-item__hidden, " +
                "[data-type='fileupload'], " +
                "[data-type='cvfile'], " +
                "[data-type='consentpolicy'], " +
                "[data-type='candidateworkexperience'], " +
                "[data-type='candidateeducation']," +
                "[data-type='placeofresidence']," +
                "[data-type='optiondisplaylist']")
                .each((idx, elm) => {
                const $formItem = $(elm);
                const optionsData = [];
                const fieldId = $formItem.attr("data-id");
                const fieldName = $formItem.attr("data-entityfieldname");
                const fieldObjectId = $formItem.attr("data-objectid");
                const fieldDataLabel = $formItem.attr("data-label");
                const fieldDataType = $formItem.attr("data-type");
                const fieldType = $formItem.attr("type");
                const isOptionDisplayList = $formItem.hasClass("attrax-form-item--optiondisplay");
                const isSelect = $formItem.is("select");
                if (isOptionDisplayList || isSelect) {
                    const formItemValue = $formItem.val();
                    if ($.isArray(formItemValue)) {
                        for (let i = 0; i < formItemValue.length; i++) {
                            const optionIdAsInt = parseInt(formItemValue[i]);
                            if (!isNaN(optionIdAsInt) && optionIdAsInt !== -1) {
                                optionsData.push(optionIdAsInt);
                            }
                        }
                    }
                    else {
                        const optionIdAsInt = parseInt(formItemValue.toString());
                        if (!isNaN(optionIdAsInt) && optionIdAsInt !== -1)
                            optionsData.push(optionIdAsInt);
                    }
                    jsonData.push({
                        id: fieldId,
                        fieldid: fieldId,
                        fieldname: fieldName,
                        objectid: fieldObjectId,
                        type: fieldDataType,
                        label: fieldDataLabel,
                        options: optionsData,
                    });
                }
                else {
                    const isFile = $formItem.hasClass("file");
                    const isFileUpload = fieldDataType === "fileupload";
                    const isConsentPolicy = fieldDataType === "consentpolicy";
                    const isWorkExperience = fieldDataType === "candidateworkexperience";
                    const isEducation = isEducationField(fieldDataType);
                    const isPlaceofresidence = fieldDataType === "placeofresidence";
                    const isCheckbox = fieldType === "checkbox";
                    let itemValue = "";
                    let workexp = [];
                    let education = [];
                    let placeofresidence = {};
                    if (isFile) {
                        itemValue = $formItem.attr("data-fileid");
                    }
                    else if (isFileUpload) {
                        itemValue = $formItem.val();
                    }
                    else if (isConsentPolicy || isCheckbox) {
                        itemValue = $formItem.is(":checked");
                    }
                    else if (isWorkExperience) {
                        const entries = $formItem.find(".candidate-work-experience__entry");
                        entries.each((index, element) => {
                            const $el = $(element);
                            if ($el.is(":hidden")) {
                                return;
                            }
                            const title = $el
                                .find(".candidate-work-experience__title-input")
                                .val();
                            const companyname = $el
                                .find(".candidate-work-experience__companyname-input")
                                .val();
                            const officelocation = $el
                                .find(".candidate-work-experience__officelocation-input")
                                .val();
                            const description = $el
                                .find(".candidate-work-experience__description-input")
                                .val();
                            const from = $el
                                .find(".candidate-work-experience__from-input")
                                .val();
                            const to = $el
                                .find(".candidate-work-experience__to-input")
                                .val();
                            const currentlyworkhere = $el
                                .find(".candidate-work-experience__currentlyworkhere-input")
                                .is(":checked");
                            const manualConutry = $el
                                .find(".candidate-work-experience__officelocation-list-manual-select")
                                .val();
                            const manualLocation = $el
                                .find(".candidate-work-experience__officelocation-list-manual-input")
                                .val();
                            let countryCode;
                            if (manualConutry) {
                                const toString = manualConutry.toString();
                                countryCode = this.getCountryCode(toString);
                            }
                            const locationDetails = createLocationJsonData(officelocation, manualLocation, countryCode);
                            const item = {
                                title: title,
                                companyname: companyname,
                                roledescription: description,
                                from: from,
                                to: to,
                                icurrentlyworkhere: currentlyworkhere,
                            };
                            if (locationDetails) {
                                item["officelocation"] = locationDetails;
                            }
                            workexp.push(item);
                        });
                    }
                    else if (isEducation) {
                        const entries = $formItem.find(".candidate-education__entry");
                        entries.each((index, element) => {
                            const $el = $(element);
                            if ($el.is(":hidden")) {
                                return;
                            }
                            const institutionname = $el
                                .find(".candidate-education__institution-input")
                                .val();
                            const majorname = $el
                                .find(".candidate-education__major-input")
                                .val();
                            const schoollocation = $el
                                .find(".candidate-education__school-location-input")
                                .val();
                            const degree = $el
                                .find(".candidate-education__degree-input")
                                .val();
                            const description = $el
                                .find(".candidate-education__description-input")
                                .val();
                            const from = $el
                                .find(".candidate-education__from-input")
                                .val();
                            const to = $el
                                .find(".candidate-education__to-input")
                                .val();
                            const currentlyattend = $el
                                .find(".candidate-education__currentlyattend-input")
                                .is(":checked");
                            const manualConutry = $el
                                .find(".candidate-education__officelocation-list-manual-select")
                                .val();
                            const manualLocation = $el
                                .find(".candidate-education__officelocation-list-manual-input")
                                .val();
                            let countryCode;
                            if (manualConutry) {
                                const toString = manualConutry.toString();
                                countryCode = this.getCountryCode(toString);
                            }
                            const item = {
                                institution: institutionname,
                                major: majorname,
                                degree: degree,
                                description: description,
                                from: from,
                                to: to,
                                icurrentlyattend: currentlyattend,
                            };
                            const locationDetails = createLocationJsonData(schoollocation, manualLocation, countryCode);
                            if (locationDetails) {
                                item["schoollocation"] = locationDetails;
                            }
                            education.push(item);
                        });
                    }
                    else if (isPlaceofresidence) {
                        const city = $formItem
                            .find(".place-of-residence__input--city")
                            .val();
                        const country = $formItem
                            .find(".place-of-residence__input--country")
                            .val();
                        const countryCode = $formItem
                            .find(".place-of-residence__input--countryCode")
                            .val();
                        const latitude = $formItem
                            .find(".place-of-residence__input--latitude")
                            .val();
                        const longitude = $formItem
                            .find(".place-of-residence__input--longitude")
                            .val();
                        const region = $formItem
                            .find(".place-of-residence__input--region")
                            .val();
                        const regionCode = $formItem
                            .find(".place-of-residence__input--regionCode")
                            .val();
                        const manualConutry = $formItem
                            .find(".place-of-residence__residence-list-manual-select")
                            .val();
                        const manualLocation = $formItem
                            .find(".place-of-residence__residence-list-manual-input")
                            .val();
                        let manualCountryCode;
                        if (manualConutry) {
                            const toString = manualConutry.toString();
                            manualCountryCode = this.getCountryCode(toString);
                        }
                        placeofresidence = {
                            country: country ? country : manualConutry,
                            city: city ? city : manualLocation,
                            countryCode: countryCode
                                ? countryCode
                                : manualCountryCode,
                            region: region,
                            regionCode: regionCode,
                            latitude: latitude,
                            longitude: longitude,
                        };
                    }
                    else {
                        itemValue = $formItem.val();
                    }
                    jsonData.push({
                        id: fieldId,
                        fieldid: fieldId,
                        fieldname: fieldName,
                        objectid: fieldObjectId,
                        type: fieldType,
                        label: fieldDataLabel,
                        value: itemValue,
                        workexperience: workexp,
                        education: education,
                        placeofresidence: placeofresidence,
                    });
                }
            });
            return jsonData;
        }
        PostForm(isCopernicusForm, recaptchaToken, requestVerificationToken, jsonData, formAction, formElement) {
            if (!formAction)
                formAction = window.location.href;
            const headerObject = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Recaptcha": recaptchaToken,
                "X-COP-Form": "true",
                [Antiforgery_2.AntiforgeryHeaderName]: requestVerificationToken,
            };
            jsonData["__RequestVerificationToken"] = requestVerificationToken;
            try {
                const formWidgetId = formElement
                    .closest(".form-widget")
                    .attr("data-id");
                headerObject["X-COP-FormWidgetId"] = formWidgetId;
            }
            catch (_e) { }
            const action = formAction;
            return $.ajax({
                headers: headerObject,
                type: "POST",
                url: action,
                data: JSON.stringify(jsonData),
            })
                .done((data, textstatus, request) => {
                if (isCopernicusForm) {
                    return;
                }
                if (data.status === "success") {
                    console.log(data);
                    jsonData.forEach(function (el) {
                        if (el.fieldname !== "") {
                            $("." + el.id).text(el.value);
                        }
                        else {
                            $(".dyna-item[data-objectid='" +
                                el.fieldid +
                                "'] .dyna-value").text(el.value);
                        }
                    });
                }
                else {
                    if (data.message)
                        window.swal(data.message);
                }
                if (request.getResponseHeader("X-COP-Redirect")) {
                    window.location.href =
                        request.getResponseHeader("X-COP-Redirect");
                }
            })
                .always((rdata, textstatus, data) => {
                if (!isCopernicusForm) {
                    return;
                }
                const arr = data
                    .getAllResponseHeaders()
                    .trim()
                    .split(/[\r\n]+/);
                const headerMap = {};
                arr.forEach(function (line) {
                    const parts = line.split(": ");
                    const header = parts.shift().toUpperCase();
                    headerMap[header] = parts.join(": ");
                });
                if (headerMap["X-COP-REDIRECT"]) {
                    window.location.href = headerMap["X-COP-REDIRECT"];
                    return;
                }
                window.processCopForm(data, formElement, null);
            });
        }
    }
    exports.FormsService = FormsService;
});
define("Handlers/HarriFormWorkflowHandler", ["require", "exports", "ladda", "jquery", "select2"], function (require, exports, Ladda) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HarriFormWorkflowHandler = void 0;
    class HarriFormWorkflowHandler {
        constructor(app) {
            this.app = app;
        }
        OnDocumentReady() {
            const $ = this.app.$;
            $("" +
                ".harri-form .harri-form-control--yes-no .harri-form-control__select," +
                ".harri-form .harri-form-control--multiple-choice .harri-form-control__select").select2({
                minimumResultsForSearch: -1
            });
            $(".harri-form")
                .off("submit")
                .on("submit", function (e) {
                const $form = $(this);
                let doDefaultBehaviour = true;
                let firstErrorElement = null;
                $form.find(".harri-question__errors").hide();
                $form.find(".harri-question[data-id]").each((idx, elm) => {
                    const $question = $(elm);
                    const questionType = $question.attr("data-question-type");
                    const isMandatory = $question.attr("data-is-mandatory") === "True";
                    if (!isMandatory)
                        return;
                    let thisQuestionValid = true;
                    switch (questionType) {
                        case "text":
                            thisQuestionValid =
                                ($question.find("input[type='text'], textarea[type='text']").val().toString().trim() !== "");
                            break;
                        case "yes_no":
                            thisQuestionValid =
                                ($question.find("select").val() && $question.find("select").val().toString() !== "");
                            break;
                        case "single_choice":
                            thisQuestionValid =
                                ($question.find("input:checked").length > 0);
                            break;
                        case "multiple_choice":
                            thisQuestionValid =
                                ($question.find("input:checked").length > 0);
                            break;
                    }
                    if (!thisQuestionValid) {
                        const $errorElement = $question.find(".harri-question__errors");
                        $errorElement.show();
                        if (!firstErrorElement) {
                            firstErrorElement = $errorElement[0];
                        }
                        doDefaultBehaviour = false;
                    }
                });
                if (firstErrorElement) {
                    firstErrorElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest"
                    });
                }
                if (!doDefaultBehaviour) {
                    e.preventDefault();
                    Ladda.stopAll();
                }
            });
        }
    }
    exports.HarriFormWorkflowHandler = HarriFormWorkflowHandler;
});
define("PushNotifications/IPushNotificationsHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Types/OptionTypeValues", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptionTypeValues = void 0;
    class OptionTypeValues {
        static ToKeyValues(vals) {
            const res = {};
            vals.map((r) => {
                if (r.OptionTypeId)
                    res[r.OptionTypeId] = JSON.stringify(r.Options);
            });
            return res;
        }
    }
    exports.OptionTypeValues = OptionTypeValues;
});
define("Handlers/PushNotificationUtilityHandler", ["require", "exports", "Types/OptionTypeValues"], function (require, exports, OptionTypeValues_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PushNotificationUtilityHandler = void 0;
    class PushNotificationUtilityHandler {
        static HandleDataTagsChanged($, pushNotificationInstance) {
            const $body = $(document.body);
            const $pushNotificationWidgets = $(".attrax-push-notifications");
            const contextOptions = $body.attr("data-context-optionids-pushnotifications-opttypes");
            if (!contextOptions)
                return;
            const vals = OptionTypeValues_1.OptionTypeValues.ToKeyValues(JSON.parse(contextOptions));
            pushNotificationInstance
                .GetInstance()
                .then(inst => {
                inst.isPushNotificationsEnabled()
                    .then(isSubscribed => {
                    if (!isSubscribed)
                        return;
                    pushNotificationInstance.IsSubscribedToAll(vals)
                        .then(isSubscribedToAll => {
                        PushNotificationUtilityHandler.DisablePushNotificationLoadingIndicator($);
                        $pushNotificationWidgets
                            .removeClass("attrax-push-notifications--subscribe-to-tags attrax-push-notifications--subscribed-to-tags")
                            .addClass(isSubscribedToAll ? "attrax-push-notifications--subscribed-to-tags" : "attrax-push-notifications--subscribe-to-tags");
                    });
                });
            });
            pushNotificationInstance.GetInstance()
                .then(inst => {
                inst.on('subscriptionChange', (isSubscribed) => {
                    if (!isSubscribed) {
                        $pushNotificationWidgets
                            .removeClass("attrax-push-notifications--subscribe-to-tags attrax-push-notifications--loading attrax-push-notifications--subscribed-to-tags");
                    }
                });
            });
        }
        static Handle($, pushNotificationInstance) {
            const $body = $(document.body);
            $(document).ready(() => {
                setTimeout(() => {
                    PushNotificationUtilityHandler.HandleDataTagsChanged($, pushNotificationInstance);
                }, 1000);
            });
            $(document).on("click", ".attrax-push-notifications--subscribe-to-tags .attrax-push-notifications__subscribe-action", () => {
                const contextOptions = $body.attr("data-context-optionids-pushnotifications-opttypes");
                if (contextOptions) {
                    const arr = JSON.parse(contextOptions);
                    pushNotificationInstance.HandleSubscribeAndRegisterInterest(arr, (tagsSubscribed) => {
                    }, true);
                }
            });
        }
        static EnablePushNotificationLoadingIndicator(jq$) {
            jq$(".attrax-push-notifications").addClass("attrax-push-notifications--loading");
        }
        static DisablePushNotificationLoadingIndicator(jq$) {
            jq$(".attrax-push-notifications").removeClass("attrax-push-notifications--loading");
        }
    }
    exports.PushNotificationUtilityHandler = PushNotificationUtilityHandler;
});
define("PushNotifications/OneSignalPushNotificationsHandler", ["require", "exports", "Types/OptionTypeValues", "Handlers/PushNotificationUtilityHandler", "Utility/Configuration"], function (require, exports, OptionTypeValues_2, PushNotificationUtilityHandler_1, Configuration_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OneSignalPushNotificationsHandler = void 0;
    const trim = (function () {
        function escapeRegex(string) {
            return string.replace(/[\[\](){}?*+\^$\\.|\-]/g, "\\$&");
        }
        return function trim(str, characters) {
            const flags = "g";
            characters = escapeRegex(characters);
            return str.replace(new RegExp("^[" + characters + "]+|[" + characters + "]+$", flags), '');
        };
    }());
    const GetInstance = () => {
        const isEnabled = Configuration_3.default.PushNotificationsEnabled === "true";
        return new Promise((resolve, reject) => {
            if (!isEnabled) {
                reject("Push notifications are not enabled");
            }
            resolve(window.OneSignal);
        });
    };
    const flatten = (ins) => {
        return trim(Object.values(ins)
            .join("")
            .replaceAll("]", ",")
            .replaceAll("[", ""), ",").split(",");
    };
    class OneSignalPushNotificationsHandler {
        constructor($) {
            this.$ = $;
        }
        IsSubscribedToAll(optionIds) {
            if (!optionIds) {
                return Promise.resolve(false);
            }
            if (!this.IsEnabled()) {
                return Promise.resolve(false);
            }
            return this.GetUserDataTags()
                .then(tags => {
                const tagsArr = flatten(tags);
                const optionsArr = flatten(optionIds);
                return optionsArr.every(t => tagsArr.includes(t));
            });
        }
        IsEnabled() {
            const isEnabled = "false".toString();
            return isEnabled === "true";
        }
        Load() {
            const appId = "".toString();
            if (appId === "")
                return;
            window.OneSignal = window.OneSignal || [];
            window.OneSignal.push(() => {
                window.OneSignal.SERVICE_WORKER_PARAM = { scope: '/onesignalsw/' };
                window.OneSignal.SERVICE_WORKER_PATH = 'onesignalsw/OneSignalSDKWorker.js';
                window.OneSignal.SERVICE_WORKER_UPDATER_PATH = 'onesignalsw/OneSignalSDKUpdaterWorker.js';
            });
            GetInstance()
                .then(OS => {
                if (!OS)
                    return;
                OS.push(function () {
                    const instance = OS;
                    const notifyButtonPosition = "bottom-left";
                    const notifyButtonOffset = {
                        bottom: "50px",
                        left: "50px",
                        right: "50px"
                    };
                    const notifyButtonColors = {
                        'circle.background': "rgb(84,110,123)",
                        'circle.foreground': "white",
                        'badge.background': "rgb(84,110,123)",
                        'badge.foreground': "white",
                        'badge.bordercolor': "white",
                        'pulse.color': "white",
                        'dialog.button.background.hovering': "rgb(77, 101, 113)",
                        'dialog.button.background.active': "rgb(70, 92, 103)",
                        'dialog.button.background': "rgb(84,110,123)",
                        'dialog.button.foreground': "white",
                    };
                    instance.init({
                        appId: appId,
                        notifyButton: {
                            enable: true,
                            colors: notifyButtonColors,
                            displayPredicate: () => GetInstance().then(inst => {
                                return inst.isPushNotificationsEnabled()
                                    .then(function (isSubscribed) {
                                    return Configuration_3.default.PushNotificationsShowNotifyButton === "true" && isSubscribed;
                                });
                            }),
                            size: "small",
                            position: notifyButtonPosition,
                            offset: notifyButtonOffset,
                            showCredit: false,
                            text: {
                                'tip.state.unsubscribed': 'You\u0027re unsubscribed to notifications',
                                'tip.state.subscribed': "You\u0027re subscribed to notifications",
                                'tip.state.blocked': "You\u0027ve blocked notifications",
                                'message.prenotify': 'Click here to subscribe',
                                'message.action.subscribed': "Thanks for subscribing!",
                                'message.action.resubscribed': "You\u0027re subscribed to notifications",
                                'message.action.unsubscribed': "You won\u0027t receive notifications again",
                                'dialog.main.title': 'Manage Site Notifications',
                                'dialog.main.button.subscribe': 'Subscribe',
                                'dialog.main.button.unsubscribe': 'Unsubscribe',
                                'dialog.blocked.title': 'Unblock Notifications',
                                'dialog.blocked.message': "Follow these instructions to allow notifications:"
                            }
                        },
                        promptOptions: {
                            slidedown: {
                                enabled: true,
                                autoPrompt: false,
                                actionMessage: "Would you like to receive alerts for jobs like this?",
                                acceptButtonText: "Allow",
                                cancelButtonText: "Block",
                            }
                        },
                        welcomeNotification: {
                            "message": "Thanks for subscribing!",
                        }
                    });
                });
            });
        }
        HandleSubscribeAndRegisterInterest(interestedInOptions, cb, isFromUserAction) {
            const self = this;
            const jq$ = self.$;
            const asOptionTypeValue = (inp, existing) => {
                if (!inp)
                    return inp;
                const result = [];
                for (let i = 0; i < inp.length; i++) {
                    const item = inp[i];
                    const oResult = new OptionTypeValues_2.OptionTypeValues();
                    oResult.OptionTypeId = item.OptionTypeId;
                    oResult.Options = item.Options;
                    if (existing && existing[item.OptionTypeId]) {
                        const existingOptions = JSON.parse(existing[item.OptionTypeId]);
                        for (let i = 0; i < existingOptions.length; i++) {
                            oResult.Options.push(existingOptions[i]);
                        }
                    }
                    result.push(oResult);
                }
                if (existing) {
                    const existingKeys = Object.keys(existing);
                    for (let i = 0; i < existingKeys.length; i++) {
                        const existingItem = existing[existingKeys[i]];
                        const existsInCurrent = result.filter(r => r.OptionTypeId == existingItem.OptionTypeId);
                        if (!existsInCurrent) {
                            const oResult1 = new OptionTypeValues_2.OptionTypeValues();
                            oResult1.OptionTypeId = existingItem.OptionTypeId;
                            oResult1.Options = existingItem.Options;
                            console.log(oResult1);
                            result.push(oResult1);
                        }
                    }
                }
                return result;
            };
            const doRegisterInterest = (existingTags) => {
                GetInstance().then(inst => {
                    const mergedResult = asOptionTypeValue(interestedInOptions, existingTags);
                    const toSend = OptionTypeValues_2.OptionTypeValues.ToKeyValues(mergedResult);
                    inst.sendTags(toSend, function (tagsSent) {
                        PushNotificationUtilityHandler_1.PushNotificationUtilityHandler.EnablePushNotificationLoadingIndicator(jq$);
                        setTimeout(() => {
                            PushNotificationUtilityHandler_1.PushNotificationUtilityHandler.HandleDataTagsChanged(jq$, self);
                            if (cb) {
                                cb(tagsSent);
                            }
                        }, 1500);
                    });
                });
            };
            GetInstance()
                .then(instance => {
                instance.push(function () {
                    instance.isPushNotificationsEnabled()
                        .then((isEnabled) => {
                        if (isEnabled && isFromUserAction) {
                            self.GetUserDataTags().then(tags => {
                                doRegisterInterest(tags);
                            });
                        }
                        if (!isEnabled) {
                            instance.once('subscriptionChange', (isSubscribed) => {
                                if (isSubscribed) {
                                    doRegisterInterest(null);
                                }
                            });
                            instance.showSlidedownPrompt();
                        }
                    });
                });
            });
        }
        SetUserId(id) {
            GetInstance()
                .then(instance => {
                instance.push(function () {
                    instance.setExternalUserId(id);
                });
            });
        }
        GetUserDataTags() {
            return new Promise((resolve) => {
                return GetInstance().then(instance => {
                    instance.push(function () {
                        instance.getTags(function (tags) {
                            resolve(tags);
                        });
                    });
                });
            });
        }
        GetInstance() {
            return GetInstance();
        }
    }
    exports.OneSignalPushNotificationsHandler = OneSignalPushNotificationsHandler;
});
define("Handlers/NavKeyboardHandlers", ["require", "exports", "jquery"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddAccessibleHandlers = void 0;
    function AddAccessibleHandlers($) {
        $("li.hasChildren > .text-node > a").on("keypress", function (e) {
            const listItem = $(this).parent().parent();
            if (e.keyCode === 32 && $(this).is(":focus")) {
                e.preventDefault();
                listItem.addClass("acc-sub-nav");
                listItem.find("> .navList li.first").focus();
            }
        });
        $(document).on("keydown", function (e) {
            if (e.keyCode === 27) {
                $("li").removeClass("acc-sub-nav");
            }
        });
    }
    exports.AddAccessibleHandlers = AddAccessibleHandlers;
});
define("WorkflowSteps/SmartRecruitersScreeningQuestionsHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.select2 = exports.HandleRepeatableRows = void 0;
    function applyJqueryValidationRules(row, originalRow) {
        const $original = $(originalRow);
        const $form = $original.closest("form");
        const $validator = $form.data("attrax-validator");
        const $newElements = $(row).find("input, select, textarea");
        const $originalElements = $original.find("input, select, textarea");
        $newElements.each(function (index, element) {
            const $matching = $($originalElements[index]);
            const matchingRules = $matching.rules();
            const name = $(element).attr("name");
            const targetId = $(element).attr("id");
            const originalName = $matching.attr("name");
            $validator.settings.rules[name] = matchingRules;
            $validator.settings.messages[name] = $validator.settings.messages[originalName];
            const validationTarget = `${$form.attr("id")} ${targetId}`;
            $(element).one("change", function () {
                $("[data-javascript-target='" + validationTarget + "']").remove();
            });
        });
        return row;
    }
    const getCleanedClone = (originalRow, rowNumber, $) => {
        let row = originalRow.cloneNode(true);
        row.classList.remove("smartrecruiters-repeatable__original");
        row.querySelectorAll("td:last-of-type").forEach((v) => {
            const deleteRowButton = document.createElement("button");
            deleteRowButton.classList.add("smartrecruiters-repeatable__delete-row");
            deleteRowButton.setAttribute("type", "button");
            deleteRowButton.addEventListener("click", () => deleteRowButton.closest("tr").remove());
            v.appendChild(deleteRowButton);
        });
        row.querySelectorAll(".attrax-form-item__validation-error").forEach(v => {
            v.remove();
        });
        const toModify = row.querySelectorAll("input, select, textarea");
        toModify.forEach((e) => {
            const currentName = e.getAttribute("name");
            const newName = currentName.replace("|1", "") + "|" + rowNumber.toString();
            e.setAttribute("name", newName);
            e.setAttribute("id", newName);
            e.classList.remove("attrax-form-item--valid");
            e.classList.remove("attrax-form-item--error");
            if (e.nodeName === 'SELECT') {
                setTimeout(() => {
                    e.closest('.smartrecruiters-form-control').querySelector('.select2-selection').setAttribute('tabindex', '0');
                }, 500);
            }
        });
        const toClear = row.querySelectorAll("input[type='text']");
        toClear.forEach((v) => (v.value = ""));
        const toRemove = row.querySelectorAll(".select2-container");
        toRemove.forEach((v) => v.parentNode.removeChild(v));
        const toSelect2 = row.querySelectorAll(".select2--in-place");
        toSelect2.forEach((v) => $(v).select2());
        return row;
    };
    const handleAddNewRowButton = ($, btn, evt) => {
        const table = btn.closest(".smartrecruiters-repeatable__table");
        const tbody = table.querySelector(".smartrecruiters-repeatable__tablebody");
        const rowToClone = tbody.querySelector(".smartrecruiters-repeatable__original");
        const numberOfRows = tbody.querySelectorAll("tr").length + 1;
        const cloned = getCleanedClone(rowToClone, numberOfRows, $);
        const firstFocusableSelect = cloned.querySelector('td:first-of-type .select2-selection__rendered');
        const firstFocusableInput = cloned.querySelector('td:first-of-type input');
        const renderedSelects = cloned.querySelectorAll('td .select2-container');
        tbody.appendChild(cloned);
        btn.blur();
        const focusEvent = new FocusEvent("focus", { bubbles: true });
        const focusAndDispatch = (element, focusEvent) => {
            if (element) {
                element.dispatchEvent(focusEvent);
                element.focus();
            }
        };
        focusAndDispatch(firstFocusableSelect, focusEvent);
        focusAndDispatch(firstFocusableInput, focusEvent);
        if (firstFocusableSelect) {
            renderedSelects.forEach((select) => {
                select.setAttribute('tabindex', '0');
            });
        }
        applyJqueryValidationRules(cloned, rowToClone);
    };
    function HandleRepeatableRows($) {
        const repeatableQuestions = document.querySelectorAll(".smartrecruiters-repeatable__add-new-row-btn");
        repeatableQuestions.forEach((button) => {
            button.addEventListener("click", (evt) => {
                handleAddNewRowButton($, button, evt);
            });
        });
    }
    exports.HandleRepeatableRows = HandleRepeatableRows;
    function select2() {
        throw new Error("Function not implemented.");
    }
    exports.select2 = select2;
});
define("Utility/EventHandlerUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resetAutosuggestionState = exports.findAutoSuggestRoot = exports.isEducationValid = exports.isWorkexperienceValid = exports.setAutosuggestMethod = exports.toggleAutosuggestMethod = exports.EventHandlerUtils = void 0;
    class EventHandlerUtils {
        static OnEvent($, element, eventName, handler) {
            $(document)
                .off(eventName, element)
                .on(eventName, element, handler);
        }
    }
    exports.EventHandlerUtils = EventHandlerUtils;
    const toggleAutosuggestMethod = (root) => {
        const setAuto = root.classList.contains('attrax-autosuggest--manual');
        (0, exports.setAutosuggestMethod)(root, setAuto);
    };
    exports.toggleAutosuggestMethod = toggleAutosuggestMethod;
    const setAutosuggestMethod = (root, isAuto) => {
        if (isAuto) {
            root.classList.remove('attrax-autosuggest--manual');
            root.classList.add('attrax-autosuggest--auto');
            root.setAttribute('data-method', 'autocomplete');
        }
        else {
            root.classList.remove('attrax-autosuggest--auto');
            root.classList.add('attrax-autosuggest--manual');
            root.setAttribute('data-method', 'manual');
        }
    };
    exports.setAutosuggestMethod = setAutosuggestMethod;
    const isWorkexperienceValid = (root) => {
        const title = root.querySelector(".candidate-work-experience__title-input");
        const from = root.querySelector(".candidate-work-experience__from-input");
        const to = root.querySelector(".candidate-work-experience__to-input");
        const currently = root.querySelector(".candidate-work-experience__currentlyworkhere-input");
        return title.value != "" && from.value != "" && (to.value != "" || currently.checked);
    };
    exports.isWorkexperienceValid = isWorkexperienceValid;
    const isEducationValid = (root) => {
        const institution = root.querySelector(".candidate-education__institution-input");
        const major = root.querySelector(".candidate-education__major-input");
        const degree = root.querySelector(".candidate-education__degree-input");
        return institution.value != "" && major.value != "" && degree.value != "";
    };
    exports.isEducationValid = isEducationValid;
    const findAutoSuggestRoot = (el, selector = 'attrax-autosuggest') => el.closest(`.${selector}`);
    exports.findAutoSuggestRoot = findAutoSuggestRoot;
    const _defaultResetAutoSuggestionsOptions = {
        resetDisplayString: true,
        validateElement: true,
        clearValidation: false,
        resetSelectedElement: false
    };
    const resetAutosuggestionState = (root, options = _defaultResetAutoSuggestionsOptions) => {
        if (!root) {
            return;
        }
        const ul = root.querySelector(".attrax-autosuggest__country-list");
        while (ul && ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        if (options.resetSelectedElement) {
            const selectedValue = root.querySelector(".attrax-autosuggest__selected-item");
            selectedValue.value = "";
        }
        const inputs = root.querySelectorAll(".attrax-autosuggest__input");
        inputs.forEach((input) => {
            if (input.classList.contains('attrax-autosuggest__displayString')) {
                if (options.resetDisplayString) {
                    input.value = "";
                }
            }
            else {
                input.value = "";
            }
        });
        const displayStringInput = root.querySelector(".attrax-autosuggest__displayString");
        if (options.validateElement) {
            const $form = $(root.closest("form"));
            const jqValidator = $form.data("attrax-validator");
            jqValidator.element($(displayStringInput));
        }
        if (options.clearValidation) {
            root
                .querySelectorAll(".attrax-form-item--valid")
                .forEach(x => x.classList.remove("attrax-form-item--valid"));
            root
                .querySelectorAll(".attrax-form-item__validation-error")
                .forEach(x => x.remove());
        }
    };
    exports.resetAutosuggestionState = resetAutosuggestionState;
});
define("Handlers/LocationsDataHandler", ["require", "exports", "Utility/SmartRecruiterCountries"], function (require, exports, SmartRecruiterCountries_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchCountries = exports.fetchAutoSuggestions = void 0;
    const domainNameForApiLocationLookUp = window.location.protocol +
        "//" +
        window.location.host +
        window.siteUrlPrefix;
    const fetchAutoSuggestions = (location) => {
        let settings = {
            url: `/api/v1/location-search/query/${location}`,
            method: "GET",
            timeout: 0,
            referrerPolicy: "origin",
        };
        try {
            const response = fetch(settings.url, settings)
                .then((response) => {
                return response.json();
            });
            return response;
        }
        catch (error) {
            throw new Error(`Error fetching location data: ${error}`);
        }
    };
    exports.fetchAutoSuggestions = fetchAutoSuggestions;
    const fetchCountries = () => {
        const countries = SmartRecruiterCountries_2.SmartRecruitersCountries;
        return countries;
    };
    exports.fetchCountries = fetchCountries;
});
define("Handlers/AutoSuggestions", ["require", "exports", "Utility/EventHandlerUtils", "Handlers/LocationsDataHandler"], function (require, exports, EventHandlerUtils_1, LocationsDataHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.populateAutoSuggestions = exports.configureRootAutosuggest = exports.AutoSuggestions = void 0;
    let typingTimeout;
    const inputInstructions = {
        general: ".attrax-autosuggest__input-instructions",
        manual: ".attrax-autosuggest__switch-to-manual",
    };
    const showRelevantSuggestionFields = (root, inputValue) => {
        if (inputValue.length === 0) {
            root.querySelector(inputInstructions.general).style.display = 'block';
            root.querySelector(inputInstructions.manual).style.display = 'none';
        }
        if (inputValue.length < 3 && inputValue.length > 0) {
            root.querySelector(inputInstructions.general).style.display = 'block';
            root.querySelector(inputInstructions.manual).style.display = 'none';
            return;
        }
        if (inputValue.length >= 3) {
            root.querySelector(inputInstructions.general).style.display = 'none';
            root.querySelector(inputInstructions.manual).style.display = 'block';
            const ulContainer = root.querySelector(".attrax-autosuggest__list-container");
            if (ulContainer) {
                ulContainer.classList.add("show");
            }
        }
    };
    const AutoSuggestions = () => {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains("attrax-autosuggest__switch-to-auto")) {
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
                (0, EventHandlerUtils_1.toggleAutosuggestMethod)(root);
                (0, EventHandlerUtils_1.resetAutosuggestionState)(root, {
                    resetDisplayString: true,
                    validateElement: false,
                    clearValidation: true,
                    resetSelectedElement: true
                });
                const displayString = root.querySelector(".attrax-autosuggest__displayString");
                if (displayString) {
                    displayString.classList.remove("attrax-form-item--error");
                    displayString.focus();
                    const ulContainer = root.querySelector(".attrax-autosuggest__list-container");
                    ulContainer.classList.add("show");
                    showRelevantSuggestionFields(root, "");
                }
            }
        });
        document.addEventListener("input", (e) => {
            const target = e.target;
            if (!target.classList.contains("attrax-autosuggest__displayString")) {
                return;
            }
            clearTimeout(typingTimeout);
            const input = target;
            const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(input);
            if (!root) {
                return;
            }
            const inputValue = input.value;
            if (inputValue.length === 0) {
                (0, EventHandlerUtils_1.resetAutosuggestionState)(root, {
                    resetDisplayString: true,
                    validateElement: true,
                    clearValidation: true,
                    resetSelectedElement: true
                });
            }
            else {
                showRelevantSuggestionFields(root, inputValue);
            }
            if (inputValue.length >= 3) {
                typingTimeout = setTimeout(() => {
                    (0, exports.populateAutoSuggestions)(inputValue, root);
                }, 300);
                return;
            }
        });
        document.addEventListener("click", (e) => {
        });
        const onSuggestionSelected = (e) => {
            const target = e.target;
            if (!target.classList.contains("attrax-autosuggest__country-list-item")) {
                return;
            }
            const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
            setAutosuggestState(root, target);
        };
        document.addEventListener("click", (e) => {
            onSuggestionSelected(e);
        });
        document.addEventListener("keydown", (e) => {
            const target = e.target;
            if (e.key === "Enter"
                && target
                && target.classList
                && target.classList.contains("attrax-autosuggest__country-list-item")) {
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
                onSuggestionSelected(e);
                hideSuggestions(root, e);
            }
        });
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.classList.contains("attrax-autosuggest__displayString")) {
                return;
            }
            if (target.classList.contains("attrax-autosuggest__switch-to-auto")) {
                return;
            }
            if (target.classList.contains("attrax-autosuggest__country-list-item")) {
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
                hideSuggestions(root, e);
                return;
            }
            const visibleUl = document.querySelectorAll(".attrax-autosuggest__list-container.show");
            visibleUl.forEach((ul) => {
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(ul);
                hideSuggestions(root);
            });
        });
        document.addEventListener('blur', (e) => {
            const target = e.target;
            const relatedTarget = e.relatedTarget;
            if (target
                && target.classList
                && target.classList.contains('attrax-autosuggest__input')
                && !target.classList.contains('attrax-autosuggest__manual-select')
                && !target.classList.contains('attrax-autosuggest__manual-input')
                && (relatedTarget == null || (relatedTarget.classList
                    && !relatedTarget.classList.contains('attrax-autosuggest__country-list-item')
                    && !relatedTarget.classList.contains('attrax-autosuggest__switch-to-manual')))) {
                e.stopPropagation();
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
                const isRequired = root.getAttribute("data-required") === "true";
                (0, EventHandlerUtils_1.resetAutosuggestionState)(root, {
                    resetDisplayString: true,
                    validateElement: isRequired,
                    clearValidation: target.value == "" && !isRequired,
                    resetSelectedElement: false
                });
                const displayStringInput = root.querySelector(".attrax-autosuggest__displayString");
                const newDisplayString = root.querySelector(".attrax-autosuggest__selected-item");
                if (newDisplayString === null || newDisplayString === void 0 ? void 0 : newDisplayString.value) {
                    displayStringInput.value = newDisplayString.value;
                }
            }
        }, true);
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.classList.contains("attrax-autosuggest__switch-to-manual")) {
                const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
                (0, EventHandlerUtils_1.toggleAutosuggestMethod)(root);
                (0, EventHandlerUtils_1.resetAutosuggestionState)(root, {
                    resetDisplayString: true,
                    validateElement: false,
                    clearValidation: true,
                    resetSelectedElement: true
                });
                root.querySelectorAll(".attrax-autosuggest__manual-input")
                    .forEach((x) => x.value = "");
            }
        });
        document.addEventListener('focusin', (e) => {
            const target = e.target;
            if (!target.classList.contains("attrax-autosuggest__displayString")) {
                return;
            }
            const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(target);
            const ulContainer = root.querySelector(".attrax-autosuggest__list-container");
            ulContainer.classList.add("show");
        });
    };
    exports.AutoSuggestions = AutoSuggestions;
    const configureRootAutosuggest = (el) => {
        const root = (0, EventHandlerUtils_1.findAutoSuggestRoot)(el);
        (0, EventHandlerUtils_1.setAutosuggestMethod)(root, true);
        root.querySelectorAll(".attrax-autosuggest__country-list-item")
            .forEach(x => x.remove());
        root.querySelectorAll(".attrax-form-item--error")
            .forEach(x => x.classList.remove("attrax-form-item--error"));
        root.querySelectorAll(".attrax-form-item--success")
            .forEach(x => x.classList.remove("attrax-form-item--valid"));
        showRelevantSuggestionFields(root, "");
    };
    exports.configureRootAutosuggest = configureRootAutosuggest;
    const setAutosuggestState = (root, suggestionClicked) => {
        const liInputs = Array.from(suggestionClicked.querySelectorAll("input"));
        liInputs.forEach((input) => {
            const dataInput = root.querySelector(`.attrax-autosuggest__${input.name}`);
            if (dataInput) {
                dataInput.value = input.value;
            }
        });
        const selectedValue = suggestionClicked.innerText;
        const displayStringInput = root.querySelector(".attrax-autosuggest__displayString");
        displayStringInput.value = selectedValue;
        const suggestInput = root.querySelector(".attrax-autosuggest__selected-item");
        suggestInput.value = selectedValue;
        root.querySelectorAll(".attrax-form-item__validation-error")
            .forEach(x => x.remove());
        const $form = $(root.closest("form"));
        const jqValidator = $form.data("attrax-validator");
        jqValidator.element($(displayStringInput));
    };
    const populateAutoSuggestions = (searchValue, root) => {
        (0, EventHandlerUtils_1.resetAutosuggestionState)(root, {
            resetDisplayString: false,
            validateElement: false,
            clearValidation: false,
            resetSelectedElement: false
        });
        (0, LocationsDataHandler_1.fetchAutoSuggestions)(searchValue)
            .then((locations) => {
            const ul = root.querySelector(".attrax-autosuggest__country-list");
            locations.forEach((location) => {
                const li = document.createElement("li");
                li.classList.add("attrax-autosuggest__country-list-item");
                li.tabIndex = 0;
                li.innerText = location.displayString;
                for (const key in location) {
                    const input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", key);
                    input.value = location[key];
                    li.appendChild(input);
                }
                ul.appendChild(li);
            });
        });
    };
    exports.populateAutoSuggestions = populateAutoSuggestions;
    const hideSuggestions = (root, e) => {
        if (e) {
            e === null || e === void 0 ? void 0 : e.stopPropagation();
        }
        const ul = root.querySelector(".attrax-autosuggest__list-container");
        if (!ul) {
            return;
        }
        ul.classList.remove("show");
    };
});
define("Handlers/SmartRecruitersFormsHandlers", ["require", "exports", "Handlers/AutoSuggestions", "Utility/StringUtils", "Utility/EventHandlerUtils", "jquery"], function (require, exports, AutoSuggestions_1, StringUtils_2, EventHandlerUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkEducationEventListeners = exports.AddSmartRecruitersFormHandlers = void 0;
    const clearInputValues = (inputs) => {
        inputs.val("");
        inputs.prop("checked", false);
        inputs.removeClass("attrax-form-item--valid");
    };
    const _addWorkExperienceHandlers = ($) => {
        let countWorkExperience = 1;
        $(document).on("click", ".candidate-work-experience__add-new", function (e) {
            const entries = $(this)
                .closest(".candidate-work-experience")
                .find(".candidate-work-experience__entries");
            const first = entries
                .find(".candidate-work-experience__entry")
                .first();
            if (first.is(".candidate-work-experience__entry--visible")) {
                const clone = first.clone();
                countWorkExperience++;
                const inputs = clone.find("input");
                const textArea = clone.find("textarea");
                inputs.val("");
                textArea.val("");
                inputs.removeClass("attrax-form-item--valid, attrax-form-item--error");
                textArea.removeClass("attrax-form-item--valid, attrax-form-item--error");
                clone.find(".attrax-form-item--error").css("display", "none");
                clone
                    .find(".inner-container > .pseudo-form-entry")
                    .addClass("pseudo-form-entry--hidden");
                clone
                    .find(".details-container")
                    .removeClass("details-container--hidden")
                    .removeClass("details-container--valid");
                clone
                    .find(".attrax-form-item--valid")
                    .removeClass("attrax-form-item--valid");
                clone
                    .find(".candidate-work-experience__to")
                    .removeClass("candidate-work-experience__to--notapplicable");
                clone
                    .find(".locations-list-container--manual")
                    .removeClass("active")
                    .addClass("locations-list-container--hidden");
                clone
                    .find(".form-locations-section input.hide")
                    .removeClass("hide");
                clone
                    .find(".candidate-work-experience__to")
                    .removeClass("candidate-work-experience__to--notapplicable");
                clone.find("input[name]").each(function () {
                    $(this).attr("name", $(this).attr("name") + countWorkExperience);
                });
                clone.find("input[id]").each(function () {
                    $(this).attr("id", $(this).attr("id") + countWorkExperience);
                });
                clone
                    .find(".candidate-work-experience__currentlyworkhere-input")
                    .each(function () {
                    $(this).prop("checked", false);
                });
                clone.find("label").each(function () {
                    $(this).attr("for", $(this).attr("for") + countWorkExperience);
                });
                clone.appendTo(entries);
                const autoSuggest = clone.find(".attrax-autosuggest");
                if (autoSuggest.length) {
                    (0, AutoSuggestions_1.configureRootAutosuggest)(autoSuggest[0]);
                }
                const $wExpValidated = clone.find(".candidate-work-experience__officelocation-input, " +
                    ".candidate-work-experience__officelocation-list-manual-input, " +
                    ".candidate-work-experience__officelocation-list-manual-select");
                $wExpValidated
                    .each(function (idx, elm) {
                    var _a, _b;
                    const $formItem = $(elm);
                    const formItemNameOrId = $formItem.attr("name");
                    const dataRequired = $formItem
                        .closest(".attrax-form-item")
                        .attr("data-required");
                    if (!StringUtils_2.StringUtils.IsNullOrWhitespace(formItemNameOrId)) {
                        const isRequired = (dataRequired && dataRequired.toLowerCase() === "true");
                        let formItemLabel = $formItem
                            .closest(".attrax-form-item")
                            .find(".attrax-form-item__label")
                            .text()
                            .replace("*", "");
                        const formRules = $formItem.closest("form").data("attrax-validator");
                        if (((_a = formRules === null || formRules === void 0 ? void 0 : formRules.settings) === null || _a === void 0 ? void 0 : _a.rules) && ((_b = formRules === null || formRules === void 0 ? void 0 : formRules.settings) === null || _b === void 0 ? void 0 : _b.messages)) {
                            formRules.settings.rules[formItemNameOrId] = { "autosuggestedlocation": true };
                            formRules.settings.messages[formItemNameOrId] = {
                                "autosuggestedlocation": isRequired ?
                                    "{0} is required, please complete.".replace("{0}", formItemLabel)
                                    :
                                        ""
                            };
                        }
                    }
                });
            }
            else {
                first.addClass("candidate-work-experience__entry--visible");
                (0, AutoSuggestions_1.configureRootAutosuggest)(first.find(".attrax-autosuggest")[0]);
            }
        });
        $(document).on("click", ".candidate-work-experience__remove-entry", function (e) {
            const entries = $(this)
                .closest(".candidate-work-experience__entries")
                .find(".candidate-work-experience__entry");
            const entryInputs = $(this)
                .closest(".candidate-work-experience__entry")
                .find(".details-container input, .details-container textarea");
            clearInputValues(entryInputs);
            $(this).closest(".candidate-work-experience").find(".attrax-form-item__validation-error").remove();
            $(this).closest(".candidate-work-experience").find(".attrax-form-item--error").removeClass("attrax-form-item--error");
            if (entries.length <= 1) {
                entries.removeClass("candidate-work-experience__entry--visible");
                return;
            }
            $(this)
                .closest(".candidate-work-experience__entry")
                .remove();
        });
        $(document).on("change", ".candidate-work-experience__currentlyworkhere-input", function (e) {
            const $el = $(this);
            const $entryRoot = $el.closest(".candidate-work-experience__entry");
            const $to = $entryRoot.find(".candidate-work-experience__to");
            const $toInput = $to.find("input");
            if ($el.is(":checked")) {
                $toInput.val("");
                $to.addClass("candidate-work-experience__to--notapplicable");
                $to.find("input").removeClass("attrax-form-item--valid");
            }
            else {
                $to.removeClass("candidate-work-experience__to--notapplicable");
            }
        });
    };
    const _addEducationHandlers = ($) => {
        let countEducation = 1;
        $(document).on("click", ".candidate-education__add-new", function (e) {
            const entries = $(this)
                .closest(".candidate-education")
                .find(".candidate-education__entries");
            const first = entries.find(".candidate-education__entry").first();
            if (first.is(".candidate-education__entry--visible")) {
                const clone = first.clone();
                countEducation++;
                const inputs = clone.find("input");
                const textArea = clone.find("textarea");
                inputs.val("");
                textArea.val("");
                inputs.removeClass("attrax-form-item--valid, attrax-form-item--error");
                textArea.removeClass("attrax-form-item--valid, attrax-form-item--error");
                clone.find(".attrax-form-item--error").css("display", "none");
                clone
                    .find(".inner-container > .pseudo-form-entry")
                    .addClass("pseudo-form-entry--hidden");
                clone
                    .find(".details-container")
                    .removeClass("details-container--hidden")
                    .removeClass("details-container--valid");
                clone
                    .find(".attrax-form-item--valid")
                    .removeClass("attrax-form-item--valid");
                clone
                    .find(".candidate-education__to")
                    .removeClass("candidate-education__to--notapplicable");
                clone
                    .find(".locations-list-container--manual")
                    .removeClass("active")
                    .addClass("locations-list-container--hidden");
                clone
                    .find(".form-locations-section input.hide")
                    .removeClass("hide");
                clone
                    .find(".candidate-education__to")
                    .removeClass("candidate-education__to--notapplicable");
                clone.find("input[name]").each(function () {
                    $(this).attr("name", $(this).attr("name") + countEducation);
                });
                clone.find("input[id]").each(function () {
                    $(this).attr("id", $(this).attr("id") + countEducation);
                });
                clone
                    .find(".candidate-education__currentlyattend-input")
                    .each(function () {
                    $(this).prop("checked", false);
                });
                clone.find("label").each(function () {
                    $(this).attr("for", $(this).attr("for") + countEducation);
                });
                clone.appendTo(entries);
                const autoSuggest = clone.find(".attrax-autosuggest");
                if (autoSuggest.length) {
                    (0, AutoSuggestions_1.configureRootAutosuggest)(autoSuggest[0]);
                }
                const $education = clone.find(".candidate-education__school-location-input, " +
                    ".candidate-education__officelocation-list-manual-select, " +
                    ".candidate-education__officelocation-list-manual-input");
                $education
                    .each(function (idx, elm) {
                    var _a, _b;
                    const $formItem = $(elm);
                    const formItemNameOrId = $formItem.attr("name");
                    const dataRequired = $formItem
                        .closest(".attrax-form-item")
                        .attr("data-required");
                    if (!StringUtils_2.StringUtils.IsNullOrWhitespace(formItemNameOrId)) {
                        const isRequired = (dataRequired && dataRequired.toLowerCase() === "true");
                        let formItemLabel = $formItem
                            .closest(".attrax-form-item")
                            .find(".attrax-form-item__label")
                            .text()
                            .replace("*", "");
                        const formRules = $formItem.closest("form").data("attrax-validator");
                        if (((_a = formRules === null || formRules === void 0 ? void 0 : formRules.settings) === null || _a === void 0 ? void 0 : _a.rules) && ((_b = formRules === null || formRules === void 0 ? void 0 : formRules.settings) === null || _b === void 0 ? void 0 : _b.messages)) {
                            formRules.settings.rules[formItemNameOrId] = { "autosuggestedlocation": true };
                            formRules.settings.messages[formItemNameOrId] = {
                                "autosuggestedlocation": isRequired ?
                                    "{0} is required, please complete.".replace("{0}", formItemLabel)
                                    :
                                        ""
                            };
                        }
                    }
                });
            }
            else {
                first.addClass("candidate-education__entry--visible");
                (0, AutoSuggestions_1.configureRootAutosuggest)(first.find(".attrax-autosuggest")[0]);
            }
        });
        $(document).on("click", ".candidate-education__remove-entry", function (e) {
            const entries = $(this)
                .closest(".candidate-education__entries")
                .find(".candidate-education__entry");
            const entryInputs = $(this)
                .closest(".candidate-education__entry")
                .find(".details-container input, .details-container textarea");
            clearInputValues(entryInputs);
            $(this).closest(".candidate-education").find(".attrax-form-item__validation-error").remove();
            $(this).closest(".candidate-education").find(".attrax-form-item--error").removeClass("attrax-form-item--error");
            if (entries.length <= 1) {
                entries.removeClass("candidate-education__entry--visible");
                return;
            }
            $(this).closest(".candidate-education__entry").remove();
        });
        $(document).on("change", ".candidate-education__currentlyattend-input", function (e) {
            const $el = $(this);
            const $entryRoot = $el.closest(".candidate-education__entry");
            const $to = $entryRoot.find(".candidate-education__to");
            const $toInput = $to.find("input");
            if ($el.is(":checked")) {
                $toInput.val("");
                $to.addClass("candidate-education__to--notapplicable");
                $to.find("input").removeClass("attrax-form-item--valid");
            }
            else {
                $to.removeClass("candidate-education__to--notapplicable");
            }
        });
    };
    const getInputValues = (elms) => {
        let data = {};
        const convertDate = (date) => {
            const toDate = new Date(date);
            const month = toDate.toLocaleString("default", { month: "long" });
            const year = toDate.getFullYear();
            const toDateString = `${month} ${year}`;
            return toDateString;
        };
        elms.forEach((formControl) => {
            const tag = formControl.dataset.tag;
            let input = formControl.querySelector("input");
            let textarea = formControl.querySelector("textarea");
            let value = (input && input.value) || (textarea && textarea.value) || "";
            if (tag === "present" && input.checked) {
                value = "Present";
            }
            if (tag === "to" && value !== "") {
                value = convertDate(value);
            }
            if (tag === "from" && value !== "") {
                value = convertDate(value);
            }
            data[tag] = value;
        });
        return data;
    };
    const workExperienceMarkUp = (data) => {
        const toDate = data.present === "Present" && data.to === "" ? data.present : data.to;
        return `
        <div class="pseudo-form-entry__inner-container">
            <p class="pseudo-form-entry__title">${data.title}</p>
            <p class="pseudo-form-entry__dates">${data.from} - ${toDate}</p>
        </div>
        <p class="pseudo-form-entry__company-name">${data.companyName}</p>
        <p class="pseudo-form-entry__description">${data.description}</p>`;
    };
    const educationMarkUp = (data) => {
        const toDate = data.present === "Present" && data.to === "" ? data.present : data.to;
        return `
        <div class="pseudo-form-entry__inner-container">
            <p class="pseudo-form-entry__title">${data.institution}</p>
            <p class="pseudo-form-entry__dates">${data.from} - ${toDate}</p>
        </div>
        <p class="pseudo-form-entry__company-name">${data.major}</p>
        <p class="pseudo-form-entry__company-name">${data.degree}</p>
        <p class="pseudo-form-entry__description">${data.description}</p>`;
    };
    const generatePseudoFormAndAttachToContainer = (e, target, section) => {
        const entry = target.closest(".inner-container");
        const pseudoContainer = entry.querySelector(".pseudo-form-entry");
        const pseudoContainerInner = entry.querySelector(".pseudo-form-entry__content");
        const detailsContainer = entry.querySelector(".details-container");
        const inputs = entry.querySelectorAll(".details-container div[data-tag]");
        const values = getInputValues(inputs);
        let markup;
        if (section === "work") {
            markup = workExperienceMarkUp(values);
        }
        if (section === "education") {
            markup = educationMarkUp(values);
        }
        pseudoContainerInner.innerHTML = markup;
        pseudoContainer.classList.remove("pseudo-form-entry--hidden");
        detailsContainer.classList.add("details-container--hidden");
    };
    const showEntryEditOptions = (target) => {
        const container = target.parentElement.querySelector(".pseudo-form-entry__inner-actions");
        container.classList.add("show");
    };
    const hideEntryEditiOptions = () => {
        const editOptionContainers = document.querySelectorAll(".pseudo-form-entry__inner-actions.show");
        editOptionContainers.forEach((container) => {
            container.classList.remove("show");
        });
    };
    const openSudoFormToEdit = (isTarget, e, target) => {
        if (isTarget === true) {
            e.preventDefault();
            target
                .closest(".pseudo-form-entry")
                .classList.add("pseudo-form-entry--hidden");
            target
                .closest(".inner-container")
                .querySelector(".details-container")
                .classList.remove("details-container--hidden");
        }
    };
    const removeEntryAndPseudoForm = (target, entries, entryType) => {
        const allEntries = target
            .closest(entries)
            .querySelectorAll(".entry-container").length;
        const inputs = target
            .closest(".inner-container")
            .querySelectorAll(".details-container input, .details-container textarea, .details-container input[checkbox]");
        inputs.forEach((input) => {
            if (input instanceof HTMLInputElement ||
                input instanceof HTMLTextAreaElement) {
                input.value = "";
                input.classList.remove("attrax-form-item--valid");
            }
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                input.checked = false;
            }
        });
        if (allEntries <= 1) {
            target
                .closest(".entry-container")
                .classList.remove(`${entryType}__entry--visible`);
            target
                .closest(".pseudo-form-entry")
                .classList.add("pseudo-form-entry--hidden");
            target
                .closest(".inner-container")
                .querySelector(".details-container")
                .classList.remove("details-container--hidden");
            return;
        }
        target.closest(".entry-container").remove();
    };
    const handleRevalidationOfFieldsOnPresentSelect = (input) => {
        input.removeAttribute("required");
        input.classList.remove("attrax-form-item--valid");
    };
    const checkAllRequiredInputsAreSelectedForWorkEdu = (target) => {
        const detailsContainer = target.closest(".details-container");
        const allRequiredInputs = detailsContainer.querySelectorAll("input[required], textarea[required]").length;
        const toNotRequired = detailsContainer.querySelectorAll(".candidate-work-experience__to--notapplicable input[required]");
        if (toNotRequired.length > 0) {
            const adjustedRequiredInputs = allRequiredInputs - 1;
            return adjustedRequiredInputs;
        }
        return allRequiredInputs;
    };
    const checkRequiredFieldsAreValid = (target) => {
        let count = 0;
        const allRequiredInputsAreValid = target
            .closest(".details-container")
            .querySelectorAll("input[required]");
        allRequiredInputsAreValid.forEach((input) => {
            if (input.classList.contains("attrax-form-item--valid") ||
                input.value) {
                count++;
            }
        });
        return count;
    };
    const toggleValidClassOnDetailsContainer = (isValid, target) => {
        if (isValid) {
            target
                .closest(".details-container")
                .classList.add("details-container--valid");
        }
        else {
            target
                .closest(".details-container")
                .classList.remove("details-container--valid");
        }
    };
    function AddSmartRecruitersFormHandlers($) {
        _addWorkExperienceHandlers($);
        _addEducationHandlers($);
    }
    exports.AddSmartRecruitersFormHandlers = AddSmartRecruitersFormHandlers;
    const WorkEducationEventListeners = () => {
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("commit-entry")) {
                const section = target.classList.contains("candidate-work-experience__commit-entry")
                    ? "work"
                    : "education";
                generatePseudoFormAndAttachToContainer(event, target, section);
            }
        });
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("pseudo-form-entry__actions-open")) {
                event.preventDefault();
                showEntryEditOptions(target);
            }
            else {
                hideEntryEditiOptions();
            }
        });
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("pseudo-form-entry__actions-edit")) {
                openSudoFormToEdit(true, event, target);
            }
        });
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("pseudo-form-entry__actions-remove") &&
                target.closest(".candidate-work-experience")) {
                event.preventDefault();
                const entries = ".candidate-work-experience__entries";
                const entry = "candidate-work-experience";
                removeEntryAndPseudoForm(target, entries, entry);
            }
            if (target.classList.contains("pseudo-form-entry__actions-remove") &&
                target.closest(".candidate-education")) {
                event.preventDefault();
                const entries = ".candidate-education__entries";
                const entry = "candidate-education";
                removeEntryAndPseudoForm(target, entries, entry);
            }
        });
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("candidate-work-experience__currentlyworkhere-input")) {
                const toInvalidate = target
                    .closest(".details-container")
                    .querySelector(".candidate-work-experience__to input");
                handleRevalidationOfFieldsOnPresentSelect(toInvalidate);
            }
        });
        document.addEventListener("change", (event) => {
            const target = event.target;
            if (!target.closest(".details-container"))
                return;
            const wexpRoot = target.closest(".candidate-work-experience__entry");
            const isWorkExperience = wexpRoot !== null;
            const eduRoot = target.closest(".candidate-education__entry");
            const isEducation = eduRoot !== null;
            const isValid = isWorkExperience ? (0, EventHandlerUtils_2.isWorkexperienceValid)(wexpRoot) :
                isEducation ? (0, EventHandlerUtils_2.isEducationValid)(eduRoot) : false;
            toggleValidClassOnDetailsContainer(isValid, target);
        });
        document.addEventListener("focusin", (event) => {
            const target = event.target;
            if (!target.closest(".details-container"))
                return;
            const wexpRoot = target.closest(".candidate-work-experience__entry");
            const isWorkExperience = wexpRoot !== null;
            const eduRoot = target.closest(".candidate-education__entry");
            const isEducation = eduRoot !== null;
            const isValid = isWorkExperience ? (0, EventHandlerUtils_2.isWorkexperienceValid)(wexpRoot) :
                isEducation ? (0, EventHandlerUtils_2.isEducationValid)(eduRoot) : false;
            toggleValidClassOnDetailsContainer(isValid, target);
        });
        document.addEventListener("input", (event) => {
            const target = event.target;
            if (!target.closest(".details-container"))
                return;
            const wexpRoot = target.closest(".candidate-work-experience__entry");
            const isWorkExperience = wexpRoot !== null;
            const eduRoot = target.closest(".candidate-education__entry");
            const isEducation = eduRoot !== null;
            const isValid = isWorkExperience ? (0, EventHandlerUtils_2.isWorkexperienceValid)(wexpRoot) :
                isEducation ? (0, EventHandlerUtils_2.isEducationValid)(eduRoot) : false;
            toggleValidClassOnDetailsContainer(isValid, target);
        });
        document.addEventListener("focusout", (event) => {
            const target = event.target;
            if (!target.closest(".details-container"))
                return;
            const wexpRoot = target.closest(".candidate-work-experience__entry");
            const isWorkExperience = wexpRoot !== null;
            const eduRoot = target.closest(".candidate-education__entry");
            const isEducation = eduRoot !== null;
            const isValid = isWorkExperience ? (0, EventHandlerUtils_2.isWorkexperienceValid)(wexpRoot) :
                isEducation ? (0, EventHandlerUtils_2.isEducationValid)(eduRoot) : false;
            toggleValidClassOnDetailsContainer(isValid, target);
        });
    };
    exports.WorkEducationEventListeners = WorkEducationEventListeners;
});
define("Handlers/ManualLocationSelect", ["require", "exports", "Utility/SmartRecruiterCountries", "Utility/EventHandlerUtils"], function (require, exports, SmartRecruiterCountries_3, EventHandlerUtils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManualLocationSelect = void 0;
    const ManualLocationSelect = () => {
        document.addEventListener("input", (e) => {
            const target = e.target;
            if (target.classList.contains("attrax-autosuggest__manual-input")) {
                const root = (0, EventHandlerUtils_3.findAutoSuggestRoot)(target);
                root
                    .querySelectorAll(".attrax-form-item__validation-error")
                    .forEach(x => x.remove());
                const $form = $(root.closest("form"));
                const jqValidator = $form.data("attrax-validator");
                jqValidator.element($(target));
                jqValidator.element($(target).siblings(".attrax-autosuggest__manual-select"));
            }
        });
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.classList.contains("attrax-autosuggest__switch-to-manual")) {
                const root = (0, EventHandlerUtils_3.findAutoSuggestRoot)(target);
                const manualLocationSelect = root.querySelector('.attrax-autosuggest__manual-select');
                SmartRecruiterCountries_3.SmartRecruitersCountries.forEach((country) => {
                    const option = document.createElement('option');
                    option.innerHTML = country.country;
                    option.classList.add('attrax-autosuggest__manual-select-option');
                    manualLocationSelect.appendChild(option);
                });
                const errors = root.querySelectorAll("attrax-form-item__validation-error");
                errors.forEach((error) => {
                    error.remove();
                });
            }
        });
    };
    exports.ManualLocationSelect = ManualLocationSelect;
});
define("Handlers/CvParsing", ["require", "exports", "Utility/Antiforgery"], function (require, exports, Antiforgery_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.populateFields = exports.convertISODateToInputDate = exports.populateMultipleFields = exports.addRows = exports.uploadFileToUploadCv = exports.removeCachedCvData = exports.getCachedCvData = exports.cacheDataInSessionStorage = exports.candidateLoadedFile = exports.validateFileType = exports.AutoPopulateFromCV = void 0;
    const AutoPopulateFromCV = () => __awaiter(void 0, void 0, void 0, function* () {
        const dropZone = document.querySelector('.attrax-form-item--fileparser');
        const fileInput = document.querySelector('.attrax-form-item__fileparser-input');
        const isLastStep = document.querySelector('.attrax-workflow-widget .thank-you-message, .attrax-workflow-widget .already-applied');
        const isWorkFlow = document.body.classList.contains('workflow-theme');
        const upLoadCvbtn = document.querySelector('.fileparser__cv-parser-btn');
        const removeFileBtn = document.querySelector('.fileparser__remove-file');
        if (dropZone || isLastStep || !isWorkFlow) {
            (0, exports.removeCachedCvData)();
        }
        const sessionStorageData = (0, exports.getCachedCvData)();
        if (document.body.classList.contains('workflow-theme') && sessionStorageData) {
            updateDomWithData(sessionStorageData);
        }
        const simulateButtonClick = (event) => {
            event.preventDefault();
            fileInput.click();
        };
        if (dropZone && fileInput && upLoadCvbtn) {
            upLoadCvbtn.addEventListener('click', (event) => {
                simulateButtonClick(event);
            });
            upLoadCvbtn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    simulateButtonClick(event);
                }
            });
            removeFileBtn.addEventListener('click', (event) => {
                event.preventDefault();
                fileInput.value = '';
                (0, exports.removeCachedCvData)();
                document.querySelector('.fileparser__success-message').classList.add('hidden');
                return;
            });
            dropZone.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            dropZone.addEventListener("drop", (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                const upload = event.dataTransfer;
                if (upload.files.length > 1) {
                    document
                        .querySelector(".fileparser__error-message--wrong-file-type")
                        .classList.remove("hidden");
                    return;
                }
                yield handleFileUpload(upload.files[0]);
            }));
            fileInput.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
                const userUploadedCv = (0, exports.candidateLoadedFile)(fileInput);
                yield handleFileUpload(userUploadedCv);
            }));
        }
    });
    exports.AutoPopulateFromCV = AutoPopulateFromCV;
    const validateFileType = (file) => {
        const type = file.type;
        const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        const isCorrectFileType = fileTypes.some((fileType) => type === fileType);
        return isCorrectFileType;
    };
    exports.validateFileType = validateFileType;
    const candidateLoadedFile = (inputSrc) => {
        if (!inputSrc.files[0]) {
            throw new Error('No file uploaded');
        }
        const file = inputSrc.files[0];
        return file;
    };
    exports.candidateLoadedFile = candidateLoadedFile;
    const sendCvDataToApi = (file) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const url = '/api/v1/cv-parser/parseresume';
        const formData = new FormData();
        formData.append('fileToParse', file, file.name);
        const settings = {
            method: 'POST',
            headers: {
                [Antiforgery_3.AntiforgeryHeaderName]: window.attraxAntiforgeryToken,
            },
            referrerPolicy: "origin",
            body: formData,
        };
        try {
            const response = yield fetch(url, settings);
            if (!response.ok) {
                throw new Error(`Error sending CV data: ${response.statusText}`);
            }
            const res = yield response.json();
            const firstName = (_a = res === null || res === void 0 ? void 0 : res.firstName.trim()) !== null && _a !== void 0 ? _a : '';
            const lastName = (_b = res === null || res === void 0 ? void 0 : res.lastName.trim()) !== null && _b !== void 0 ? _b : '';
            const email = (_c = res === null || res === void 0 ? void 0 : res.email.trim()) !== null && _c !== void 0 ? _c : '';
            const phone = (_d = res === null || res === void 0 ? void 0 : res.phone.trim()) !== null && _d !== void 0 ? _d : '';
            const formattedLocation = ((_e = res === null || res === void 0 ? void 0 : res.location) === null || _e === void 0 ? void 0 : _e.city) ? `${(_f = res === null || res === void 0 ? void 0 : res.location) === null || _f === void 0 ? void 0 : _f.city}, ${(_g = res === null || res === void 0 ? void 0 : res.location) === null || _g === void 0 ? void 0 : _g.country}` : '';
            const data = {
                firstName,
                lastName,
                email,
                phone,
                employmentHistory: (_h = res === null || res === void 0 ? void 0 : res.employmentHistory) !== null && _h !== void 0 ? _h : [],
                educationHistory: (_j = res === null || res === void 0 ? void 0 : res.educationHistory) !== null && _j !== void 0 ? _j : [],
                location: {
                    country: ((_k = res === null || res === void 0 ? void 0 : res.location) === null || _k === void 0 ? void 0 : _k.country) ? (_l = res === null || res === void 0 ? void 0 : res.location) === null || _l === void 0 ? void 0 : _l.country : '',
                    city: ((_m = res === null || res === void 0 ? void 0 : res.location) === null || _m === void 0 ? void 0 : _m.city) ? (_o = res === null || res === void 0 ? void 0 : res.location) === null || _o === void 0 ? void 0 : _o.city : '',
                    formattedLocation: formattedLocation ? formattedLocation : '',
                }
            };
            return data;
        }
        catch (error) {
            throw new Error(`Error sending CV data: ${error}`);
        }
    });
    const cacheDataInSessionStorage = (data) => {
        window.sessionStorage.setItem('cvData', JSON.stringify(data));
    };
    exports.cacheDataInSessionStorage = cacheDataInSessionStorage;
    const getCachedCvData = () => {
        const data = sessionStorage.getItem('cvData');
        return JSON.parse(data);
    };
    exports.getCachedCvData = getCachedCvData;
    const removeCachedCvData = () => {
        sessionStorage.removeItem('cvData');
    };
    exports.removeCachedCvData = removeCachedCvData;
    const uploadFileToUploadCv = (file) => {
        const cvUploader = document.querySelector('.attrax-form-item__cv-upload-hidden');
        if (!cvUploader || !file) {
            return;
        }
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;
        cvUploader.files = fileList;
        cvUploader.dispatchEvent(new Event('change', { bubbles: true }));
    };
    exports.uploadFileToUploadCv = uploadFileToUploadCv;
    const addRows = (source, selector) => {
        const addRowButton = document.querySelector(`.${selector}__add-new`);
        if (!source || !addRowButton) {
            return;
        }
        ;
        addRowButton.click();
        for (let i = 0; i < source.length - 1; i++) {
            addRowButton.click();
        }
    };
    exports.addRows = addRows;
    const populateMultipleFields = (source, entrySelector) => {
        const entries = document.querySelectorAll(entrySelector);
        if (!source || !entries) {
            return;
        }
        entries.forEach((entry, index) => {
            var _a;
            const sourceItem = source[index];
            if (!sourceItem) {
                console.error(`No source item for index ${index}`);
                return;
            }
            const fields = entry.querySelectorAll('[data-populated-by]');
            const fieldNames = Array.from(fields).map((field) => field.getAttribute('data-populated-by'));
            const commitBtn = entry.querySelector('.commit-entry');
            fieldNames.forEach((fieldName) => {
                const field = entry.querySelector(`[data-populated-by="${fieldName}"]`);
                field.value = source[index][fieldName] ? source[index][fieldName] : '';
                if (fieldName === 'begin' || fieldName === 'end') {
                    field.value = source[index][fieldName] ? (0, exports.convertISODateToInputDate)(source[index][fieldName]) : '';
                }
                if (fieldName === 'location-display') {
                    field.value = source[index]['location'] ? source[index]['location'] : '';
                }
            });
            Array.from(entry.querySelectorAll('input[data-populated-by]:not(input[data-populated-by="current"])')).forEach((field) => {
                if (field.value !== '') {
                    field.classList.add('attrax-form-item--valid');
                }
            });
            const allFieldsHaveValue = Array.from(entry.querySelectorAll('input[data-populated-by]:not(input[data-populated-by="current"])')).every((field) => field.value !== '');
            if (allFieldsHaveValue) {
                (_a = entry.querySelector('.details-container')) === null || _a === void 0 ? void 0 : _a.classList.add('details-container--valid');
                commitBtn.click();
            }
        });
    };
    exports.populateMultipleFields = populateMultipleFields;
    const convertISODateToInputDate = (isoDateString) => {
        let date = new Date(isoDateString);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    exports.convertISODateToInputDate = convertISODateToInputDate;
    const handleFileUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessages = document.querySelectorAll('.fileparser__error-message');
        document.querySelector('.fileparser__inner-container').classList.add('loading');
        (0, exports.removeCachedCvData)();
        errorMessages.forEach((message) => {
            message.classList.add('hidden');
        });
        document.querySelector('.fileparser__success-message').classList.add('hidden');
        const uploadIsValidType = (0, exports.validateFileType)(file);
        if (!uploadIsValidType) {
            document.querySelector('.fileparser__inner-container').classList.remove('loading');
            document.querySelector('.fileparser__error-message--wrong-file-type').classList.remove('hidden');
            return;
        }
        try {
            const data = yield sendCvDataToApi(file);
            if (!data) {
                document.querySelector('.fileparser__inner-container').classList.remove('loading');
                document.querySelector('.fileparser__error-message--wrong-file-type');
                return;
            }
            document.querySelector('.fileparser__inner-container').classList.remove('loading');
            const fileName = file.name;
            const successMessage = document.querySelector('.fileparser__success-message');
            successMessage.querySelector('.file-name').innerHTML = fileName;
            successMessage.classList.remove('hidden');
            (0, exports.cacheDataInSessionStorage)(data);
            updateDomWithData(data, file);
        }
        catch (error) {
            document.querySelector('.fileparser__inner-container').classList.remove('loading');
            document.querySelector('.fileparser__error-message--upload-failed').classList.remove('hidden');
            console.error(error);
        }
    });
    const populateFields = (selector, dataSrc) => {
        const fields = document === null || document === void 0 ? void 0 : document.querySelectorAll(`[data-populated-by="${selector}"]`);
        fields.forEach((field) => {
            field.value = dataSrc ? dataSrc : '';
        });
    };
    exports.populateFields = populateFields;
    const updateDomWithData = (data, file) => {
        const { firstName, lastName, email, phone, employmentHistory, educationHistory, location } = data;
        (0, exports.uploadFileToUploadCv)(file);
        (0, exports.addRows)(data.employmentHistory, 'candidate-work-experience');
        (0, exports.addRows)(data.educationHistory, 'candidate-education');
        (0, exports.populateFields)('firstname', firstName);
        (0, exports.populateFields)('lastname', lastName);
        (0, exports.populateFields)('email', email);
        (0, exports.populateFields)('phone', phone);
        (0, exports.populateMultipleFields)(employmentHistory, '.candidate-work-experience__entries .entry-container');
        (0, exports.populateMultipleFields)(educationHistory, '.candidate-education__entries .entry-container');
        (0, exports.populateFields)('por-location-display-string', location.formattedLocation);
        (0, exports.populateFields)('por-location', location.formattedLocation);
        (0, exports.populateFields)('por-city', location.formattedLocation);
        (0, exports.populateFields)('por-country-code', location.country);
    };
});
define("Utility/Accessibility", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeMultiSelectFocusable = exports.AttraxAccessibilityFunctions = void 0;
    const AttraxAccessibilityFunctions = () => {
        (0, exports.makeMultiSelectFocusable)();
    };
    exports.AttraxAccessibilityFunctions = AttraxAccessibilityFunctions;
    const makeMultiSelectFocusable = () => {
        const multiSelectArray = document.querySelectorAll('.smartrecruiters-multiselect');
        multiSelectArray.forEach((multiSelect) => {
            multiSelect.addEventListener('focus', (event) => {
                const target = event.target;
                const rendered = target.querySelector('.select2-selection__rendered');
                if (rendered && !rendered.hasAttribute('tabindex')) {
                    multiSelect.blur();
                    multiSelect.setAttribute('tabindex', '-1');
                    rendered.setAttribute('tabindex', '0');
                }
            });
        });
    };
    exports.makeMultiSelectFocusable = makeMultiSelectFocusable;
});
define("Utility/HtmlCleaner", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UndoExtensionModifications = void 0;
    function UndoExtensionModifications() {
        document
            .querySelectorAll("grammarly-extension, [data-dashlanecreated]")
            .forEach(x => x.remove());
        document
            .querySelectorAll("[data-dashlane-rid]")
            .forEach(x => x.removeAttribute("data-dashlane-rid"));
        document
            .querySelectorAll("[data-dashlane-classification]")
            .forEach(x => x.removeAttribute("data-dashlane-classification"));
    }
    exports.UndoExtensionModifications = UndoExtensionModifications;
});
define("Maps/AttraxMapWidgetConfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Maps/AttraxMapWidgetState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Maps/GeoJsonService", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCountryInfoGeoJson = exports.getJobsGeoJsonByIdSlim = exports.getGeoJsonForDisplayList = exports.getJobsGeoJson = void 0;
    const getJobsGeoJson = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = '/api/v1/jobs/geojson';
        try {
            const response = yield fetch(url, {
                method: 'GET',
                referrerPolicy: 'origin',
            });
            if (!response.ok) {
                const errorDetails = yield response.text();
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    });
    exports.getJobsGeoJson = getJobsGeoJson;
    const getGeoJsonForDisplayList = (displaylistid) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `/api/v1/jobs/optionbasedgeojson/${displaylistid}`;
        try {
            const response = yield fetch(url, {
                method: 'GET',
                referrerPolicy: 'origin',
            });
            if (!response.ok) {
                const errorDetails = yield response.text();
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    });
    exports.getGeoJsonForDisplayList = getGeoJsonForDisplayList;
    const getJobsGeoJsonByIdSlim = (jobIds, stateContext) => __awaiter(void 0, void 0, void 0, function* () {
        const url = '/api/v1/jobs/slimdata';
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                referrerPolicy: 'origin',
                body: JSON.stringify({
                    vacancyIds: jobIds
                }),
            });
            if (!response.ok) {
                const errorDetails = yield response.text();
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`);
            }
            const res = yield response.json();
            return res.vacanciesSlimData;
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    });
    exports.getJobsGeoJsonByIdSlim = getJobsGeoJsonByIdSlim;
    const getCountryInfoGeoJson = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = `/Data/mapData_filtered.json?v=${window.buildVersion || 'none'}`;
        try {
            const response = yield fetch(url, {
                method: 'GET',
                referrerPolicy: 'origin',
            });
            if (!response.ok) {
                const errorDetails = yield response.text();
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    });
    exports.getCountryInfoGeoJson = getCountryInfoGeoJson;
});
define("OlTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Maps/MapWidgetEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapWidgetEvents = void 0;
    exports.MapWidgetEvents = {
        onMapWidgetPopupCreated: 'onMapWidgetPopupCreated',
    };
});
define("Maps/OpenLayerMap", ["require", "exports", "Maps/GeoJsonService", "Maps/MapWidgetEvents"], function (require, exports, GeoJsonService_1, MapWidgetEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HydrateMapWidgets = void 0;
    const HydrateMapWidgets = (ol) => {
        try {
            const mapContainers = document.querySelectorAll('.attrax-map-widget__container');
            mapContainers.forEach((container) => __awaiter(void 0, void 0, void 0, function* () {
                const context = {
                    jobIds: [],
                    paginatedJobIds: [],
                    paginationIndex: 0,
                    paginationSize: 10,
                    jobsData: [],
                    map: null,
                    mapElement: container.querySelector(".attrax-map-widget__map"),
                    mapElementContainer: container,
                    popupContainer: null,
                    popupContent: null,
                    popupOverlay: null,
                    config: createConfigurationFromElement(container),
                    jobsContainer: container.querySelector(".attrax-map-widget__jobscontainer"),
                    paginationNextEl: container.querySelector(".attrax-map-widget__loadjobs"),
                };
                context.map = yield hydrateMap(context.mapElement, context.config, ol);
                createPopups(context, ol);
                addMapClickHandlers(context, ol);
            }));
        }
        catch (e) {
            console.error('Fatal error initializing map widgets:', e);
        }
    };
    exports.HydrateMapWidgets = HydrateMapWidgets;
    const hydrateMap = (mapEl, config, ol) => __awaiter(void 0, void 0, void 0, function* () {
        const data = config.useOptionDisplayListMode ?
            yield (0, GeoJsonService_1.getGeoJsonForDisplayList)(config.displayListId)
            :
                yield (0, GeoJsonService_1.getJobsGeoJson)();
        const getComputedStyleValue = (element, property, fallback) => {
            return getComputedStyle(element).getPropertyValue(property).trim() || fallback;
        };
        const vectorLayer = (container) => __awaiter(void 0, void 0, void 0, function* () {
            const countryCodes = new Set(data.features.map(feature => { var _a; return (_a = feature.properties.locationReference) === null || _a === void 0 ? void 0 : _a.toLowerCase(); }));
            const mapColour = getComputedStyleValue(container, '--map-feature-country-color', getComputedStyleValue(container, '--attrax-site-color-primary', '#8e9091'));
            const mapColourLight = getComputedStyleValue(container, '--map-feature-country-color-light', getComputedStyleValue(container, '--attrax-site-color-secondary', '#c2c3c4'));
            const strokeColour = getComputedStyleValue(container, '--map-feature-stroke-color', getComputedStyleValue(container, '--attrax-site-color-secondary', 'white'));
            const countryInfoJson = yield (0, GeoJsonService_1.getCountryInfoGeoJson)();
            countryInfoJson.features.forEach(feature => {
                var _a;
                feature.properties.COLOR = mapColourLight;
                if (countryCodes.has((_a = feature.properties.iso_a2_eh) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                    feature.properties.COLOR = mapColour;
                }
            });
            const features = new ol.GeoJSON().readFeatures(countryInfoJson, {
                featureProjection: 'EPSG:3857'
            });
            const vectorSource = new ol.VectorSource({
                wrapX: true
            });
            vectorSource.addFeatures(features);
            return new ol.WebGLVectorLayer({
                source: vectorSource,
                renderBuffer: 2500,
                style: {
                    'fill-color': ['get', 'COLOR'],
                    'fill-opacity': ['number', 0.5],
                    'stroke-color': strokeColour,
                },
            });
        });
        const vector = yield vectorLayer(mapEl);
        const featureLayer = createFeatureLayer(data, mapEl, config, ol);
        const seaColour = getComputedStyleValue(mapEl, '--map-feature-sea-colour', getComputedStyleValue(mapEl, '--attrax-site-color-tertiary', 'white'));
        mapEl.style.backgroundColor = seaColour;
        const map = new ol.Map({
            controls: [new ol.Attribution({ collapsed: true })],
            target: mapEl,
            layers: [
                vector,
                featureLayer,
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([10, 50]),
                zoom: config.initialZoom,
                minZoom: 0,
                maxZoom: config.clusterMaxZoom,
                extent: ol.proj.transformExtent([-190, -85, 190, 85], 'EPSG:4326', 'EPSG:3857')
            })
        });
        centerMapPosition(map, config, ol);
        return map;
    });
    const createConfigurationFromElement = (map) => {
        return {
            clusterMaxZoom: parseInt(map.getAttribute('data-cluster-max-zoom') || '0'),
            centerLatitude: parseFloat(map.getAttribute('data-lat') || '0'),
            centerLongitude: parseFloat(map.getAttribute('data-long') || '0'),
            centerOnUserLocation: map.getAttribute('data-userlocation').toLowerCase() === 'true',
            useOptionDisplayListMode: map.getAttribute('data-isoptionbased').toLowerCase() === 'true',
            displayListId: map.getAttribute('data-displaylistid') || "",
            initialZoom: parseInt(map.getAttribute('data-inital-zoom'))
        };
    };
    const createPopups = (state, ol) => {
        const popupContainer = document.createElement('div');
        popupContainer.classList.add("attrax-map-widget__popup");
        const popupContent = document.createElement('div');
        popupContent.classList.add("attrax-map-widget__content");
        popupContainer.appendChild(popupContent);
        state.mapElementContainer.appendChild(popupContainer);
        const popupOverlay = new ol.Overlay({
            element: popupContainer,
            autoPan: false,
            autoPanAnimation: {
                duration: 250
            }
        });
        state.popupContainer = popupContainer;
        state.popupContent = popupContent;
        state.popupOverlay = popupOverlay;
        state.map.addOverlay(popupOverlay);
    };
    const getComputedStyleValue = (element, property, fallback) => {
        return getComputedStyle(element).getPropertyValue(property).trim() || fallback;
    };
    const createFeatureLayer = (data, mapContainer, config, ol) => {
        const featureSource = new ol.VectorSource({
            wrapX: false,
            features: new ol.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            })
        });
        const clusterSource = new ol.Cluster({ wrapX: false, distance: 50, source: featureSource });
        const circleFillColor = getComputedStyleValue(mapContainer, '--attrax-site-color-secondary', getComputedStyleValue(mapContainer, '--map-feature-bg-color', 'black'));
        const circleFontColor = getComputedStyle(mapContainer).getPropertyValue('--map-feature-font-color') || 'white';
        const circleFont = getComputedStyle(mapContainer).getPropertyValue('--map-feature-font') || 'bold 12px Arial';
        const circleSize = getComputedStyle(mapContainer).getPropertyValue('--map-feature-size') || '15';
        return new ol.VectorLayer({
            source: clusterSource,
            renderBuffer: 2500,
            style: function (clusterFeature) {
                const features = clusterFeature.get('features');
                let vacanciesCount = features.length;
                if (config.useOptionDisplayListMode) {
                    vacanciesCount = features.reduce(function (total, f) {
                        return total + (f.getProperties().vacancyCount || 0);
                    }, 0);
                }
                return new ol.Style({
                    image: new ol.Circle({
                        radius: circleSize,
                        fill: new ol.Fill({
                            color: circleFillColor
                        })
                    }),
                    text: new ol.Text({
                        font: circleFont,
                        text: vacanciesCount,
                        fill: new ol.Fill({
                            color: circleFontColor
                        })
                    })
                });
            }
        });
    };
    const addMapClickHandlers = (state, ol) => {
        const { map, popupContainer, popupContent, config, popupOverlay } = state;
        map.on('click', (evt) => __awaiter(void 0, void 0, void 0, function* () {
            popupContainer.style.display = 'none';
            const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
            if (!feature) {
                return;
            }
            const features = feature.get("features");
            if (!features)
                return;
            const isCluster = features.length > 1;
            const isDisplayListOptionMarker = config.useOptionDisplayListMode && features.length === 1;
            if (!config.useOptionDisplayListMode) {
                const jobIds = features.map(f => f.getProperties().vacancyId);
                yield onJobListSelected(state, jobIds);
                return;
            }
            if (isCluster) {
                let extent = ol.createEmpty();
                features.forEach(function (f) {
                    ol.extend(extent, f.getGeometry().getExtent());
                });
                map.getView().fit(extent, {
                    duration: 500,
                    padding: [50, 50, 50, 50],
                    maxZoom: map.getView().getZoom() + 2
                });
                popupContainer.style.display = 'none';
                return;
            }
            if (isDisplayListOptionMarker) {
                evt.stopPropagation();
                popupContainer.style.display = 'none';
                const coordinates = feature.getGeometry().getCoordinates();
                popupOverlay.setPosition(coordinates);
                const firstFeature = features[0];
                const properties = firstFeature.getProperties();
                const title = '__js.map-pop-up-sub-title__'
                    .replaceAll("{map-country-name}", properties.displayName)
                    .replaceAll("{map-job-count}", properties.vacancyCount.toString());
                popupContent.innerHTML = '' +
                    '<p class="attrax-map-widget__popup-title">' + title + '</p>' +
                    '   <p class="attrax-map-widget__popup-text">' +
                    (properties.landingUrl ? '<a aria-label="Go to ' + properties.displayName + '" class="attrax-map-widget__popup-link" href="' + properties.landingUrl + '" target="_blank"></a>' : '') +
                    '</p>';
                map.getTargetElement().dispatchEvent(new CustomEvent(MapWidgetEvents_1.MapWidgetEvents.onMapWidgetPopupCreated, {
                    detail: {
                        target: popupContainer,
                        feature: properties
                    }
                }));
                popupContainer.classList.remove("attrax-map-widget__popup--left");
                popupContainer.classList.remove("attrax-map-widget__popup--right");
                popupContainer.style.display = "block";
                const isOffscreenRight = popupContainer.getBoundingClientRect().right > window.innerWidth;
                if (isOffscreenRight) {
                    popupContainer.classList.add("attrax-map-widget__popup--left");
                }
                return false;
            }
        }));
        state.paginationNextEl.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setPaginationPage(state, state.paginationIndex + 1);
        }));
    };
    const onJobListSelected = (stateContext, jobIds) => __awaiter(void 0, void 0, void 0, function* () {
        stateContext.jobsContainer.innerHTML = '';
        stateContext.jobIds = jobIds;
        yield setPaginationPage(stateContext, 0);
    });
    const setPaginationPage = (stateContext, page) => __awaiter(void 0, void 0, void 0, function* () {
        stateContext.paginationIndex = page;
        const from = stateContext.paginationIndex * stateContext.paginationSize;
        const to = (stateContext.paginationIndex + 1) * stateContext.paginationSize;
        stateContext.paginatedJobIds = stateContext.jobIds.slice(from, to);
        console.log(`Showing jobs on map from ${from} to ${to}. Note: Client CSS may hide __jobs container`);
        if (to >= stateContext.jobIds.length) {
            stateContext.paginationNextEl.classList.add('attrax-map-widget__loadjobs--hidden');
        }
        else {
            stateContext.paginationNextEl.classList.remove('attrax-map-widget__loadjobs--hidden');
        }
        yield onPageDataSelected(stateContext);
    });
    const onPageDataSelected = (stateContext) => __awaiter(void 0, void 0, void 0, function* () {
        stateContext.jobsData = yield (0, GeoJsonService_1.getJobsGeoJsonByIdSlim)(stateContext.paginatedJobIds, stateContext);
        renderJobs(stateContext.jobsContainer, stateContext.jobsData);
    });
    const renderJobs = (container, jobsData) => {
        container.innerHTML = '';
        jobsData.forEach((job) => {
            const jobElement = document.createElement('div');
            jobElement.classList.add("attrax-map-widget__job");
            jobElement.innerHTML = '' +
                '<p class="attrax-map-widget__job-title">' + job.title + '</p>' +
                '<p class="attrax-map-widget__job-text">' + job.shortDescription + '</p>';
            container.appendChild(jobElement);
        });
    };
    const centerMapPosition = (map, config, ol) => {
        const useWidgetConfigPosition = () => {
            const ctr = ol.proj.fromLonLat([config.centerLongitude, config.centerLatitude]);
            map.getView().setCenter(ctr);
        };
        if (!config.centerOnUserLocation || !navigator.geolocation) {
            useWidgetConfigPosition();
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = ol.proj.fromLonLat([longitude, latitude]);
            map.getView().setCenter(userLocation);
        }, (error) => {
            console.error("Failed to get users location for map centering. Falling back to widget configuration.", error);
            useWidgetConfigPosition();
        });
    };
});
define("Handlers/AdminToolBarHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdminToolBarHandler = void 0;
    const AdminToolBarHandler = () => {
        let _isMinimised = isMinimised();
        const toolbar = document.querySelector('#cop-outer-toolbar');
        const body = document.querySelector('body');
        const toggleButton = document.querySelector('#admin-toolbar-logo');
        if (!toolbar)
            return;
        updateToolbarView(_isMinimised, toolbar, body);
        toggleButton.addEventListener("click", () => {
            _isMinimised = !isMinimised();
            setMinimised(_isMinimised);
            updateToolbarView(_isMinimised, toolbar, body);
        });
    };
    exports.AdminToolBarHandler = AdminToolBarHandler;
    const updateToolbarView = (isMinimised, toolbar, body) => {
        if (isMinimised) {
            hideToolbar(toolbar, body);
        }
        else {
            showToolbar(toolbar, body);
        }
    };
    const showToolbar = (toolbar, body) => {
        toolbar.classList.remove("minimise");
        toolbar.classList.add("expanded");
        body.classList.remove("admin-minimise");
        body.classList.add("admin-expanded");
    };
    const hideToolbar = (toolbar, body) => {
        toolbar.classList.add("minimise");
        toolbar.classList.remove("expanded");
        body.classList.add("admin-minimise");
        body.classList.remove("admin-expanded");
    };
    const isMinimised = () => {
        const state = sessionStorage.getItem('toggleState');
        return state === "minimised";
    };
    const setMinimised = (isMinimised) => {
        sessionStorage.setItem('toggleState', isMinimised ? 'minimised' : 'expanded');
    };
});
define("Cookies/CookieManager", ["require", "exports", "Utility/Antiforgery"], function (require, exports, Antiforgery_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CookieManager = void 0;
    class CookieManager {
        SetAll(allModel) {
            return CookieManager.setAllCookieConsent(allModel).then(response => {
                document.dispatchEvent(new Event('setAllCookieConsent'));
                return response;
            });
        }
    }
    exports.CookieManager = CookieManager;
    CookieManager.setAllCookieConsent = (consent) => {
        const payload = {
            consent: consent,
            sourceTracking: {
                url: window.location.href,
            }
        };
        const requestHeaders = {
            'Content-Type': 'application/json',
            [Antiforgery_4.AntiforgeryHeaderName]: window.attraxAntiforgeryToken
        };
        if (document.referrer) {
            requestHeaders['X-Visit-Referer'] = document.referrer;
        }
        return fetch(window.siteUrlPrefix + 'api/v1/cookieconsent/set/all', {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(payload),
        });
    };
});
define("Modules/AutoCompleteSuggestions", ["require", "exports", "jqueryautocomplete", "jquery"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandleAutoCompleteSuggestions = void 0;
    function HandleAutoCompleteSuggestions() {
        let searchTimeout;
        let drawId = "";
        const isPaqEnabled = window.paqEnabled;
        const autocompleteOptions = {
            triggerSelectOnValidInput: false,
            lookup: function (query, done) {
                clearTimeout(searchTimeout);
                if (query.length < 3) {
                    done({ suggestions: [] });
                    return;
                }
                searchTimeout = setTimeout(function () {
                    drawId = window.performance.now().toString() + Math.random().toString();
                    fetch(siteDetails.UrlPrefix + "api/v1/suggestions/query/" + siteDetails.SiteId + "/" + drawId + "/" + query, { referrerPolicy: "strict-origin" })
                        .then(result => result.json())
                        .then(json => {
                        if (json.draw === drawId) {
                            done({ suggestions: json.suggestions });
                        }
                    });
                }, 200);
            },
            onSelect: function (suggestion) {
                if (suggestion.type == 0) {
                    if (window.searchOnSuggestionSelection) {
                        $(this)
                            .closest(".search-widget")
                            .find(".jobsearchinput")
                            .val(suggestion.data);
                        $(this)
                            .closest(".search-widget")
                            .find(".jobsearchsubmit")
                            .click();
                    }
                    else {
                        $(this)
                            .closest(".search-widget")
                            .find(".jobsearchinput")
                            .val(suggestion.data);
                        $(".isautocomplete").val(suggestion.data);
                    }
                }
                else if (suggestion.type === 1) {
                    if (isPaqEnabled && window._paq) {
                        window._paq.push([
                            "trackEvent",
                            "AutoCompleteSuggestion",
                            "AutoCompleteSuggestionVacancyId ",
                            suggestion.Id,
                        ]);
                    }
                    window.location.href =
                        window.location.protocol +
                            "//" +
                            window.location.host +
                            window.siteUrlPrefix +
                            suggestion.data;
                }
                else if (suggestion.type === 2) {
                    if (isPaqEnabled && window._paq) {
                        window._paq.push([
                            "trackEvent",
                            "AutoCompleteSuggestion",
                            "AutoCompleteSuggestionPostId ",
                            suggestion.Id,
                        ]);
                    }
                    window.location.href =
                        window.location.protocol +
                            "//" +
                            window.location.host +
                            window.siteUrlPrefix +
                            suggestion.data;
                }
                else if (suggestion.type === 3) {
                    if (isPaqEnabled && window._paq) {
                        window._paq.push([
                            "trackEvent",
                            "AutoCompleteSuggestion",
                            "AutoCompleteSuggestionRecruiterId ",
                            suggestion.Id,
                        ]);
                    }
                    window.location.href =
                        window.location.protocol +
                            "//" +
                            window.location.host +
                            window.siteUrlPrefix +
                            "profile" +
                            "/" +
                            suggestion.data;
                }
            },
        };
        $(".isautocomplete, .attrax-search-widget__search-input .attrax-form-item__input")
            .each(function () {
            const $this = $(this);
            const options = Object.assign({}, autocompleteOptions);
            const widgetClasses = [
                'cop-widget', 'dynamic-widget', 'attrax-search-widget', 'search-widget'
            ];
            const $searchWidget = $this.closest('.attrax-search-widget');
            if ($searchWidget.length) {
                options.containerClass = "autocomplete-suggestions";
                const widgetClassString = $searchWidget.attr('class');
                if (widgetClassString) {
                    const allWidgetClasses = widgetClassString.split(/\s+/);
                    const customClasses = allWidgetClasses.filter(cls => widgetClasses.indexOf(cls) === -1);
                    if (customClasses.length > 0) {
                        options.containerClass += " " + customClasses.join(' ');
                    }
                }
            }
            $this.devbridgeAutocomplete(options);
        });
    }
    exports.HandleAutoCompleteSuggestions = HandleAutoCompleteSuggestions;
});
define("Handlers/AccessibilityNavKeyboardHandlers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddAccessibleNavigationHandlers = void 0;
    const AddAccessibleNavigationHandlers = () => {
        const accessibileNavs = document.querySelectorAll(".attrax-accessible-navigation");
        accessibileNavs.forEach(accessibileNav => {
            const className = "attrax-child-nav-trigger";
            const allHasChildren = accessibileNav.querySelectorAll("nav:not(.attrax-visible-children) .hasChildren");
            const navIcons = accessibileNav.querySelectorAll(".navList .icon");
            allHasChildren.forEach((hasChildren) => {
                hasChildren.setAttribute("aria-expanded", "false");
                hasChildren.setAttribute("aria-haspopup", "true");
                const childElements = hasChildren.querySelectorAll(".navList:not(.navRoot)>li a, .navList:not(.navRoot)>li .icon");
                childElements.forEach(el => el.setAttribute("tabindex", "-1"));
            });
            navIcons.forEach((icon) => {
                icon.addEventListener("focus", () => {
                    var _a;
                    const isPartOfRootNav = (_a = icon === null || icon === void 0 ? void 0 : icon.closest(".navList")) === null || _a === void 0 ? void 0 : _a.classList.contains("navRoot");
                    if (isPartOfRootNav) {
                        closeAllSubmenus(allHasChildren);
                    }
                });
                icon.addEventListener("keydown", (event) => {
                    const element = event.target;
                    const keyStroke = event.key;
                    const parentHasChildren = element.closest(".hasChildren");
                    if (element.classList.contains(className) && (isSpacebar(keyStroke) || isEnter(keyStroke))) {
                        event.preventDefault();
                        if (parentHasChildren) {
                            const isExpanded = parentHasChildren.getAttribute("aria-expanded") === "true";
                            if (isExpanded) {
                                closeSubmenu(parentHasChildren);
                            }
                            else {
                                openSubmenu(parentHasChildren);
                                const firstItem = parentHasChildren.querySelector(".navList:not(.navRoot)>li a, .navList:not(.navRoot)>li .icon");
                                if (firstItem) {
                                    firstItem.focus();
                                }
                            }
                        }
                    }
                    if (keyStroke === "Escape" && parentHasChildren) {
                        const isExpanded = parentHasChildren.getAttribute("aria-expanded") === "true";
                        if (isExpanded) {
                            event.preventDefault();
                            closeSubmenu(parentHasChildren);
                            const trigger = parentHasChildren.querySelector(`.${className}`);
                            if (trigger instanceof HTMLElement) {
                                trigger.focus();
                            }
                        }
                    }
                });
            });
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    const activeSubmenu = accessibileNav.querySelector(".attrax-child-nav-active");
                    if (activeSubmenu instanceof HTMLElement) {
                        closeSubmenu(activeSubmenu);
                        const trigger = activeSubmenu.querySelector(`.${className}`);
                        if (trigger instanceof HTMLElement) {
                            trigger.focus();
                        }
                    }
                    return;
                }
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    handleArrowNavigation(event);
                }
            });
        });
    };
    exports.AddAccessibleNavigationHandlers = AddAccessibleNavigationHandlers;
    const isSpacebar = (keystroke) => keystroke === " ";
    const isEnter = (keystroke) => keystroke === "Enter";
    const handleArrowNavigation = (event) => {
        const key = event.key;
        const target = event.target;
        if (key === "ArrowDown" || key === "ArrowUp") {
            event.preventDefault();
            const parentMenu = target.closest(".navList:not(.navRoot)");
            if (parentMenu) {
                const focusableItems = parentMenu.querySelectorAll(".attrax-nav__child-open > li > .text-node > a, .attrax-nav__child-open > li > .icon");
                let currentIndex = Array.from(focusableItems).indexOf(target);
                if (key === "ArrowDown") {
                    currentIndex = (currentIndex + 1) % focusableItems.length;
                }
                else if (key === "ArrowUp") {
                    currentIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
                }
                focusableItems[currentIndex].focus();
            }
        }
    };
    const handleTabIndexValueOfChildElements = (element, index) => {
        const parent = element.closest(".hasChildren");
        const tabableElements = parent === null || parent === void 0 ? void 0 : parent.querySelectorAll(".navList:not(.navRoot)>li a, .navList:not(.navRoot)>li .icon.attrax-child-nav-trigger");
        tabableElements === null || tabableElements === void 0 ? void 0 : tabableElements.forEach((el) => {
            el.setAttribute("tabindex", index);
        });
    };
    const openSubmenu = (hasChildren) => {
        var _a;
        const parentNavList = hasChildren.closest('.navList');
        if (parentNavList) {
            const siblingMenus = parentNavList.querySelectorAll('.hasChildren.attrax-child-nav-active');
            siblingMenus.forEach((menu) => {
                if (menu !== hasChildren && menu instanceof HTMLElement) {
                    closeSubmenu(menu);
                }
            });
        }
        hasChildren.classList.add("attrax-child-nav-active");
        hasChildren.setAttribute("aria-expanded", "true");
        const navList = hasChildren.querySelector(".navList");
        if (navList) {
            navList.classList.add("attrax-nav__child-open");
        }
        handleTabIndexValueOfChildElements(hasChildren, "0");
        const childNavList = hasChildren.querySelector('.navList');
        if (childNavList) {
            const listItems = childNavList.querySelectorAll('li');
            const focusItem = (_a = listItems[0]) === null || _a === void 0 ? void 0 : _a.querySelector('.text-node a');
            if (focusItem) {
                const attemptFocus = (element, maxAttempts = 10) => {
                    let attempts = 0;
                    const tryFocus = () => {
                        attempts++;
                        try {
                            element.setAttribute('tabindex', '0');
                            element.focus();
                            if (document.activeElement === element) {
                                return true;
                            }
                        }
                        catch (e) {
                            console.error('Focus error:', e);
                        }
                        if (attempts < maxAttempts) {
                            requestAnimationFrame(tryFocus);
                        }
                        else {
                            console.warn('Max focus attempts reached without success');
                        }
                        return false;
                    };
                    requestAnimationFrame(tryFocus);
                };
                attemptFocus(focusItem);
            }
        }
    };
    const closeSubmenu = (hasChildren) => {
        hasChildren.classList.remove("attrax-child-nav-active");
        hasChildren.setAttribute("aria-expanded", "false");
        const navList = hasChildren.querySelector(".navList");
        if (navList) {
            navList.classList.remove("attrax-nav__child-open");
        }
        handleTabIndexValueOfChildElements(hasChildren, "-1");
    };
    const closeAllSubmenus = (allHasChildren) => {
        allHasChildren.forEach((hasChildren) => {
            closeSubmenu(hasChildren);
        });
    };
});
define("Personalisation/GeoLocationService", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeoLocationService = void 0;
    class GeoLocationService {
        constructor() {
            this.setLocationFromBrowser = (url) => {
                return new Promise((resolve, reject) => {
                    if (!("geolocation" in navigator)) {
                        reject("Geolocation not supported");
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        fetch(url + `/${latitude}/${longitude}`, {
                            method: 'GET'
                        })
                            .then(response => {
                            if (response.ok) {
                                resolve();
                            }
                            else {
                                reject(`Fetch failed with status: ${response.status}`);
                            }
                        })
                            .catch(error => {
                            reject(`Fetch error: ${error}`);
                        });
                    }, error => {
                        reject(`Geolocation error: ${error.message}`);
                    });
                });
            };
        }
        TrySetBrowserGeolocation() {
            const url = window.siteUrlPrefix + 'api/v1/personalisation/setlocation';
            if (window.geoLocationTrySetBrowserGeolocation) {
                this.setLocationFromBrowser(url)
                    .then(() => {
                    location.reload();
                });
            }
            else if (window.geoLocationWaitForConsent) {
                document.addEventListener("setAllCookieConsent", (e) => {
                    this.setLocationFromBrowser(url)
                        .then(() => {
                        location.reload();
                    });
                });
            }
        }
    }
    exports.GeoLocationService = GeoLocationService;
});
define("AttraxApplication", ["require", "exports", "Legacy/site", "Handlers/ModalHandler", "Handlers/FormValidationHandler", "Handlers/CopOptionsV2Handler", "Forms/FormsService", "Handlers/HarriFormWorkflowHandler", "PushNotifications/OneSignalPushNotificationsHandler", "Handlers/PushNotificationUtilityHandler", "Handlers/NavKeyboardHandlers", "WorkflowSteps/SmartRecruitersScreeningQuestionsHandler", "Handlers/SmartRecruitersFormsHandlers", "Handlers/AutoSuggestions", "Handlers/ManualLocationSelect", "Handlers/CvParsing", "Utility/Accessibility", "Utility/HtmlCleaner", "Handlers/AdminToolBarHandler", "Cookies/CookieManager", "Modules/AutoCompleteSuggestions", "Handlers/AccessibilityNavKeyboardHandlers", "Personalisation/GeoLocationService"], function (require, exports, site_2, ModalHandler_1, FormValidationHandler_2, CopOptionsV2Handler_1, FormsService_1, HarriFormWorkflowHandler_1, OneSignalPushNotificationsHandler_1, PushNotificationUtilityHandler_2, AccessibleHandlers, SmartRecruitersScreeningQuestions, SmartRecruitersFormHandler, AutoSuggestions_2, ManualLocationSelect_1, CvParsing_1, Accessibility_1, HtmlCleaner_1, AdminToolBarHandler_1, CookieManager_1, AutoCompleteSuggestions_1, AccessibilityNavKeyboardHandlers_1, GeoLocationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttraxApplication = void 0;
    class AttraxApplication {
        constructor($, details) {
            this.$ = $;
            this.SiteDetails = details;
            this.Window = window;
            this.PushNotificationsHandler = new OneSignalPushNotificationsHandler_1.OneSignalPushNotificationsHandler($);
            this.CookieManager = new CookieManager_1.CookieManager();
        }
        onDocumentReady() {
            site_2.LegacySiteJs.InitializeSite();
            window.LegacySiteJs = site_2.LegacySiteJs;
            setTimeout(() => {
                this.PushNotificationsHandler.Load();
            }, 2500);
            (0, HtmlCleaner_1.UndoExtensionModifications)();
            this.FormValidationHandler = new FormValidationHandler_2.FormValidationHandler(this);
            this.FormsService = new FormsService_1.FormsService(this);
            this.CopOptionsV2Handler = new CopOptionsV2Handler_1.CopOptionsV2Handler(this);
            this.HarriFormsHandler = new HarriFormWorkflowHandler_1.HarriFormWorkflowHandler(this);
            this.FormValidationHandler.AddValidateOnSubmitHandler();
            this.FormsService.AddLabelClickHandlers();
            this.FormsService.AddWidgetHandlers();
            this.HarriFormsHandler.OnDocumentReady();
            ModalHandler_1.ModalHandler.Handle($);
            SmartRecruitersFormHandler.AddSmartRecruitersFormHandlers($);
            SmartRecruitersFormHandler.WorkEducationEventListeners();
            (0, Accessibility_1.AttraxAccessibilityFunctions)();
            (0, AutoSuggestions_2.AutoSuggestions)();
            (0, ManualLocationSelect_1.ManualLocationSelect)();
            (0, CvParsing_1.AutoPopulateFromCV)();
            (0, AdminToolBarHandler_1.AdminToolBarHandler)();
            (0, AutoCompleteSuggestions_1.HandleAutoCompleteSuggestions)();
            (0, AccessibilityNavKeyboardHandlers_1.AddAccessibleNavigationHandlers)();
            PushNotificationUtilityHandler_2.PushNotificationUtilityHandler.Handle($, this.PushNotificationsHandler);
            AccessibleHandlers.AddAccessibleHandlers($);
            SmartRecruitersScreeningQuestions.HandleRepeatableRows($);
            new GeoLocationService_1.GeoLocationService().TrySetBrowserGeolocation();
        }
    }
    exports.AttraxApplication = AttraxApplication;
});
define("AttraxApplicationModule", ["require", "exports", "AttraxApplication", "ol", "Maps/OpenLayerMap", "jquery", "j_query_ui/dist/jquery-ui"], function (require, exports, AttraxApplication_1, ol, OpenLayerMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttraxApplicationBundle = void 0;
    (define)("sitejs", {});
    class AttraxApplicationBundle {
        constructor($, details) {
            this.details = details;
            this.app = new AttraxApplication_1.AttraxApplication($, details);
            const self = this;
            const olNew = {
                VectorLayer: ol.layer.Vector,
                WebGLVectorLayer: ol.layer.WebGLVector,
                VectorSource: ol.source.Vector,
                GeoJSON: ol.format.GeoJSON,
                Cluster: ol.source.Cluster,
                Circle: ol.style.Circle,
                Fill: ol.style.Fill,
                Style: ol.style.Style,
                Text: ol.style.Text,
                createEmpty: ol.extent.createEmpty,
                extend: ol.extent.extend,
                Attribution: ol.control.Attribution,
                Overlay: ol.Overlay,
                proj: ol.proj,
                Map: ol.Map,
                View: ol.View
            };
            $(document).ready(function () {
                self.app.onDocumentReady();
                (0, OpenLayerMap_1.HydrateMapWidgets)(olNew);
            });
        }
    }
    exports.AttraxApplicationBundle = AttraxApplicationBundle;
});
define("EventTracking/JobApplicationTrackingDetails", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JobApplicationTrackingDetails = void 0;
    class JobApplicationTrackingDetails {
        constructor() {
            this.applicationId = "";
            this.vacancyId = "";
            this.vacancyOptionIds = [];
            this.isCompletedApplication = false;
            this.adminUserId = "";
        }
    }
    exports.JobApplicationTrackingDetails = JobApplicationTrackingDetails;
});
define("EventTracking/EventTracking", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventTracking = void 0;
    class EventTracking {
        static TrackApplicationEvent(jobApplicationTrackingDetails) {
            const isCompletedApplication = jobApplicationTrackingDetails.isCompletedApplication;
            const stepName = !isCompletedApplication ?
                EventTracking.CategoryEventName.JobApplication.StepOneComplete : EventTracking.CategoryEventName.JobApplication.StepTwoComplete;
            const isPaqEnabled = window.paqEnabled;
            if (isPaqEnabled) {
                _paq.push(["trackEvent", "Applications", stepName, jobApplicationTrackingDetails.applicationId]);
            }
            if (isCompletedApplication) {
                if (jobApplicationTrackingDetails.adminUserId && isPaqEnabled) {
                    _paq.push(["trackEvent", "Applications", EventTracking.CategoryEventName.JobApplication.ByAdminUserId, jobApplicationTrackingDetails.adminUserId]);
                    for (let i = 0; i < jobApplicationTrackingDetails.vacancyOptionIds.length; i++) {
                        const optionId = jobApplicationTrackingDetails.vacancyOptionIds[i];
                        _paq.push(["trackEvent", "Applications", EventTracking.CategoryEventName.JobApplication.ByOptionId, optionId]);
                    }
                }
            }
        }
    }
    exports.EventTracking = EventTracking;
    EventTracking.CategoryNames = {
        JobApplication: "Applications"
    };
    EventTracking.CategoryEventName = {
        JobApplication: {
            StepOneComplete: "ApplicationStep1",
            StepTwoComplete: "ApplicationStep2",
            ByOptionId: "CompletedApplicationByOption",
            ByAdminUserId: "CompletedApplicationByAdminUser"
        }
    };
});
define("Legacy/jquery-global", ["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.$ = jquery_1.default;
    window.jQuery = jquery_1.default;
    exports.default = jquery_1.default;
});
