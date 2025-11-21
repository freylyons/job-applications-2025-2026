var mouseInteractions = 0;
if ($("#IsUserSignedIn").val() === "True") {
    setInterval(function () { ResetSessionTimeoutOrCheckTimeoutStatus(); }, 30000);
    $(document).on('mousemove scroll keydown click', function () {
        mouseInteractions++;
    });
}

var failedcounts = 0;

function ResetSessionTimeoutOrCheckTimeoutStatus() {
    if (mouseInteractions > 0) {
        StaySignedIn();
    } else {
        CheckTimeoutStatus();
    }
    mouseInteractions = 0;
}

function incrementFailedCounts() {
    failedcounts++;
    if (failedcounts >= 3) {
        window.location.replace(window.location.href);
    }
}


function CheckTimeoutStatus() {
    $.ajax({
        url: window.location.href,
        type: "POST",
        context: this,
        data: { scController: "GlobalPageNotification", scAction: "CheckSessionTimeout" },
        success: GlobalPageNotification_CheckSessionTimeout_success,
        error: function (xhr, ajaxOptions, thrownError) {
            incrementFailedCounts();
        }
    });
}

var SupplierStaySignedInUrl = "";

function GlobalPageNotification_CheckSessionTimeout_success(data) {

    var result = JSON.parse(data);
    var currentSessionId = $("#TabCurrentSessionId").val();
    SupplierStaySignedInUrl = result.SupplierStaySignedInUrl;

    if(currentSessionId !== result.SessionId) {
        window.location.replace(result.SessionTimeoutUrl);
    }

    var tabTimeoutDisplayed = $("#TabSessionTimeoutDisplayed").val() === "true";

    if ($("#TabSessionTimeoutDisplayed").val() !== result.ShowInactiveTimeoutWarningMessage) {
        $("#TabSessionTimeoutDisplayed").val(result.ShowInactiveTimeoutWarningMessage);
    }

    if ((result.ShowInactiveTimeoutWarningMessage === true && tabTimeoutDisplayed === false)
        || (result.ShowTotalTimeoutWarningMessage === true && result.HasTotalTimeoutWarningBeenDisplayed === false)) {
        document.addEventListener('keyup', function (e) {
            if(e.keyCode === 27) {
                $("#session-modal").remove();
            }
        });
        SessionModalShow(result);
    }

    if (result.RedirectUrl !== '') {
        console.log("result.RedirectUrl=" +result.RedirectUrl);
        window.location.replace(result.RedirectUrl);
    }
}

function SessionModalShow(result) {

    $("#session-modal").remove();

    var message;
    var questionAndButton = "";
    if (result.ShowTotalTimeoutWarningMessage) {
        message = result.TotalSessionTimeoutWarningMessageContent;
    } else {
        message = result.InactiveSessionTimeoutWarningMessageContent;
        questionAndButton = "<h4>" + result.QuestionContent + "</h4>"
                        + "<div class='row'>"
                        + "<a role='button' href='javascript:StaySignedIn();' class='green add-right'>" + result.MoreTimeButtonLabel + "</a>"
                        + "</div>";
    };

    jQuery('body').prepend(
        "<div id='session-modal' class='hants-modal' style='z-index: 2147483647'>" //create this html
            + "<div class='hants-modal-content'>"
            + "<div class='hants-container'>"
            + "<div class='container row'>"
            + "<div class='columns twelve'>"
            + "<header class='hants-teal'>"
            + "<button role='link' class='close icon cancel hants-closebtn medium ' data-closes='session-modal'><span class='offscreen'>Hide this message</span></button>"
            + "<h2>" + result.Title + "</h2>"
            + "</header>"
            + "<p class='add-top add-bottom remove-sides'>" + message + "</p>"
            + questionAndButton
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>" + "");
}

function StaySignedIn() {

    if (SupplierStaySignedInUrl !== ""){
        $.ajax({
            url: SupplierStaySignedInUrl,
                type: "GET",
                context: this,
                success: function (data) { },
                error: function (xhr, ajaxOptions, thrownError) { }
        });
    }

    $.ajax({
        url: window.location.href,
        type: "POST",
        context: this,
        data: { scController: "GlobalPageNotification", scAction: "StaySignedIn" },
        success: function (data) {
            var result = JSON.parse(data);
            if(result.result === "OK") {
                $("#session-modal").remove();
            }
        },
        error : function (data) {
            console.log(new Date() + " CheckTimeoutStatus - error", data);
        }
    });

}