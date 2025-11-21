$(function() {
    $('.savesearch-link').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        /* Make sure that all of the configuration options needed exist, using
        the values from subscribeWidgetSetup, if it exists, or by creating
        defaults for the subscribe widget here. */
        var config = $.extend({
            action                : 'subscribe',
            usingJobAlertsManager : false
        }, typeof subscribeWidgetSetup === 'undefined' ? {} : subscribeWidgetSetup);

        if (j2w.Args.get('useCASWorkflow')) {
            var frequency, validationResult;
            var jobAlert = null;

            /* Collect all of the forms needed to create an agent. The selectors here must be very
            specific as search forms are used and reused on a page (typically in the mobile search menu
            and in the main body of the page) and a selection-by-id or selection-by-class of the search
            form itself usually grabs the wrong one. */
            var $searchForm = $('#innershell .jobAlertsSearchForm:visible');
            var $frequencyForm = $(this).closest('.savesearch-wrapper').find('input[name=frequency]:visible');

            /* When using the job alert manager, all of the information needed to create an alert
            can be obtained from form data, and the alert is validated differently. */
            if (config.usingJobAlertsManager) {
                /* Use the information in the combined search forms to populate an agent object. add()
                combines the multiple form elements into one object for processing. */
                jobAlert = j2w.Agent.buildAgentFromSearchForm($searchForm.add($frequencyForm));

                frequency = jobAlert.getFrequency();

                validationResult = j2w.Agent.validateAgent(jobAlert);
            } else {
                /* For regular subscribe forms, only the frequency is required and needs to be validated. */
                jobAlert = j2w.Agent.buildAgentFromSearchForm($frequencyForm);

                var result = j2w.Agent.validateFrequency(jobAlert.getFrequency());

                /* Manually create a validation object matching that of validateAgent() since
                validateFrequency() doesn't provide one, so that the validation logic works for either
                situation. */
                validationResult = {
                    valid       : !result.length,
                    validations : result
                };
            }

            // If the agent was valid, then proceed with the CAS workflow.
            if (validationResult.valid) {
                // Hide any lingering error messages while we process the agent and redirect the user.
                if (j2w.Args.get('isResponsive')) {
                    $('.frequency-error').addClass('hidden');
                }

                /* Since the save search form doesn't contain keywords and location, we've collected them
                separately above, and pass them along here. For job alert creation on the job alerts
                manager page, the entire agent is passed along, which affects
                j2w.User.getAgentProfileForExport(). */
                j2w.TC.collectForCASWorkflow({
                    agent        : (config.action === 'alertCreate' && config.usingJobAlertsManager) ? jobAlert : null,
                    emailAddress : '',
                    action       : config.action,
                    socialSrc    : '',
                    frequency    : jobAlert.getFrequency(),
                    keywords     : jobAlert.getKeywords(),
                    location     : jobAlert.getLocation()
                });
            } else {
                var aMessages = [];

                if (config.usingJobAlertsManager) {
                    // validationResult does not contain error messages. You have to look them up.
                    aMessages = j2w.Agent.getValidationErrors(validationResult.validations, jsStr);
                } else {
                    // When not using the job alerts manager, the errors are returned directly.
                    aMessages = validationResult.validations;
                }

                // Present the error messages from the failed validations based on the platform type.
                if (j2w.Args.get('isResponsive')) {
                    $('.invalid-feedback').attr( "style", "display: block !important;" );
                    $("div#savesearch").addClass('was-validated');
                    $('.frequency-error-message').html(aMessages.join('<br />'));
                    $('.frequencySpinBtn').attr('aria-invalid', "true");
                    $('.frequencySpinBtn').attr('aria-errormessage', "frequency-error-feedback");
                    $('.frequencySpinBtn').attr('tabindex', "0");
                    $('.frequencySpinBtn').focus();
                } else {
                    alert(aMessages.join('\n'));
                }
            }
        } else {
            $(this).parents().siblings('form[class~="emailsubscribe-form"]').slideToggle(250, function () {
                $(this).find('input[name=email]:visible').focus();
            });
        }
    }).parents().siblings('form[class~="emailsubscribe-form"]').hide();
});
