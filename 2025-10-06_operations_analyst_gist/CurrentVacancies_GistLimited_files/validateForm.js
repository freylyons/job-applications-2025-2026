var Validator = Class.create(
{
	initialize: function()
	{
		this.validationOptions = {
			errorIDPostfix: "_errors", 		// postfix of the id of the element that will attach to the name or id of the form element
			requiredStrategy: 'NotEmpty',	// the name of a strategy that tests if a required field is set or not
			notRequiredStrategy: 'Blank'	// the name of a strategy that tests if a field is empty or not
		}

		this.validationParams = new Hash();
		this.formFieldsWithErrors = new Hash();
	},
	
	setValidationParams: function( key, value )
	{
		this.validationParams.set( key, value );
	},
	
	addListener: function( fieldId )
	{
		var theField = $(fieldId);
		if ( theField )
		{		
			Event.observe( theField, 'blur', this.blurAction.bindAsEventListener( this, theField ) );
		}
	},

	blurAction: function( e, theField )
	{
		var value;
		var params;
		var errorMessages = new Array();
		var hasValidationError = false;
		var notRequiredAndBlank = false;
		var isRadio = false;
		var isRequired = false;
	
		value = theField.value;
		classes = theField.className;
		if ( theField.hasClassName( 'VStrategy' + this.validationOptions['requiredStrategy'] ) )
		{
			isRequired = true;
		}
	
		if ( classes )
		{
			classes.trim();
			classes = RemoveDuplicates(classes);
			classes = classes.split(" ");
		
			//isRequired check here
			if ( isRequired )
			{
				var requiredStrategy = this.validationOptions[ 'requiredStrategy' ];
				var paramValue = this.validationParams.get( theField.id + '|' + requiredStrategy );	
				hasValidationError = xajax_validateFieldAjax( requiredStrategy, theField.id, value, paramValue );
				if ( hasValidationError )
				{
					errorMessages.push( hasValidationError );
				}
			}
			else
			{
				hasValidationError = xajax_validateFieldAjax( this.validationOptions['notRequiredStrategy'], theField.id, value, {} );
				if ( ! hasValidationError )
				{
					notRequiredAndBlank = true;
				}
			}
			
			// if the field is not required and it's blank, there's no need to check the rest of the validation rules
			// if the field is required and blank, there's no need to check the validation rules - they will all fail since the field is blank
			if ( ( !isRequired && !notRequiredAndBlank ) || ( isRequired && errorMessages.size() == 0 ) )
			{	
				for ( c=0; c < classes.length; c++ )
				{
					if ( ( (classes[c]+'') == '' ) ||														// if the class name is empty OR
						 ( (classes[c]+'').indexOf('VStrategy') != 0 ) ||									// the class name is not a validation strategy OR
						 ( (classes[c]+'') == ('VStrategy'+this.validationOptions['requiredStrategy']) ) )	// the class is the required strategy (since it's handled before)
					{ 
						continue;
					}
					
					var strategy = classes[c].substr(9);
					var paramsIndex = theField.id + '|' + strategy;
					var params = this.validationParams.get( paramsIndex );
			
					hasValidationError = xajax_validateFieldAjax( strategy, theField.id, value, params );
					if ( hasValidationError )
					{
						errorMessages.push( hasValidationError );
					}
				}
			}
			
			if( errorMessages.size() )
			{
				this.setFieldErrors( theField.id, errorMessages );
				//var fieldsWithErrors = this.formFieldsWithErrors.get( form_ref );
				//fieldsWithErrors.set( the_field, true );
				//this.formFieldsWithErrors.set( form_ref, fieldsWithErrors );
			}
			else
			{
				this.clearFieldErrors( theField.id );
				//var fieldsWithErrors = this.formFieldsWithErrors.get( form_ref );
				//fieldsWithErrors.unset( the_field );
				//this.formFieldsWithErrors.set( form_ref, fieldsWithErrors );
			}
			
			//this.updateSubmitButtonActivation( theField.up('form') );
		}
		
		Event.stop(e);
	},
	
	setFieldErrors: function( field, errorMessages )
	{
		var error_container = $( field + this.validationOptions['errorIDPostfix'] );
		if ( error_container && errorMessages.size() )
		{
			error_container.update( errorMessages.join('; ') );
		}
		
		if ( $( field ) )
		{
			$( field ).addClassName( 'hasValidationError' );
		}
	},
	
	clearFieldErrors: function( field )
	{
		var error_container = $( field + this.validationOptions['errorIDPostfix'] );
		if ( error_container )
		{
			error_container.update('');
		}
		
		if ( $( field ) )
		{
			$( field ).removeClassName( 'hasValidationError' );
		}
	},
	
	updateSubmitButtonActivation: function( form_name )
	{
		var fieldsWithErrors = this.formFieldsWithErrors.get( form_name );
		if ( fieldsWithErrors.size() > 0 )
		{
			//alert('TODO: deactivate submit button per Diana');
		}
		else
		{
			//alert('TODO: activate submit button per Diana');	
		}
	}
});


String.prototype.trim = function()
{
	a = this.replace(/^\s+/, '');
	return a.replace(/\s+$/, '');
};

function isArray() 
{
	if ( typeof arguments[0] == 'object' )
	{ 
		var criterion = arguments[0].constructor.toString().match(/array/i); 
		return ( criterion != null ); 
	}
	return false;
}

function RemoveDuplicates( arr )
{
	if ( isArray( arr ) )
	{
		arr.sort();
		returnArray = true;
	}
	else
	{
		returnArray = false;
		arr.trim();
		arr = arr.split(" ");
		arr.sort();
	}
	
	var result = new Array();
	var lastValue = "";
	for ( var i=0; i<arr.length; i++ )
	{
		var curValue = arr[i];
		if ( curValue != lastValue )
		{
			result[result.length] = curValue;
		}
		lastValue = curValue;
	}
	
	if ( !returnArray )
	{
		var newResult = "";
		for ( var a=0; a < result.length; a++ )
		{
			newResult += result[a] + " ";
		}
		newResult.trim();
		result = newResult;
	}
	return result;
}

var formValidator = new Validator();
