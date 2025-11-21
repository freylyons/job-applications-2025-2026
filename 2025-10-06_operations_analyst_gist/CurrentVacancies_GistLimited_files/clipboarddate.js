/* Allow Copy Paste into Date Picker Fields */


Date.prototype.format = function (format) {
	const map = {
		yyyy: this.getFullYear(),
		mm: String(this.getMonth() + 1).padStart(2, '0'),
		dd: String(this.getDate()).padStart(2, '0'),
	};

	return format.replace(/yyyy|mm|dd/gi, matched => map[matched]);
};

dateInputClipboardValidate = function (value, reverse) {
	let defaultFormat = 'mm/dd/yyyy';
	let saveFormat = 'yyyy-mm-dd';

	if (defaultFormat) {
		let result = reverse
			? parseDate(value.trim(), saveFormat)
			: parseDate(value.trim(), defaultFormat);

		if (result instanceof Date) {
			// Format the result based on the desired format
			const formattedDate = result.format(reverse ? defaultFormat : saveFormat);
			return formattedDate;
		} else {
			return value; // Return the original value as a fallback
		}
	}

	return value;
};

dateInputClipboardSupport = function (elements) {
	return jQuery(elements ? elements : document)
		// remove any previously added handlers
		.off('keydown.dateClipboard contextmenu.dateClipboard keyup.dateClipboard focusout.dateClipboard copy.dateClipboard input.dateClipboard')
		/*
			ctrl-anything or contextmenu ( right-click, shift-F10, contextmenu key ),
			convert to text input, select all current text and enforce max
			length of 10 ( yyyy-mm-dd ).
		*/
		.on(
			'keydown.dateClipboard contextmenu.dateClipboard',
			function (e) {
				if (
					e.target
					&&
					e.target.nodeName == 'INPUT'
					&&
					e.target.type.toLowerCase() == 'date'
					&&
					(
						(e.key && e.key == 'Control' && e.type == 'keydown')
						||
						e.type == 'contextmenu'
					)
				) {
					e.target.originalType = e.target.type;
					e.target.type = 'text';
					e.target.originalPlaceholder = e.target.placeholder;
					e.target.placeholder = 'mm/dd/yyyy';
					e.target.value = dateInputClipboardValidate(e.target.value, true);
					e.target.select();
					e.target.maxlength = 10;
				}
			}
		)
		/*
			releasing the control key, navigating away,
			restore the field to a date input and remove 
			the max length.
		*/
		.on(
			'keyup.dateClipboard focusout.dateClipboard',
			function (e) {
				if (
					e.target
					&&
					e.target.nodeName == 'INPUT'
					&&
					e.target.type.toLowerCase() == 'text'
					&&
					typeof e.target.originalType == 'string'
					&&
					e.target.originalType.toLowerCase() == 'date'
					&&
					(
						((e.key == 'Control' || e.key == 'Escape') && e.type == 'keyup')
						||
						e.type == 'focusout'
					)
				) {
					e.target.value = dateInputClipboardValidate(e.target.value);
					e.target.type = e.target.originalType;
					e.target.maxlength = -1;
					e.target.placeholder = e.target.originalPlaceholder;
					delete e.target.originalPlaceholder;
					delete e.target.originalType;
				}
			}
		)
		/*
			copy is a special case, because once we 
			convert back to a date input, copy is no
			longer supported and the operation is ignored.
			we have to set the clipboard text manually
			and preventDefault();
		*/
		.on(
			'copy.dateClipboard',
			function (e) {
				if (
					e.target
					&&
					e.target.nodeName == 'INPUT'
					&&
					e.target.type.toLowerCase() == 'text'
					&&
					typeof e.target.originalType == 'string'
					&&
					e.target.originalType.toLowerCase() == 'date'
				) {
					e.originalEvent.clipboardData.setData('text/plain', e.target.value);
					e.target.value = dateInputClipboardValidate(e.target.value);
					e.target.type = e.target.originalType;
					e.target.maxlength = -1;
					e.target.placeholder = e.target.originalPlaceholder;
					delete e.target.originalPlaceholder;
					delete e.target.originalType;
					e.preventDefault();
				}
			}
		)
		/*
			any change that occurred from a clipboard action
			needs validation, as well as restoring the element
			to a date input
		*/
		.on(
			'input.dateClipboard',
			function (e) {
				if (
					e.target
					&&
					e.target.nodeName == 'INPUT'
					&&
					e.target.type.toLowerCase() == 'text'
					&&
					typeof e.target.originalType == 'string'
					&&
					e.target.originalType.toLowerCase() == 'date'
					&&
					e.originalEvent
					&&
					(
						e.originalEvent.inputType == 'insertFromPaste'
						||
						e.originalEvent.inputType == 'deleteByCut'
					)
				) {
					// validate and/or convert pasted input back to yyyy-mm-dd here

					e.target.value = dateInputClipboardValidate(e.target.value);
					e.target.type = e.target.originalType;
					e.target.maxlength = -1;
					delete e.target.originalType;
				}
			}
		);
}

//also override date parse method
Date.prototype.parse = function (dateString) {
	return parseDate(dateString);
}

/**
 * Trims received text.
 *
 * @param text Text to trim.
 * @return Trimmed text.
 */
function trim(text) {
	var from = 0, to = text.length - 1;
	while (text.substr(from, 1) == " ") from++;
	while (text.substr(to, 1) == " " && to > from) to--;

	return text.substring(from, to + 1);
}

/**
 * Returns a Date object obtained from parsing a date string.
 *
 * @author fborghesi
 * @param dateString String with the date to parse.
 * @param formatString Optional string that specifies the formatting rule to
 * apply. Recognized values in the string are yyyy, mmmm, mmm, mm, dddd, ddd and dd.
 * @return Obtained Date instance.
 */
function parseDate(dateString, formatString) {
	var result = null;
	var re, handler, bits;
	var i;
	var formatRE = '^$';

	//build REGEXP for pattern, if any
	if (formatString) {
		pattern = formatString.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd)/gi,
			function ($1) {
				var result;

				switch ($1.toLowerCase()) {
					case 'yyyy': result = '([0-9]{4})'; break;
					case 'mmmm': //break; intentionally commented out
					case 'mmm': result = '([A-Za-z]+)'; break;
					case 'mm': result = '([0-9]{1,2})'; break;
					case 'dddd': //break; intentionally commented out
					case 'ddd': result = '(\w+)'; break;
					case 'dd': result = '([0-9]{1,2})'; break;
				}

				return result;
			}
		);

		formatRE = new RegExp("^" + pattern + "$", "i");
	}

	var dateParsePatterns = [
		// formatRE
		{
			re: formatRE,
			handler: function (bits) {
				var d = new Date();

				/*
					The data object should have a default value that is compatible with
					all specific date values, because if we assign an invalid day or
					month, the resulting date will not be what you think.

					The date object has the current date by default, which 
					might not be a month containing 31 days.

					The format string is parsed left-to-right, and each piece of the 
					user's input value is set individually.

					For example:
						- assume that today is April 15th, giving d a default value of 2024-04-15
						- April contains only 30 days
						- formatString begins with 'dd'
						- the user selects March 31st from the date picker
						- we apply '31' to the date object
						- Because April 31st does not exist, javascript's Date object will
						  change the value to May 1st, which is technically the 31st day of April.
				*/

				d.setFullYear(2024); // 2024 was a leap year
				d.setMonth(0); // January has 31 days
				d.setDate(1); // All months have a 1st day

				var index = 1;

				formatString.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd)/gi,
					function ($1) {
						switch ($1.toLowerCase()) {
							case 'yyyy': d.setFullYear(bits[index]); break;
							case 'mmmm': d.setMonth(Date.getMonthIndex(bits[index])); break;
							case 'mmm': d.setMonth(Date.getMonthIndex(bits[index])); break;
							case 'mm': d.setMonth(bits[index] - 1); break;
							case 'dddd': break; //ignore day name
							case 'ddd': break; //ignore day name
							case 'dd': d.setDate(bits[index]); break;
						}

						index++;
					}
				);
				return d;
			}
		},
		// Today
		{
			re: /^tod/i,
			handler: function () {
				return new Date();
			}
		},
		// Tomorrow
		{
			re: /^tom/i,
			handler: function () {
				var d = new Date();
				d.setDate(d.getDate() + 1);
				return d;
			}
		},
		// Yesterday
		{
			re: /^yes/i,
			handler: function () {
				var d = new Date();
				d.setDate(d.getDate() - 1);
				return d;
			}
		},
		// 4th
		{
			re: /^(\d{1,2})(st|nd|rd|th)?$/i,
			handler: function (bits) {
				var d = new Date();
				d.setDate(parseInt(bits[1], 10));
				return d;
			}
		},
		// 4th Jan
		{
			re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+)$/i,
			handler: function (bits) {
				var d = new Date();
				d.setDate(parseInt(bits[1], 10));
				d.setMonth(parseMonth(bits[2]));
				return d;
			}
		},
		// 4th Jan 2003
		{
			re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+),? (\d{4})$/i,
			handler: function (bits) {
				var d = new Date();
				d.setDate(parseInt(bits[1], 10));
				d.setMonth(parseMonth(bits[2]));
				d.setYear(bits[3]);
				return d;
			}
		},
		// Jan 4th
		{
			re: /^(\w+) (\d{1,2})(?:st|nd|rd|th)?$/i,
			handler: function (bits) {
				var d = new Date();
				d.setDate(parseInt(bits[2], 10));
				d.setMonth(parseMonth(bits[1]));
				return d;
			}
		},
		// Jan 4th 2003
		{
			re: /^(\w+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})$/i,
			handler: function (bits) {
				var d = new Date();
				d.setDate(parseInt(bits[2], 10));
				d.setMonth(parseMonth(bits[1]));
				d.setYear(bits[3]);
				return d;
			}
		},
		// mm/dd/yyyy ( American style )
		{
			re: /(\d{1,2})\W(\d{1,2})\W(\d{4})/,
			handler: function (bits) {
				var d = new Date();
				d.setYear(parseInt(bits[3]));
				d.setDate(parseInt(bits[2], 10));
				d.setMonth(parseInt(bits[1], 10) - 1); // Because months indexed from 0
				return d;
			}
		},
		// yyyy-mm-dd ( ISO style )
		{
			re: /(\d{4})\W(\d{1,2})\W(\d{1,2})/,
			handler: function (bits) {
				var d = new Date();
				d.setYear(parseInt(bits[1]));
				d.setDate(parseInt(bits[3], 10));
				d.setMonth(parseInt(bits[2], 10) - 1);
				return d;
			}
		}
	];

	//iterate patterns
	for (var i = 0; i < dateParsePatterns.length && result == null; i++) {
		re = dateParsePatterns[i].re;
		bits = re.exec(dateString);
		if (bits) {
			handler = dateParsePatterns[i].handler;
			result = handler(bits);
		}
	}

	return result;
}