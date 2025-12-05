// custom check if log
var oleeoLoggingOn = false;

$.fn.is_oleeo_jquery =function(){
    return true;
};

function oleeoLog ( msg ) {
    if(oleeoLoggingOn) {
        console.log(msg);
    }
}

function oleeoWarn ( msg ) {
    if(oleeoLoggingOn) {
        console.warn(msg);
    }
}

function oleeoError ( msg ) {
    if(oleeoLoggingOn) {
        console.error(msg);
    }
}

function oleeoJQuery(callermsg) {
    if(!$.fn.is_oleeo_jquery) {
        oleeoWarn(callermsg + ' unloading injected jQuery version: ' + $.fn.jquery);
        jQuery.noConflict( true );
    }
}

oleeoLog('Portal load jQuery version: ' + $.fn.jquery);

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
// http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).ASPx
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function isInternetExplorer6() {
    var ver = getInternetExplorerVersion();
    if ( (ver > -1) && (ver < 7.0) ) {
        return true;
    } else {
        return false;
    }
}

function csrClearDiv( setdivid ) {
    $(setdivid).html('');
    return 1;
}

// defunct
function csrPortalQuery( jobsid, setdivid ) {
    oleeoWarn('obsolete function csrPortalQuery called');
    return 1;
}

function submitFormWithValue( formname, valname, val ) {
    document.getElementById(valname).value = val;
    document.getElementById(formname).submit();
    return false;
}

function submitFormById( formname ) {
    document.getElementById(formname).submit();
    return false;
}

function mandatorySearchFieldsComplete() {
    var mandatoryComplete = true;
    $('.mandatorySearchField').each(function() {
        if (($(this).attr('type') == 'checkbox' && $(this).is(':checked')) || 
            ($(this).attr('type') != 'checkbox' && $(this).val() != '' && $(this).val() != 'NULL' && $(this).val())) {
            // this instance is complete
        } else {
            mandatoryComplete = false;
        }
    });
    return mandatoryComplete;
}

function checkAlertSubmitButton(){
    var hasValue = false;
    $('.enableSearchField, #whereselector').each(function() { // classname given to fields to be required to activate button
        if (($(this).attr('type') == 'checkbox' && $(this).is(':checked')) || 
            ($(this).attr('type') != 'checkbox' && $(this).val() != '' && $(this).val() != 'NULL' && $(this).val())) {
            hasValue = true;
        }
    });
    
    // check overseas only if we have to
    if(!hasValue && $('#overseas').length && $('#overseas').val() == 2) {
        hasValue = true;
    }
    
    if (hasValue && mandatorySearchFieldsComplete() ) {
        $('#submitAlertButton').removeAttr('disabled');
    } else {
        $('#submitAlertButton').attr('disabled', 'disabled');
    }
}

function csjobsErrorLinkFunc(target_id) {
    $('#' + target_id).trigger('focus');
}

// disable search or create alert until something is selected
$(document).ready(function(){
    oleeoJQuery('Portal js');
    oleeoLog('Portal ready jQuery version: ' + $.fn.jquery);
    
    var commonSelectRemoveFunction = function() { return true; };
    
    if ($('#submitAlertButton').length ){ // check if we are on a field with a submit button of appropriate class
       checkAlertSubmitButton(); // check for prefilled values on page load
       $('form').on('keyup change', function() { // or when something changes
           checkAlertSubmitButton();
      });
      
      commonSelectRemoveFunction = function() { checkAlertSubmitButton(); };
      
    }
        
    // oselect
    
    $('.oselect').each( function() {
        oselectInitElement( this, {
            'closeOptionsOnSelection' : false,
            'onButtonDeselectFunction' : commonSelectRemoveFunction
            } );
    });
    
    // jobbasket
    
    $('.csr-job-basket-button, .csr-job-basket-action-link').on('click', function() {
        var action = $(this).attr('data-action');
        var jcode  = $(this).attr('data-jcode');
        $('#ID_job_basket_pageaction').val( action );
        $('#ID_job_basket_jcode').val( jcode );
        $(this).prop('disabled', true);
        submitFormById('ID_job_basket_update');
        
        return false;
    });
    
    // submit button disable on click
    $('.csr-submit-button-disable-onclick').on('click', function() {        
        $(this).closest('form').trigger('submit');
        $(this).prop('disabled', true);
        return false;
    });
    
    
});