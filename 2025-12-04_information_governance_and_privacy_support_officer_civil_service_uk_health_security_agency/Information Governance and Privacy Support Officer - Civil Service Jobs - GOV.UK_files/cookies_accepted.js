
function set_csjobs_cookie_message(cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  var cookiestr = "cookies_accepted=" + cvalue + "; " + expires + "; path=/; secure";
  document.cookie = cookiestr;
  $('#csr-cookie-message').hide();
  if(cvalue === "all") {
    $('#csr-cookie-accept-all').show();
  }
  else {
    $('#csr-cookie-accept-essential').show();
  }
  return;
}

$(document).ready(function(){
    
    $('#update_cookie_preferences_form').submit(function () { return false; });
    
    $('#accept_all_cookies_button').click(function(){
        set_csjobs_cookie_message('all',this.getAttribute('messagedays'));
        });
    
    $('#accept_essential_cookies_button').click(function(){
        set_csjobs_cookie_message('essential',this.getAttribute('messagedays'));
        });
    
});


