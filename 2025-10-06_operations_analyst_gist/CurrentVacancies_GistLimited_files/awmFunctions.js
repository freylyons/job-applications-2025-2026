function processAwm(e)
{
	var reqUrl = e.req.requestUrl;
	var successResp = e.event;
	var redirectUrl = awmCallBackUrl;
	if ( currentUserId > 0 )
	{
		redirectUrl = awmJSCallBackUrl + "/" + reqId;
	}
	if ( successResp === "success" )
	{
		jQuery.ajax(awmPostUrl, {
			type: "post",
			data: { "reg_url" : reqUrl, "isAjaxRequest" : true, "req_id" : reqId
			},
			dataType: "json",
			success: function(data){
				if ( 0 == data.duplicate )
				{
					window.location = redirectUrl;
				}
				else
				{
					var iframe = document.getElementById("awm_monsAwmIframe");
					iframe.src = awmDuplicateUrl + "/" + reqId + "/" + companyName + "/" + jobTitle + "/" + jobLocation;
                    
				}
			},
			error: function(xhr, status, error) {
			  //alert("An AJAX error occured: " + status + "\nError: " + error);
			}
		});
	}
	
	
}

jQuery(document).ready(function(){
	
});
