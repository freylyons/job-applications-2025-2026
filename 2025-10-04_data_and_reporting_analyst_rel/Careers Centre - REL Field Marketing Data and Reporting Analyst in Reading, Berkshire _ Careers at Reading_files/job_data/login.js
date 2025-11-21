/*
(C) Copyright 1999-2015 iCIMS. Proprietary and Confidential. All rights reserved.
This software is the intellectual property of iCIMS. The program may be used only in accordance with the terms of the license agreement you entered into with iCIMS.
*/

function css_registerLink_onClick() {
	document.forms['css_loginForm'].submit();
	return false;
}


function OpenNewWindow(sLink, w) {
	var newwin = window.open(sLink, "CredentialReminder", w);
}

ICIMS.addEvent(document, 'domready', function() {
	// for Accessiblity
	// add keydown event handler to the social login buttons.
	var buttons = document.querySelectorAll('.socialLoginButton, .iCIMS_Action_Button');
	if (buttons) {
		for (var index = 0; index < buttons.length; index++) {
			onclickAccessible(buttons[index]);
		}
	}

	// open password reset link in a new window
	var onboardPasswordReset = document.getElementById('icims-onboard-password-reset-link');
	if (onboardPasswordReset) {
		var resetAnchors = onboardPasswordReset.querySelectorAll('a');
		for (var i = 0; i < resetAnchors.length; i++) {
			var resetAnchor = resetAnchors[i];
			ICIMS.addEvent(resetAnchor, 'click', function(resetAnchor) {
				return function(event) {
					if (resetAnchor.href && resetAnchor.href !== '#') {
						if (event && event.preventDefault) event.preventDefault();
						OpenNewWindow(resetAnchor.href ,'width=450,height=270,toolbar=no,resizable,location=no,directories=no,status=no,scrollbars=yes');
						return false;
					}
				}
			}(resetAnchor));
		}
	}
});

let focusedIndex = -1;
function initializeDropdown() {
	const selectedCountryCodeElem = document.getElementById('selectedCountryCode');
	const selectedCountryCode = selectedCountryCodeElem ? selectedCountryCodeElem.value : '';
	const dropdownPlaceholder = document.querySelector('.dropdown-text');
	const dropdownOptions = document.querySelectorAll('.dropdown-result');

	// Set the dropdown placeholder to the selected country code
	if (selectedCountryCode && selectedCountryCode !== '-1') {
		const selectedOption = Array.from(dropdownOptions).find(option =>
			option.getAttribute('value') === selectedCountryCode
		);
		if (selectedOption) {
			dropdownPlaceholder.textContent = selectedOption.textContent.trim();
			dropdownPlaceholder.setAttribute('title', selectedOption.textContent.trim());
		}
	}
}

// This function toggles the visibility of the dropdown options when the dropdown is clicked.
function toggleDropdown() {
	const options = document.getElementById('dropdownOptions');
	const dropdownTrigger = document.getElementById('dropdown');
	if (!options || !dropdownTrigger) {
		return;
	}
	const isExpanded = !options.classList.contains('hidden');

	// Use requestAnimationFrame for smoother transitions
	requestAnimationFrame(() => {
		if (isExpanded) {
			// Close the dropdown
			options.classList.add('hidden');
			options.style.display = 'none';
			dropdownTrigger.setAttribute('aria-expanded', 'false');

			// Return focus to dropdown trigger
			dropdownTrigger.focus();
		} else {
			// First, handle all visual updates together
			dropdownTrigger.classList.add('focus');
			options.classList.remove('hidden');
			options.style.display = 'block';

			// Then handle accessibility and focus changes
			dropdownTrigger.setAttribute('aria-expanded', 'true');
			requestAnimationFrame(() => {
				const searchInput = document.querySelector('.dropdown-search');
				if (searchInput) {
					searchInput.focus();
				}
			});
		}
	});
	focusedIndex = -1;
}

// Whenever user enter country it will search and filter the dropdown options based on the input.
function filterOptions() {
	var searchInput = document.querySelector('.dropdown-search');
	var filter = searchInput.value.toUpperCase();
	var options = document.querySelectorAll('.dropdown-results li');
	focusedIndex = -1;
	// Loop through options and show/hide based on the search input
	options.forEach(option => {
		var text = option.textContent || option.innerText;
		var upperText = text.toUpperCase();
		var index = upperText.indexOf(filter);

		if (index > -1) {
			option.style.display = '';
			var highlightedText = text.substring(0, index) + '<strong>' + text.substring(index, index + filter.length) + '</strong>' + text.substring(index + filter.length);
			option.innerHTML = highlightedText;
		} else {
			option.style.display = 'none';
			option.innerHTML = text;
		}
		option.removeAttribute('title');
	});
}

// When country is selected, set it as the value of the dropdown and close the dropdown
function initializeDropdownOptions() {
	document.querySelectorAll('.dropdown-result').forEach(option => {
		option.setAttribute('tabindex', '0');
		option.addEventListener('click', function () {
			const selectedCountry = this.textContent;
			const dropdownText = document.querySelector('.dropdown-text');

			// Set text and add title for tooltip on hover
			dropdownText.textContent = selectedCountry;
			dropdownText.setAttribute('title', selectedCountry);

			const dropdownTrigger = document.getElementById('dropdown');
			if (dropdownTrigger) {
				dropdownTrigger.classList.remove('focus');
			}

			// store the selected options key in the hidden input field
			document.getElementById('selectedCountryCode').value = this.getAttribute('value');

			// Close dropdown and return focus to trigger
			toggleDropdown();
		});
		// Add keyboard support for Enter/Space
		option.addEventListener('keydown', function(event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				this.click();
			}
		});
		// Add title attribute to each option for tooltip on hover
		option.setAttribute('title', option.textContent);
	});
}

// This function ensures that the dropdown is initialized correctly when the page is shown from cache
ICIMS.addEvent(window, 'pageshow', initializeDropdown);

// Handler to close dropdown when clicking outside
function handleDocumentClick(event) {
	const dropdown = document.querySelector('.country-code');
	const options = document.getElementById('dropdownOptions');

	if (dropdown && options && !dropdown.contains(event.target)) {
		requestAnimationFrame(() => {
			if (!options.classList.contains('hidden')) {
				options.classList.add('hidden');
				options.style.display = 'none';
				const dropdownTrigger = document.getElementById('dropdown');
				if (dropdownTrigger) {
					dropdownTrigger.setAttribute('aria-expanded', 'false');
					dropdownTrigger.classList.remove('focus');
				}
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('click', handleDocumentClick);
});

function clearFocus() {
	var dropdownList = document.querySelector('.dropdown-results');
	dropdownList.querySelectorAll('li').forEach(item => {
		item.classList.remove('focused');
	});
}

function updateFocus(options) {
	clearFocus();
	if (focusedIndex >= 0 && focusedIndex < options.length) {
		const focusedItem = options[focusedIndex];
		var dropdownList = document.querySelector('.dropdown-results');
		if (focusedItem) {
			focusedItem.classList.add('focused');
			// Manual scroll logic
			const itemTop = focusedItem.offsetTop;
			const itemBottom = itemTop + focusedItem.offsetHeight;
			const containerScrollTop = dropdownList.scrollTop;
			const containerHeight = dropdownList.clientHeight;
			if (itemTop < containerScrollTop) {
				dropdownList.scrollTop = itemTop;
			} else if (itemBottom > containerScrollTop + containerHeight) {
				dropdownList.scrollTop = itemBottom - containerHeight;
			}
		}
	}
}

function getVisibleOptions() {
	var dropdownList = document.querySelector('.dropdown-results');
	return Array.from(dropdownList.querySelectorAll('li')).filter(
		option => option.style.display !== 'none'
	);
}

function handleArrowNavigation(event, direction, options) {
	if (options.length === 0) return;
	event.preventDefault();

	if (direction === 'down') {
		focusedIndex = focusedIndex < options.length - 1 ? focusedIndex + 1 : 0;
	} else {
		focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
	}
	updateFocus(options);
}

function handleEnterKey(event, options) {
	if (options.length > 0 && focusedIndex >= 0 && focusedIndex < options.length) {
		event.preventDefault();
		options[focusedIndex].click();
	}
}

function handleEscapeKey(event, dropdownTrigger) {
	event.preventDefault();
	toggleDropdown();
	dropdownTrigger.focus();
}

function initializeKeyboardNavigation() {
	var dropdownSearch = document.querySelector('.dropdown-search');
	var dropdownList = document.querySelector('.dropdown-results');
	var dropdownTrigger = document.getElementById('dropdown');

	// Handle dropdown trigger keyboard events
	if (dropdownTrigger) {
		dropdownTrigger.addEventListener('keydown', function (event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				toggleDropdown();
				if (dropdownSearch) {
					dropdownSearch.focus();
				}
			}
		});
	}

	// Handle search input keyboard navigation
	if (dropdownSearch) {
		dropdownSearch.addEventListener('keydown', function (event) {
			var options = getVisibleOptions();

			switch (event.key) {
				case 'ArrowDown':
					handleArrowNavigation(event, 'down', options);
					break;
				case 'ArrowUp':
					handleArrowNavigation(event, 'up', options);
					break;
				case 'Enter':
					handleEnterKey(event, options);
					break;
				case 'Escape':
					handleEscapeKey(event, dropdownTrigger);
					break;
			}
		});
	}

	// Reset focus when dropdown closes
	if (dropdownList) {
		dropdownList.addEventListener('hidden.bs.dropdown', function () {
			focusedIndex = -1;
			clearFocus();
		});
	}
}

// This code initializes the dropdown and sets up the event listeners for filtering options.
document.addEventListener('DOMContentLoaded', function () {
	initializeDropdown();
	initializeDropdownOptions();
	initializeKeyboardNavigation();
});

if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		initializeDropdown: initializeDropdown,
		toggleDropdown: toggleDropdown,
		filterOptions: filterOptions,
		initializeDropdownOptions: initializeDropdownOptions,
		initializeKeyboardNavigation: initializeKeyboardNavigation,
		updateFocus:updateFocus,
		handleArrowNavigation: handleArrowNavigation,
		handleEnterKey: handleEnterKey,
		handleEscapeKey: handleEscapeKey,
		handleDocumentClick: handleDocumentClick
	};
}
