/** 
 * =================================================================
 * Javascript code for OWASP CSRF Protector
 * Task it does: Fetch csrftoken from cookie, and attach it to every
 * 		POST request
 *		Allowed GET url
 *			-- XHR
 *			-- Static Forms
 *			-- URLS (GET only)
 *			-- dynamic forms
 * =================================================================
 */

var CSRFP = {
	CSRFP_TOKEN: csrfpTokenName,
	/*
	 * Array of patterns of url, for which csrftoken need to be added
	 * In case of GET request also, provided from server
	 *
	 * @var string array
	 */
	checkForUrls: [],
	/**
	 * Function to check if a certain url is allowed to perform the request
	 * With or without csrf token
	 *
	 * @param: string, url
	 *
	 * @return: boolean, 	true if csrftoken is not needed
	 * 						false if csrftoken is needed
	 */
	_isValidGetRequest: function(url) {
		for (var i = 0; i < CSRFP.checkForUrls.length; i++) {
			var match = CSRFP.checkForUrls[i].exec(url);
			if (match !== null && match.length > 0) {
				return false;
			}
		}
		return true;
	},
	/** 
	 * function to get Auth key from cookie Andreturn it to requesting function
	 *
	 * @param: void
	 *
	 * @return: string, csrftoken retrieved from cookie
	 */
	_getAuthKey: function() {
		
		var re = new RegExp('[; ]'+CSRFP.CSRFP_TOKEN+'=([^\\s;]*)');
		var RegExpArray = re.exec("; "+document.cookie);
		
		if (RegExpArray === null) {
			return false;
		}
		return RegExpArray[1];
	},
	/** 
	 * Function to get domain of any url
	 *
	 * @param: string, url
	 *
	 * @return: string, domain of url
	 */
	_getDomain: function(url) {
		if (url.indexOf("http://") !== 0 
			&& url.indexOf("https://") !== 0)
			return document.domain;
		return /http(s)?:\/\/([^\/]+)/.exec(url)[2];
	},
	/**
	 * Function to create and return a hidden input element
	 * For stroing the CSRFP_TOKEN
	 *
	 * @param void
	 *
	 * @return input element
	 */
	_getInputElt: function() {
		var hiddenObj = document.createElement("input");
		hiddenObj.name = CSRFP.CSRFP_TOKEN;
		hiddenObj.type = 'hidden';
		hiddenObj.value = CSRFP._getAuthKey();
		return hiddenObj;
	},
	/**
	 * Returns absolute path for relative path
	 * 
	 * @param base, base url
	 * @param relative, relative url
	 *
	 * @return absolute path (string)
	 */
	_getAbsolutePath: function(base, relative) {
		var stack = base.split("/");
		var parts = relative.split("/");
		// remove current file name (or empty string)
		// (omit if "base" is the current folder without trailing slash)
		stack.pop(); 
			 
		for (var i = 0; i < parts.length; i++) {
			if (parts[i] == ".")
				continue;
			if (parts[i] == "..")
				stack.pop();
			else
				stack.push(parts[i]);
		}
		return stack.join("/");
	},
	/** 
	 * Remove jcsrfp-token run fun and then put them back 
	 *
	 * @param function
	 * @param reference form obj
	 *
	 * @retrun function
	 */
	_csrfpWrap: function(fun, obj) {
		return function(event) {
			// Modified to hold on to prepopulated tokens
			if (typeof obj[CSRFP.CSRFP_TOKEN] === 'undefined') {
				obj.appendChild(CSRFP._getInputElt());
			}
			
			// Trigger the functions
			var result = fun.apply(this, [event]);
			
			return result;
		};
	},
	
}; 

// HRsmart modification
// race conditions with jQuery are messing up the XMLHttpRequest prototype below so attach
// our own handler
if (typeof jQuery !== 'undefined') {
	jQuery.ajaxPrefilter(function( options, originalOptions, jqXHR) {
		if(options.type.toLowerCase() === "post")
		{
			if (typeof options.data === 'undefined' || typeof options.data[CSRFP.CSRFP_TOKEN] === 'undefined') {
				//event.target.appendChild(CSRFP._getInputElt());

				var token = CSRFP._getAuthKey();
				if(originalOptions.data && 'string' == typeof originalOptions.data)
				{
					options.data = originalOptions.data + '&' + CSRFP.CSRFP_TOKEN + '=' + token;
				}
				else
				{
					var csrfpAddition = {};
					csrfpAddition[CSRFP.CSRFP_TOKEN] = token;
					
					options.data = jQuery.param(jQuery.extend(originalOptions.data, csrfpAddition));
				}
			} else {
				//modify token to latest value
				options.data[CSRFP.CSRFP_TOKEN] = CSRFP._getAuthKey();
			}
		}
	});
}

function addCsrfTokenToXajax()
{
	var returnStr = '&' + CSRFP.CSRFP_TOKEN + '=' + CSRFP._getAuthKey();
	return returnStr;
}

//==========================================================
// Adding tokens, wrappers on window onload
//==========================================================

function csrfprotector_init() {
	
	//==================================================================
	// Adding csrftoken to request resulting from <form> submissions
	// Add for each POST, while for mentioned GET request
	//==================================================================
	for(var i = 0; i < document.forms.length; i++) {
		document.forms[i].addEventListener("submit", function(event) {
			// don't worry about GET forms for now
			if(typeof event.target['method'] === 'undefined'
					|| event.target['method'].toString().toLowerCase() !== 'get')
			{		
				if (typeof event.target[CSRFP.CSRFP_TOKEN] === 'undefined') {
					event.target.appendChild(CSRFP._getInputElt());
				} else {
					//modify token to latest value
					event.target[CSRFP.CSRFP_TOKEN].value = CSRFP._getAuthKey();
				}
			}
		});
	}
	
	/**
	 * Add wrapper for HTMLFormElements addEventListener so that any further 
	 * addEventListens won't have trouble with CSRF token
	 */
	HTMLFormElement.prototype.addEventListener_ = HTMLFormElement.prototype.addEventListener;
	HTMLFormElement.prototype.addEventListener = function(eventType, fun, bubble) {
		if (eventType === 'submit') {
			var wrapped = CSRFP._csrfpWrap(fun, this);
			this.addEventListener_(eventType, wrapped, bubble);
		} else {
			this.addEventListener_(eventType, fun, bubble);
		}	
	}

	/**
	 * Add wrapper for IE's attachEvent
	 */
	if (typeof HTMLFormElement.prototype.attachEvent !== 'undefined') {
		HTMLFormElement.prototype.attachEvent_ = HTMLFormElement.prototype.attachEvent;
		HTMLFormElement.prototype.attachEvent = function(eventType, fun) {
			if (eventType === 'submit') {
				var wrapped = CSRFP._csrfpWrap(fun, this);
				this.attachEvent_(eventType, wrapped);
			} else {
				this.attachEvent_(eventType, fun);
			}
		}
	}
	
	// HRsmart modification
	// global listener for form submissions - for dynamically created forms.
	document.body.addEventListener('submit', function (e) {
		var obj = e.target;

		if(obj.method.toLowerCase() === "post" )
		{
			if (typeof obj[CSRFP.CSRFP_TOKEN] === 'undefined') {
				obj.appendChild(CSRFP._getInputElt());
			}
		}
	}, false);
	


	//==================================================================
	// Wrapper for XMLHttpRequest & ActiveXObject (for IE 6 & below)
	// Set X-No-CSRF to true before sending if request method is 
	//==================================================================

	/** 
	 * Wrapper to XHR open method
	 * Add a property method to XMLHttpRequst class
	 * @param: all parameters to XHR open method
	 * @return: object returned by default, XHR open method
	 */
	function new_open(method, url, async, username, password) {
		this.method = method;
		var isAbsolute = (url.indexOf("./") === -1) ? true : false;
		if (!isAbsolute) {
			var base = location.protocol +'//' +location.host 
							+ location.pathname;
			url = CSRFP._getAbsolutePath(base, url);
		}
		if (method.toLowerCase() === 'get' 
			&& !CSRFP._isValidGetRequest(url)) {
			//modify the url
			if (url.indexOf('?') === -1) {
				url += "?" +CSRFP.CSRFP_TOKEN +"=" +CSRFP._getAuthKey();
			} else {
				url += "&" +CSRFP.CSRFP_TOKEN +"=" +CSRFP._getAuthKey();
			}
		}
		async = true;
		return this.old_open(method, url, async, username, password);
	}

	/** 
	 * Wrapper to XHR send method
	 * Add query paramter to XHR object
	 *
	 * @param: all parameters to XHR send method
	 *
	 * @return: object returned by default, XHR send method
	 */
	function new_send(data) {
		if (this.method.toLowerCase() === 'post') {
			
			// only add the token if it doesn't already exist
			if(data.indexOf(CSRFP.CSRFP_TOKEN+"=") === -1)
			{
			if (data !== "") {
				data += "&";
			} else {
				data = "";
			}
			
			data += CSRFP.CSRFP_TOKEN +"=" +CSRFP._getAuthKey();
		}
		}
		return this.old_send(data);
	}
	
	if (window.XMLHttpRequest) {
		// Wrapping
		XMLHttpRequest.prototype.old_send = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.old_open = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = new_open;
		XMLHttpRequest.prototype.send = new_send;
	}
	if (typeof ActiveXObject !== 'undefined') {
		ActiveXObject.prototype.old_send = ActiveXObject.prototype.send;
		ActiveXObject.prototype.old_open = ActiveXObject.prototype.open;
		ActiveXObject.prototype.open = new_open;
		ActiveXObject.prototype.send = new_send;	
	}

}
