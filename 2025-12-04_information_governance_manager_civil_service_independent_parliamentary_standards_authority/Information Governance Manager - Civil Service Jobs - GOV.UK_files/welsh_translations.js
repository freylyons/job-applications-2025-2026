
var translations = {
  203: {
      'timer_inactivity': "Inactivity logout in: ",
      'timer_resetFailed': "Although you selected to continue your session it has already expired. You must sign in again to continue.",
      'timer_timeout': "Your session is about to time out due to inactivity. Press OK to continue working or Cancel to sign out.",
      
      'acc_search_filters_show' : "Show search filters",
      'acc_search_filters_hide' : "Hide search filters",
      
      'generic_of': "of",
            
      'aauto_tNoResults': "No results found",
      'aauto_tStatusQueryTooShort_a': "Type in",
      'aauto_tStatusQueryTooShort_b': "or more characters for results",
      'aauto_tStatusNoResults': "No search results",
      'aauto_tStatusSelectedOption_a': "of",
      'aauto_tStatusSelectedOption_b': "is highlighted",
      'aauto_tStatusResults_s': "COUNT result is available",
      'aauto_tStatusResults_p': "COUNT results are available",
      'aauto_tAssistiveHint': "When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures."
  },
  1224: {
      'timer_inactivity': "Allgofnodi oherwydd anweithgarwch mewn: ",
      'timer_resetFailed': "Er i chi ddewis i barhau â'ch sesiwn, mae eisoes wedi dod i ben. Rhaid i chi fewngofnodi eto i barhau. ",
      'timer_timeout': "Mae eich sesiwn ar fin dod i ben oherwydd anweithgarwch. Pwyswch OK i barhau i weithio neu Canslo i allgofnodi.",
      'acc_search_filters_show' : "Dangos hidlwyr chwilio",
      'acc_search_filters_hide' : "Cuddio hidlwyr chwilio",
      
      'generic_of': "o",
            
      'aauto_tNoResults': "Heb ganfod canlyniadau",
      'aauto_tStatusQueryTooShort_a': "Teipiwch",
      'aauto_tStatusQueryTooShort_b': "nod neu fwy ar gyfer canlyniadau",
      'aauto_tStatusNoResults': "Dim canlyniadau chwilio",
      'aauto_tStatusSelectedOption_a': "o",
      'aauto_tStatusSelectedOption_b': "yn cael ei amlygu",
      'aauto_tStatusResults_s': "Mae COUNT canlyniad ar gael",
      'aauto_tStatusResults_p': "Mae COUNT canlyniad ar gael",
      'aauto_tAssistiveHint': "Pan fydd canlyniadau awtolenwi ar gael defnyddiwch saethau i fyny ac i lawr i adolygu a mynd i mewn i ddewis.  Defnyddwyr dyfeisiau cyffwrdd, archwilio trwy gyffwrdd neu gydag ystumiau swipe."
  },
};


var language_code;
function setLangCode() {
  language_code = getCookie('language');
  if (!language_code) {
    console.log('unable to read language perference cookie');
    language_code = 203;
  }
}

function get_trans_str(label) {
  if (!language_code) {
    setLangCode();
  }
  return translations[language_code][label];
}


function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

