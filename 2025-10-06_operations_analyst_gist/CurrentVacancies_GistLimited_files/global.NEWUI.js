/**
* Global "swap" holder
* Use value, null, if no layer initially visible
*/
var currLayerId = "panorama-appraisals";

/**
* This function toggles the display value for an element
*/
function togLayer(id)
{
	if (currLayerId)
	{
		setDisplay(currLayerId, "none");
	}
	if (id)
	{
		setDisplay(id, "block");
	}
	currLayerId = id;
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This function sets the CSS display value for an element
*/
function setDisplay(id, value)
{
	jQuery("#" + id).css('display', value);
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This function sets autocomplete="off" for elements with the "autocomplete_off" class
*/
function autocompleteOff()
{
	jQuery('.autocomplete_off').attr('autocomplete', 'off');
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This function toggles the visibility of the on-page instructions box
*/
function InstructionBox(container, showtext, hidetext, noheader)
{
	jQuery("#" + container).slideToggle(400, function()
	{
		/* Mantis 154609 - toggle instructions link text in popup windows */
		if (noheader)
		{
			jQuery("#instruction_toggle").toggleClass('expanded');

			if (jQuery("#instruction_toggle").hasClass('expanded'))
			{
				jQuery("#instruction_toggle").html(hidetext);
			}
			else
			{
				jQuery("#instruction_toggle").html(showtext);
			}
		}
	});
}
/*
jQuery("#instructionContainer .close").click(function(e)
{
	jQuery("#instructionContainer").slideToggle();
	e.preventDefault();
});
*/

/**
* @author Eric Lavender <elavender@hrsmart.com>
* General use function for consistent button disabling across the application
*/
function disableFormButton(elementId)
{
	var btn = jQuery("#" + elementId);
	if (btn)
	{
		btn.addClass("disabled");
		btn.prop("disabled", true);
	}
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* General use function for consistent button enabling across the application
*/
function enableFormButton(elementId)
{
	var btn = jQuery("#" + elementId);
	if (btn)
	{
		btn.removeClass("disabled");
		btn.prop("disabled", false);
	}
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This is the centralized show/hide children function used throughout the application
*/
function show_hide_children( id )
{
	var arrow_element = jQuery('#' + id + '_arrow');
	var arrow_inactive = 'fa-caret-right';
	var arrow_active = 'fa-caret-down';

	jQuery('#' + id + '_children').toggle();

	if( arrow_element.hasClass(arrow_inactive) )
	{
		arrow_element.toggleClass(arrow_inactive + " " + arrow_active);
	}
	else
	{
		arrow_element.toggleClass(arrow_active + " " + arrow_inactive);
	}
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This will toggle the wizard/steps on mobile devices
*/
jQuery('.steps-toggle>a').on('keypress click', function(e)
{
     if (e.which === 13 || e.type === 'click') {
        //jQuery(this).parents('.setup-panel').find('li').not('.active, .steps-toggle').slideToggle();
        jQuery(this).parents('.setup-panel').find('li').not('.active, .steps-toggle').fadeToggle( "fast", function() {

                var something = jQuery(this).attr('style');

                if(something == "display: none;")
                {
                        jQuery(this).attr('style', "display: ''");
                }
        });

        jQuery(this).toggleClass('expanded');

        if (jQuery(this).hasClass('expanded'))
        {
                jQuery(this).find('p').text('Hide Steps');
        }
        else
        {
                jQuery(this).find('p').text('View Steps');
        }
			}
});

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This will toggle the Filter container
*/
jQuery(document).on("keydown click", ".filter-toggle", function(e)
{
	if (e.which === 13 || e.type === 'click') {
        toggleFilterCard(this);
	    jQuery(this).find(".fa").toggleClass('fa-toggle-right fa-toggle-down');
        jQuery("#filter-header").toggleClass('filter-underline');

  }
});
jQuery(document).on("keydown click", ".filter-close", function(e)
{
	if (e.which === 13 || e.type === 'click') {
        toggleFilterCard(this);
	    jQuery(this).parents(".form-filter").prev(".filter-toggle").find(".fa").toggleClass('fa-toggle-right fa-toggle-down');
        jQuery("#filter-header").toggleClass('filter-underline');

	}
});

function toggleFilterCard(obj)
{
	var target = jQuery(obj).next(".form-filter");
	
	if(0 == target.length)
	{
		target = jQuery(obj).closest(".form-filter");
	}
	
    if(jQuery(target).prev("#filter-header").hasClass('filter-underline'))
    {
        target.stop().hide();
    }
    else
    {
        target.stop().slideToggle();
    }
}

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This will enable dropdowns to show when placed towards the bottom of a responsive table
*/
function dropDownFixPosition(button, dropdown, shown, initialDropdown)
{
	if (shown)
	{
		// check if dropdown should be displayed upwards by checking if the dropdown is overlapping the document
		if(button.offset().top + button.outerHeight() + dropdown.outerHeight() > jQuery(document).outerHeight())
		{
			// added 5px margin to add space between the dropdown and the button
			var additionalMargin = 5;
			// calculate for dropDownTop : top position of the dropdown relative to the page and the button
			var dropDownTop = button.offset().top - jQuery(window).scrollTop() - dropdown.outerHeight() - additionalMargin;
			var mainMenuHeight = jQuery("#hua_header_bar.affix").outerHeight()
			var headerHeight = button.parents("table").find("thead.header-fixed").outerHeight();
			// calculate for offsetScroll which is the main menu and the table header if any
			var offsetScroll = mainMenuHeight + headerHeight;

			//check if the dropdown overlaps the table header and the main menu : 95 = width of main menu and table header
			// added the initialDropdown parameter to check for show event and prevent the page from scrolling
			if(offsetScroll > dropDownTop && initialDropdown===true)
			{
				// calculate for the dropdown's position and animate to scroll smoothly to full view
				jQuery("html, body").animate({scrollTop:button.offset().top - dropdown.outerHeight() - (offsetScroll + additionalMargin)});
			}
		}
		else
		{
			var dropDownTop = button.offset().top - jQuery(window).scrollTop() + button.outerHeight();
			dropDownTop = (dropDownTop < button.offset().top + button.outerHeight()) ? dropDownTop : button.offset().top + button.outerHeight();
		}

		if (dropdown.hasClass("dropdown-menu-right"))
		{
			var offsetLeft = button.outerWidth() + button.offset().left - dropdown.outerWidth();
		}
		else
		{
			var offsetLeft = button.offset().left;
		}

		dropdown.css({
			position: "fixed",
			top: dropDownTop,
			left: offsetLeft,
			right: "auto"
		});
	}
	else
	{
		dropdown.css({
			position: "fixed",
			top: "",
			left: "",
			right: ""
		});
	}
}

jQuery(".table-responsive .dropdown").on('show.bs.dropdown', function()
{
	dropDownFixPosition(jQuery(this).find("[data-bs-toggle='dropdown']"), jQuery(this).find('.dropdown-menu'), true, true);
});
jQuery(".table-responsive .dropdown").on('hide.bs.dropdown', function()
{
	dropDownFixPosition(jQuery(this).find("[data-bs-toggle='dropdown']"), jQuery(this).find('.dropdown-menu'), false);
});
jQuery(window).on('scroll', function()
{
	var openDropdowns = jQuery(".table-responsive .dropdown.open");

	if (openDropdowns.length > 0)
	{
		openDropdowns.each(function()
		{
			dropDownFixPosition(jQuery(this).find("[data-bs-toggle='dropdown']"), jQuery(this).find('.dropdown-menu'), true);
		});
	}
});
jQuery(".table-responsive").on('scroll', function()
{
	var openDropdowns = jQuery(".table-responsive .dropdown.open");

	if (openDropdowns.length > 0)
	{
		openDropdowns.each(function()
		{
			dropDownFixPosition(jQuery(this).find("[data-bs-toggle='dropdown']"), jQuery(this).find('.dropdown-menu'), true, true);
		});
	}
});

/**
* @author Eric Lavender <elavender@hrsmart.com>
* This will style <input type="file"> elements
*/
jQuery(document).on('change', '.btn-file :file', function(){
	var input = jQuery(this),
	numFiles = input.get(0).files ? input.get(0).files.length : 1,
	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
});
jQuery(document).on('focus', '.btn-file input', function(){
	jQuery( "span.btn-file" ).addClass( 'btn-file-focus' );
});
jQuery(document).on('keydown', '.btn-file input', function(e){
	if (e.keyCode === 13) {
	    e.preventDefault();
		  jQuery("span.btn-file input").click();
		 jQuery("span.btn-file").next("input").focus();
	 }
});

jQuery(document).on('blur', '.btn-file input', function(){
	jQuery( "span.btn-file" ).removeClass( 'btn-file-focus' );
});
//keyboard compatibility with file upload in IE
jQuery(document).ready( function(){
	jQuery(document).on('fileselect', '.btn-file :file', function(event, numFiles, label)
	{
		var input = jQuery(this).parents('.input-group').find(':text'),
		log = numFiles > 1 ? numFiles + ' files selected' : label;

		if (input.length)
		{
			input.val(log);
		}
		else
		{
			if (log) alert(log);
		}
	});

	/**
	* @author Ermin Pepito <erminpepito@deltek.com>
	* This will validate <input type="file"> elements for file size (if supported)
	*/
	jQuery('input[type="file"]').on("change", function() {
		if (window.File && window.FileReader && window.FileList && window.Blob)
		{
			var uploaded_file_size = this.files[0].size;
			var max_file_siz_element = jQuery('#' + this.id + 'MAX_FILE_SIZE');
			var max_file_size_setting = max_file_siz_element.val();
			var max_dir_size_setting = max_file_siz_element.data('dirsize');
			var used_size = max_file_siz_element.data('usedsize');
			var exceeded_file_upload_message = jQuery('#' + this.id + '_message').val();
			var excedded_dir_upload_size = (used_size+uploaded_file_size > max_dir_size_setting);

			if (uploaded_file_size > max_file_size_setting || excedded_dir_upload_size)
			{
				//instead of an alert, I placed it in the error span
				jQuery('#' + this.id + '_errors').html(exceeded_file_upload_message);
				return false;
			}
			else
			{
				//if span validation exists, then clears the error message
				if(jQuery('#' + this.id + '_errors').length > 0 )
				{
					jQuery('#' + this.id + '_errors').html('');
				}
				return true;
			}
		}
	});

});

/**
* @author John Lagahit <jlagahit@hrsmart.com>
* This will filter contents in landing pages that have search inputs
*/
if(jQuery('.right-inner-addon input[type=search]').length > 0)
{
	//Extend :contains and make it case insensitive
	jQuery.extend(jQuery.expr.pseudos, {
	  'containsFilter': function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
	  }
	});

	jQuery('.right-inner-addon input[type=search]').on("keyup", function(){
		var dashboardType = this.id.split('-search')[0];
		var filter = this.value;

		if(dashboardType)
		{
			jQuery('.' +dashboardType+ '-dashboard li:containsFilter(' +filter+ ')').show();
			jQuery('.' +dashboardType+ '-dashboard li:not(:containsFilter(' +filter+ '))').hide();
		}
	});
}
/**
* @author Meredith Avila <mavila@hrsmart.com>
* Hides tooltip when scrolling in mobile or any other non-opportune time
*/
jQuery('body').on('touchmove', function () {
    jQuery('[data-toggle="tooltip"], .tooltip').tooltip("hide");
})



var navDropdown = jQuery('#user_navitem_video_training, #user_navitem_talent_information_center, #user_help_on_this_page');
navDropdown.on("click", function () {
	jQuery(this).closest('.dropdown-menu').toggleClass('show');
});
