var config = {
    apiKey: '27d8dc882edcc50fa6db0baeaa260848d0b33cd3',
    product: 'PRO_MULTISITE',
    consentCookieExpiry: 360,
    logConsent: 'true',
    subDomains: 'false',
    closeStyle: 'button',
    encodeCookie: true,
    text: {
        title: 'Cookie preferences',
        intro: 'We and our partners use technologies such as cookies on our site to enhance your user experience, personalise content and advertisements, provide social media features, and analyse our traffic. Accept the recommended settings to consent to the use of this technology on our site. To change your consent choices at any time please use the toggles below.',
        acceptRecommended: 'Accept recommended settings',
        necessaryTitle: 'Essential cookies',
        necessaryDescription: 'Essential cookies enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies; they can only be disabled by changing your browser preferences.',
        closeLabel: 'Save and close'
    },
    statement: {
        description: 'For further details, see our ',
        name: 'Cookie Policy',
        url: 'https://www.hants.gov.uk/aboutthecouncil/privacy/cookie-policy',
        updated: '14/10/2019'
    },
    necessaryCookies: ['ASP.NET_SessionId', 'website*', 'citrix_ns_id', 'citrixns_id.hants.gov.uk_/_wlf', 'citrixns_id.hants.gov.uk_/_wat', 'amlbcookie', 'HccIdentity', '.ASPXAUTH', 'HantswebReturnUrl', '.AspNet.Cookies', 'AdfsWctx', 'SnapABugHistory', 'SnapABugUserName', 'SnapABugUserAlias', 'SnapABugVisit', 'SnapABugChatSession', 'SnapABugChatPoll', 'SnapABugChatView', 'SnapABugBanned', 'SnapABugChatWindow', 'SnapABugMinimizeStashCookie', 'SnapABugAgentAvatar', 'SnapABugNoProactiveChat', 'SnapEngageHistory', 'SnapEngageUserName', 'SnapEngageUserAlias', 'SnapEngageVisit', 'SnapEngageChatSession', 'SnapEngageChatPoll', 'SnapEngageChatView', 'SnapEngageBanned', 'SnapEngageChatWindow', 'SnapEngageMinimizeStashCookie', 'SnapEngageAgentAvatar', 'SnapEngageNoProactiveChat'],
    optionalCookies: [
        {
            name: 'performance',
            label: 'Performance cookies',
            description: 'Performance cookies help us to improve our website by collecting and reporting information on its usage (for example, which of our pages are most frequently visited).',
            cookies: [/*Google*/'_ga', '_gid', '_dc_gtm_*', '_gcl_au', '_gali', 'AMP_TOKEN', '_gat*', '1P_JAR', 'CONSENT', 'NID', '_gac_*', '_ga_*', 'HSID', 'SID', /*Youtube*/'VISITOR_INFO1_LIVE', 'YSC', 'PREF', 'GPS', 'IDE', 'SSID', /*Vimeo*/'vuid', /*Sitecore*/'SC_ANALYTICS_GLOBAL_COOKIE'],
            onAccept: function () {
                // update google tag manager permissions
                if (typeof gtag !== 'undefined') {
                    gtag('consent', 'update', {
                        'analytics_storage': 'granted'
                    });
                }

                // check and enable video if rendered in current page
                if (document.getElementsByClassName('iFramedVideo').length) {
                    window.allowYouTube();
                }

                // check and enable banner video if rendered in current page
                if (document.getElementsByClassName('banner-video').length) {
                    window.allowBannerVideo();
                }
            },
            onRevoke: function () {
                // update google tag manager permissions
                if (typeof gtag !== 'undefined') {
                    gtag('consent', 'update', {
                        'analytics_storage': 'denied'
                    });
                }

                // check and disable video if rendered in current page
                if (document.getElementsByClassName('iFramedVideo').length) {
                    window.blockYouTube();
                }

                // check and disable banner video if rendered in current page
                if (document.getElementsByClassName('banner-video').length) {
                    window.blockBannerVideo();
                }
            },
            recommendedState: "on"
        }, {
            name: 'marketing',
            label: 'Marketing cookies',
            description: 'We use third party cookies on our site to serve you with advertisements that we believe are relevant to you and your interests. You may see these advertisements on our site and on other sites that you visit.',
            cookies: [/*facebook*/'fr', '_fbp', /*hotjar*/'_hj*', 'hjTLDTest'],
            onAccept: function () {
                // update google tag manager permissions
                if (typeof gtag !== 'undefined') {
                    gtag('consent', 'update', {
                        'ad_storage': 'granted',
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted'
                    });
                }                

                // Add Facebook Pixel
                !function (f, b, e, v, n, t, s) {
                    if (f.fbq) return; n = f.fbq = function () {
                        n.callMethod ?
                            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                    n.queue = []; t = b.createElement(e); t.async = !0;
                    t.src = v; s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s)
                }(window, document, 'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '589467231216551');
                fbq('track', 'PageView');
                fbq('consent', 'grant');
                // End Facebook Pixel

                //Hotjar//
                (function (h, o, t, j, a, r) {
                    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
                    h._hjSettings = { hjid: 1292097, hjsv: 6 };
                    a = o.getElementsByTagName('head')[0];
                    r = o.createElement('script'); r.async = 1;
                    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
                //Hotjar//
            },
            onRevoke: function () {
                // update google tag manager permissions
                if (typeof gtag !== 'undefined') {
                    gtag('consent', 'update', {
                        'ad_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied'
                    });
                }

                fbq('consent', 'revoke');
            },
            recommendedState: "on"
        }
    ],

    position: 'LEFT',
    theme: 'LIGHT',
    toggleType: 'slider',
    initialState: 'open',
    notifyOnce: 'true',
    branding: {
        fontColor: "#222",
        fontFamily: "inherit",
        backgroundColor: "#fff",
        fontSizeTitle: "1.75rem",
        fontSizeIntro: "1rem",
        fontSizeHeaders: "1.5rem",
        fontSize: "1rem",
        toggleText: "#fff",
        toggleColor: "#222",
        toggleBackground: "#555",
        buttonIcon: null,
        buttonIconWidth: "64px",
        buttonIconHeight: "64px",
        removeIcon: false,
        removeAbout: true
    },
    accessibility: {
        highlightFocus: true
    }
};

CookieControl.load(config);

var blockedVideoUrl = "/video-embed-blocked";

window.addEventListener("load",
    function () {
        getBlockedVideoUrl();
    });

function getBlockedVideoUrl() {
    if ($(".embed-container:first").length > 0) {
        blockedVideoUrl = $(".embed-container:first").data("videoblockedurl");
    }
}

function blockYouTube() {
    const elems = document.querySelectorAll(".iFramedVideo");
    const $elems = [].slice.call(elems);
    $elems.map(function (elem) {
        elem.setAttribute("src", blockedVideoUrl);
    });
}

function allowYouTube() {
    const elems = document.querySelectorAll(".iFramedVideo");
    const $elems = [].slice.call(elems);
    $elems.map(function (elem) {
        elem.setAttribute("src", elem.getAttribute("data-src"));
    });
}

function allowBannerVideo() {
    const mediaWidth = window.matchMedia("(max-width: 37.5em)");
    const videoGone = document.querySelector(".breakout-area.banner-video div video");
    const pauseButtonGone = document.querySelector("#video-overlay div a");
    if (mediaWidth.matches) {
        document.querySelector(".breakout-area.banner-video div video").parentElement.removeChild(videoGone);
        document.querySelector("#video-overlay div a").parentElement.removeChild(pauseButtonGone);
        document.querySelector(".banner-video picture").classList.remove("video-switch");
    }
    else {
        document.querySelector(".banner-video picture").classList.add("video-switch");
        document.querySelector(".banner-video video").classList.remove("video-switch");
        document.querySelector(".banner-video video").play();
        document.querySelector("#hangarVideoBtn").classList.remove("video-switch");
    }
}

function blockBannerVideo() {
    document.querySelector(".banner-video video").classList.add("video-switch");
    document.querySelector("#hangarVideoBtn").classList.add("video-switch");
    document.querySelector(".banner-video picture").classList.remove("video-switch");
}
