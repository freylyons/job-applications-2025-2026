var dtmTheme = (function() {
  var getTheme = function() {
	var body  = document.body.classList;
	var theme = document.querySelector('html');
	var data  = theme.dataset;

	var themeColor = localStorage.getItem("ThemeColor");

	jQuery.ajax({
		url: jQuery('#field_getThemeUrl').val(),
		type: 'GET',
		success: function (data) {
			try {
				var response = JSON.parse(data);
			} catch (e) {
				return false;
			}

			if(!isJson(data)) { return false; }

			response = JSON.parse(data);
			body.add(response.color);

			var themeHTML = document.querySelector('html'), data = themeHTML.dataset;
			body.replace(data.bsTheme, response.mode);
			data.bsTheme = response.mode;

			const dropdownElem = ['dropend', 'dropdown'];

			dropdownElem.forEach((dropdownElemName) => {
				jQuery('.' +dropdownElemName+' > .dropdown-menu > .d-flex > #theme-color-'+themeColor).css({"opacity":"0"});
				jQuery('.' +dropdownElemName+' > .dropdown-menu > .d-flex > #theme-mode-dark').css({"opacity":"0"});
				jQuery('.' +dropdownElemName+' > .dropdown-menu > .d-flex > #theme-color-'+response.color).css({"opacity":"100%"});
			});

			localStorage.setItem('ThemeColor', response.color);

			if ('dark' == response.mode){
				jQuery('.dropend > .dropdown-menu > .d-flex > #theme-mode-dark').css({"opacity":"100%"});
				jQuery('.dropdown > .dropdown-menu > .d-flex > #theme-mode-dark').css({"opacity":"100%"});
			}
		}
	});
  };

  var setThemeMode = function() {
	jQuery.ajax({
		url: jQuery('#field_getThemeUrl').val(),
		type: 'GET',
		success: function (data) {
			response = JSON.parse(data);

			var ThemeMode = "";
			var themeHTML = document.querySelector('html'), data = themeHTML.dataset;
			var themeModeOpacity = jQuery('.dropend > .dropdown-menu > .d-flex > #theme-mode-dark');

			if('dark' == response.mode) {
			  ThemeMode = "light";
			  themeModeOpacity.css({"opacity":"0"});
			  jQuery('.dropdown > .dropdown-menu > .d-flex > #theme-mode-dark').css({"opacity":"0"});
			} else {
			  ThemeMode = "dark";
			  themeModeOpacity.css({"opacity":"100%"});
			  jQuery('.dropdown > .dropdown-menu > .d-flex > #theme-mode-dark').css({"opacity":"100"});
			}

			var body  = document.body.classList;
			var theme = document.querySelector('html');
			var data  = theme.dataset;

			body.replace(data.bsTheme, ThemeMode);
			data.bsTheme = ThemeMode;

			// we're not waiting for the success anymore since it'll just slow things down.
			// this is a fire and forget.
			jQuery.ajax({
				url: jQuery('#field_setThemeModeUrl').val(),
				type: 'POST',
				data: {
					mode: ThemeMode
				}
			});
		}
	});
  };

  var setThemeColor = function(ThemeColor) {
	document.body.classList.remove("default");

	jQuery.ajax({
		url: jQuery('#field_getThemeUrl').val(),
		type: 'GET',
		success: function (data) {
			response = JSON.parse(data);

			var previousThemeColor = localStorage.getItem("ThemeColor");
			var body = document.body.classList;
			document.body.classList.remove(response.color);

			const dropdownElem = ['dropend', 'dropdown'];

			dropdownElem.forEach((dropdownElemName) => {
				jQuery('.' +dropdownElemName+ '> .dropdown-menu > .d-flex > #theme-color-default').css({"opacity":"0"});
				jQuery('.' +dropdownElemName+ '> .dropdown-menu > .d-flex > #theme-color-'+response.color).css({"opacity":"0"});
				jQuery('.' +dropdownElemName+ '> .dropdown-menu > .d-flex > #theme-color-'+previousThemeColor).css({"opacity":"0"});
				jQuery('.' +dropdownElemName+ '> .dropdown-menu > .d-flex > #theme-color-'+ThemeColor).css({"opacity":"100%"});
			});

			body.add(ThemeColor);

			localStorage.setItem('ThemeColor', ThemeColor);

			jQuery.ajax({
				url: jQuery('#field_setThemeColorUrl').val(),
				type: 'POST',
				data: {
					color: ThemeColor
				}
			});
		}
	});
  };

  return {
    getTheme: getTheme,
    setThemeMode: setThemeMode,
    setThemeColor: setThemeColor
  }
})();

function isJson(item) {
	let value = typeof item !== "string" ? JSON.stringify(item) : item;
	try {
		value = JSON.parse(value);
	} catch (e) {
		return false;
	}

	return typeof value === "object" && value !== null;
}
