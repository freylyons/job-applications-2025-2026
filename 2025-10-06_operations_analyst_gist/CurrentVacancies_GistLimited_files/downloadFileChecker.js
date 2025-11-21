
/**
 * @Author: aprildepliyan
 * @DateCreated: Feb. 24, 2017
 * @Description: This function is use for checking if the file being downloaded has still records in DB
**/
function downloadFileValidation(e,obj,jId,isId)
{
    if(isId == "" || isId == "undefined" || isId == undefined){isId = false;}
    var noFileFound = false;
    var findFileIfExists = false;
    var id = 0;
    var postData = {};
    var action = '';
    var strHref = jQuery(obj).attr('href');
    var str = strHref.split("?");
    if(str[0] != "/display_document.php" && !isId && str[0] != "/document_library.php")
    {
        if(str[1] != "" && str[1] != "undefined" && str[1] != undefined)
        {
            var strSplit = str[1].replace(/&amp;/g,'&');
            var strSplitAnd = strSplit.split("&");
            if(strSplitAnd == "" || strSplitAnd == "undefined" || strSplitAnd == undefined){strSplitAnd = strSplit;}
            if(strSplitAnd.length > 1)
            {
                for (x=0;x<=strSplitAnd.length;x++)
                {
                    tmpStr = strSplitAnd[x];
                    if (tmpStr.substring(0, 25) == "download_offer_attachment") {
                        findFileIfExists = true;
                        id = tmpStr.split("=");
                        action = tmpStr.substring(0, 25);
                        break;
                    }
                    else if (tmpStr.substring(0, 26) == "download_resume_attachment") {
                        findFileIfExists = true;
                        id = tmpStr.split("=");
                        action = tmpStr.substring(0, 26);
                        break;
                    }
                }  
            } else {
                strSplitAnd = strSplitAnd.toString();
                if (strSplitAnd.substring(0, 25) == "download_offer_attachment") {
                    findFileIfExists = true;
                    id = strSplitAnd.split("=");
                    action = strSplitAnd.substring(0, 25);
                }
                else if (strSplitAnd.substring(0, 26) == "download_resume_attachment") {
                    findFileIfExists = true;
                    id = strSplitAnd.split("=");
                    action = strSplitAnd.substring(0, 26);
                } 
            }
             
        } 
    }
    else if(str[0] == "/document_library.php" && !isId)
    {
        if(str[1] != "" && str[1] != "undefined" && str[1] != undefined)
        {
            var strSplit = str[1].replace(/&amp;/g,'&');
            var strSplitAnd = strSplit.split("&");
            if(strSplitAnd == "" || strSplitAnd == "undefined" || strSplitAnd == undefined){strSplitAnd = strSplit;}
            if(strSplitAnd.length > 1)
            {
                for (x=0;x<=strSplitAnd.length;x++)
                {
                    tmpStr = strSplitAnd[x];
                    if (tmpStr.substring(0, 12) == "download_doc") {
                        findFileIfExists = true;
                        id = tmpStr.split("=");
                        action = tmpStr.substring(0, 12);
                        break;
                    }
                } 
            } else {
                strSplitAnd = strSplitAnd.toString();
                if (strSplitAnd.substring(0, 12) == "download_doc") {
                    findFileIfExists = true;
                    id = strSplitAnd.split("=");
                    action = strSplitAnd.substring(0, 12);
                }
            }
              
        } 
    }
    else if(isId) //This is for other downloads that do not use the url display_document.php and still pass file id in href
    {
        findFileIfExists = true;
        action = "file_id";
        id = jId;
        jId = "";
    }
    else
    {
        var strSplit = str[1].replace(/&amp;/g,'&');
        var strSplitAnd = strSplit.split("&");
        if(strSplitAnd == "" || strSplitAnd == "undefined" || strSplitAnd == undefined){strSplitAnd = strSplit;}
        if(strSplitAnd.length > 1)
        {
            for (x=0;x<=strSplitAnd.length;x++)
            {
                tmpStr = strSplitAnd[x];
                if (tmpStr.substring(0, 11) == "zipfile_ids" || tmpStr.substring(0, 11) == "document_id") {
                    findFileIfExists = true;
                    id = tmpStr.split("=");
                    action = tmpStr.substring(0, 11);
                    break;
                }
                else if (tmpStr.substring(0, 7) == "file_id") {
                    findFileIfExists = true;
                    id = tmpStr.split("=");
                    action = tmpStr.substring(0, 7);
                    break;
                }
            }
        } else {
            strSplitAnd = strSplitAnd.toString();
            if (strSplitAnd.substring(0, 11) == "zipfile_ids" || strSplitAnd.substring(0, 11) == "document_id") {
                findFileIfExists = true;
                id = strSplitAnd.split("=");
                action = strSplitAnd.substring(0, 11);
            }
            else if (strSplitAnd.substring(0, 7) == "file_id") {
                findFileIfExists = true;
                id = strSplitAnd.split("=");
                action = strSplitAnd.substring(0, 7);
            }
        }
        
    }

    if(findFileIfExists)
    {
        if(id[1] != "" && id[1] != "undefined" && id[1] != undefined){
            postData = {id: id[1], action: action};
        } else {
            postData = {id: id, action: action};
        }
        
        if(jId != "" && jId != "undefined" && jId != undefined){
            postData['jId'] = jId;
        } 
        jQuery.ajax({
            type: "POST",
            url: checkDownloadFile,
            dataType: "json",
            async:false,
            data: postData,
            success: function( data )
            {
                if(data)
                {
                    if(data.confirmed)
                    {
                        noFileFound = true;
                    }
                }
            }
        });
    }

    if(noFileFound)
    {
        display_failed(alertFileMissing);
        e.preventDefault();
    }
}