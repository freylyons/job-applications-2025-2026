/**
 * Inserts an element at a given position in an array.
 *
 * @author ngieczewski
 * @param  value    The element to be inserted into the array.
 * @param  position The position at which the element is to be inserted.
 */
Array.prototype.insert = function(element, position)
{
	for (var i = this.length; i > position; i--)
	{
		this[i] = this[i - 1];
	}
	this[position] = element;
}

/**
 * Removes the element at a given position in an array.
 *
 * @author ngieczewski
 * @param  index The position of the element to be removed from the array.
 */
Array.prototype.removeByIndex = function(index)
{
	for (var i = index; i < this.length - 1; i++)
	{
		this[i] = this[i + 1];
	}
	this.length--;
}

/**
 * Removes an element from an array.
 *
 * @author ngieczewski
 * @param  element The element to be removed from the array.
 */
Array.prototype.removeByElement = function(element)
{
	var index = this.indexOf(element);
	if (index != -1)
	{
		this.removeByIndex(index);
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Returns the index of a given element in an array.
 *
 * @author ngieczewski
 * @param  element The element whose index is desired.
 * @return         The index of the element in the array, or -1 if not found.
 */
Array.prototype.indexOf = function(element)
{
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == element)
		{
			return i;
		}
	}
	return -1;
}

// check to make sure we have a same defaults (set from master)
if( typeof onloads_global == 'undefined' )
{
	var onloads_global = new Array();
}
if( typeof _lang_badwordcheck == 'undefined' )
{
	_lang_badwordcheck = 'Badwordcheck';
}

/* BadwordCheck function
   can be called with different number of parameters
    3 - formname, textbox array name, and textbox array index
    2 - formname, textbox name (not array)
    1 - formname (use hidden post field to define badwordchecktextname=textbox_name)
*/

function find_text_boxes()
{
	var icon = document.createElement("i");
	icon.setAttribute('class' , _img_badwordcheck );
	icon.setAttribute('data-bs-toggle' , 'tooltip' );
	icon.setAttribute('title', _lang_badwordcheck );

	myforms = document.forms;
    for( i=0; i < myforms.length; i++ )
    {
		textareas = myforms[i].getElementsByTagName('textarea');
        for( y=0; y < textareas.length; y++ )
        {
			if( ! textareas[y].id )
	        {
		        textareas[y].id = 'spellcheck_textarea_id_' + i + '_' + y;
	        }

			if(_enable_badwordcheck)
			{	
            badwordlink = document.createElement('a');
            badwordlink.setAttribute('id','abadwordlink');
            badwordlink.setAttribute('href',"javascript:badwordCheck(" + i + ", '" + textareas[y].id + "')");
            badwordlink.appendChild( icon.cloneNode(true) );
            textareaParent = textareas[y].parentNode;
            textareaParent.insertBefore( badwordlink, textareas[y].nextSibling );
        	}
        }
    }
}



function onload_init()
{
    for( var i=0; i<onloads_global.length; i++ )
    {
        onloads_global[i]();
    }
}

function getTextareaText(textarea)
{
	if ( textarea )
	{
		return textarea.value;
	}
}


// http://stackoverflow.com/questions/645555/should-jquerys-form-submit-not-trigger-onsubmit-within-the-form-tag
// For prevention of form submission issues that are do not fire their event handler
function submitForm(form) {
	// if we have a jQuery selector, get the first match of form passed to this
	// otherwise we expect a form object from getElementById
	if(form instanceof jQuery && form[0] instanceof Element)
	{
		form = form[0];
	}
    //get the form element's document to create the input control with
    //(this way will work across windows in IE8)
    var button = form.ownerDocument.createElement('input');
    //make sure it can't be seen/disrupts layout (even momentarily)
    button.style.display = 'none';
    //make it such that it will invoke submit if clicked
    button.type = 'submit';
    //append it and click it
    form.appendChild(button).click();
    //if it was prevented, make sure we don't get a build up of buttons
    form.removeChild(button);
}

//http://stackoverflow.com/questions/2830542/prevent-double-submission-of-forms-in-jquery
// jQuery plugin to prevent double submission of forms
function preventDoubleSubmission(formid) {
  jQuery('#'+formid).on('submit',function(e){
    var formElem = jQuery('#'+formid);

    if (formElem.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      formElem.data('submitted', true);
    }
  });

  // Keep chainability
  return jQuery('#'+formid);
}

function badwordCheck( formIndex, boxId )
{
   	var form = document.createElement('form');
   	form.action = '/badwordcheck.php?noheader=1&badwordchecktextname=badwordcheckThis';
   	form.target = 'badwordcheck';
   	form.method = 'post';
   	var data = document.createElement('input');
   	data.type='hidden';
   	data.name = 'badwordcheckThis';

	//Copy ckeditor content to textarea if CKEditor ticket: #130678
	if(document.getElementById('cke_'+ boxId)){
	    document.getElementById(boxId).innerHTML =  CKEDITOR.instances[boxId].getData();
	}

	//default value
	textarea = document.getElementById(boxId)
	data.value = getTextareaText(textarea);

	// Dynamic forms put a field_ prefix to the field name. We have to remove it
	var dynamic_field_regexp = new RegExp("field_(.*)");
	var match_dynamic = dynamic_field_regexp.exec(boxId);
	var tetit = textarea.name + "___Frame";

	if( (match_dynamic != undefined) && match_dynamic[1] )
	{
		tetit = match_dynamic[1] + "___Frame";
	}

   	if(document.getElementById(tetit)){ // 'bodyTextbox___Frame' is for letter template page
		var t = document.getElementById(tetit);
		var a = t.contentWindow.document.getElementById('xEditingArea');
		var b = a.childNodes[0];
		var c = b.contentWindow.document.body;
   		data.value = c.innerHTML;
   	}
	
	var field_html = data.value.toString();
	data.value = field_html.replace(/\<br\ \/\>/ig, "\n ");
	
   	form.appendChild(data);
   	document.body.appendChild(form);
   	window.open('','badwordcheck','top=0,left=0,directories=no,height=600,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no,width=600');
   	submitForm(form);
   	document.body.removeChild(form);
}

/*  the following blog for manager mode section @rongke gao
	this is for the manager mode/token mode
	initiate the pop up box
*/
var w3c=(document.getElementById)? true: false;
var ie5=(w3c && document.all)? true : false;
var ns6=(w3c && (navigator.appName=="Netscape"))? true: false;
function manager_mode(mode){
	var pars = "set_manager_mode=1&manage_mode=1";
	var url = "http://"+window.location.hostname + "/index.php";
	var myAjax = new Ajax.Updater('',url,{method:'post',onComplete: manager_mode_set,parameters:pars});
}

function manager_mode_set(req){
	if(req.responseText){
		window.location.reload();
	}
}
function remove_button(){
	var i, all_input, main;
   	for(i=0; (all_input = document.getElementsByTagName("input")[i]); i++) {
   		if(all_input.getAttribute("type") == "button" || all_input.getAttribute("type") == "submit"){
   			new Insertion.After(all_input,all_input.getAttribute("value"));
   			all_input.style.display = "none";
   			all_input.setAttribute("value",all_input.getAttribute("name"));
   		}
   	}
}
function create_box(x,y,w,h,id){
	if(ie5){
		var h = h + 4;
		var w = w + 4;
	}

	var my_div=document.createElement('div');
	my_div.setAttribute('id',id);
	my_div.style.position='absolute';
	my_div.style.left=x+'px';
	my_div.style.top=y+'px';
	my_div.style.visibility='visible';
	my_div.style.padding='0px 0px 0px 0px';
	return my_div;
}

function display_box(x,y,h,w,id,text){
	var outerdiv=new create_box(x,y,w,h,id);
	outerdiv.style.borderStyle="outset";
	outerdiv.style.borderWidth="2px";
	outerdiv.style.zIndex=20;
	outerdiv.innerHTML = text;
	document.body.appendChild(outerdiv);
}

function token_setting(t_n,l_i){
	var img_id = "img_"+t_n;

	var text = "<form name=token_setting_form><table style='width: 365px;'>" +
 					"<tr><td colspan=2 class='trcolor' ><b>Update Token</b></td></tr>" +
 					"<tr><td class='tdcolor2' style='height:25px;'><b>Current Token</b></td>" +
 						"<td class='tdcolor'>"+ $(t_n) +"<input type='hidden' value="+l_i+" id='lan_id' name='lan_id'></td></tr>"+
 					"<tr><td class='tdcolor2' ><b>Token Translation</b><input type='hidden' value="+t_n+" id='tk_name' name='tk_name'></td>" +
 						"<td class='tdcolor' ><textarea rows='8' cols='41' name=token_trans id=token_trans>"+$(t_n).innerHTML+"</textarea></td></tr> "+
 					"<tr><td class='tdcolor2' style='height:35px;' colspan='2' align='center'><input type='button' class='button' value='Update Token' onclick=token_updating()>&nbsp;<input type=button class='button' value=Cancel onclick=cancel_manager_mode('token_mode_setting','"+t_n+"')></td></tr>"+
 				"</table></form>";
	var h = (ie5)?202:214;
 	display_box(280, 100, h, 450,"token_mode_setting",text);

 	removeHref(img_id);

 	$('token_mode_setting').innerHTML = $('token_mode_setting').innerHTML + "<!--[if lte IE 6.5]><iframe></iframe><![endif]-->";
 	$('token_mode_setting').className = "select-free";

 	Position.clone('app_main_id','manager_xxxx');
 	Element.show('manager_xxxx');

	$('app_main_id').style.zIndex = 1;
}
function token_updating(){
	var url = "http://"+window.location.hostname + "/language_core.php";

	var pars = "manager_mode_token=1&hua_language_token_translation="+$F('token_trans')+"&hua_language_id="+$F('lan_id')+"&hua_language_token="+$F('tk_name');
	var myAjax = new Ajax.Updater('',url,{method:'post',onComplete: token_updated,parameters:pars});
}

function token_updated(req){
	if(req.responseText){
		var cur_token = req.responseText;
		var tk_img = "img_"+cur_token;
		//alert(req.responseText+" ::");
		if($('token_trans')){
			$new_trans = $F('token_trans');
			$(cur_token).innerHTML = $new_trans;
		}
		//close_pop_box("token_mode_setting",cur_token);
		cancel_manager_mode("token_mode_setting",cur_token);
	}
}

function cancel_manager_mode(cur_div,img_id){
	if($(cur_div)){
		$(cur_div).innerHTML = "";
		$(cur_div).style.display = "none";
		document.body.removeChild($(cur_div));

	}
	$('manager_xxxx').style.display = "none";
	if(img_id){
		img_div = "img_"+img_id;
		removeHref(img_div);
	}
}
var on = "";
var back ="";
function removeHref(h){
	var id=document.getElementById(h);

	if(on){
		var that_href= id.parentNode.getAttribute('href_rgao');
		if(that_href && that_href != "" && that_href != null){
			id.parentNode.setAttribute( "href", that_href);
			id.parentNode.removeAttribute('href_rgao');
			on = "";
			return false;
		}

	}
	else{
		var this_href= id.parentNode.getAttribute('href');
		if(this_href && this_href != "" && this_href != null){

			on = "1";
			id.parentNode.setAttribute('href_rgao', this_href);
			id.parentNode.removeAttribute('href');
		}
	}
	return false;
}

//this section is for the site implemention
var isMozilla;
var objDiv = null;
var originalDivHTML = "";
var DivID = "";
var over = false;

var windowStateArray = new Array(); // Minimized or maximized
function MouseDown(e) {
    if (over)    {
        if (isMozilla) {
            objDiv = document.getElementById(DivID);
            X = e.layerX;
            Y = e.layerY;
            return false;
        }
        else {
            objDiv = document.getElementById(DivID);
            objDiv = objDiv.style;
            X = event.offsetX;
            Y = event.offsetY;
        }
    }
}
function MouseMove(e) {
    if (objDiv) {
        if (isMozilla) {
            objDiv.style.top = (e.pageY-Y) + 'px';
            objDiv.style.left = (e.pageX-X) + 'px';
            return false;
        }
        else
        {
            objDiv.pixelLeft = event.clientX-X + document.body.scrollLeft;
            objDiv.pixelTop = event.clientY-Y + document.body.scrollTop;
            return false;
        }
    }
}

function MouseUp(){
    objDiv = null;
}

function init(){// check browser
    isMozilla = (document.all) ? 0 : 1;
    if (isMozilla) document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);

    document.onmousedown = MouseDown;
    document.onmousemove = MouseMove;
    document.onmouseup = MouseUp;
}

function box_action(target,act){
	DivID = "";
	$(target).innerHTML = "";
	$(target).style.display = "none";
	document.body.removeChild($(target));
}

function site_implement_win() {
	var myH = screen.height;
	var myW = screen.width;

	var newH = (myH - 350)/2;
	var newW = (myW - 350)/2;
	var url = "http://"+window.location.hostname + "/implementation.php?display=1";
	window.open(url, 'implement_win', 'width=450,height=350,resizable=0,fullscreen=no,left='+newW+',top='+newH+',resizable=0,scrollbars=1,statusbar=0,locationbar=0,menubar=0,personalbar=0,toolbar=0');
}

//check a var in an JS array, like PHP
function in_array(stringToSearch, arrayToSearch) {
	for (s = 0; s <arrayToSearch.length; s++) {
		thisEntry = arrayToSearch[s].toString();
		if (thisEntry == stringToSearch) {
			return true;
		}
	}
	return false;
}

//this function get the page size
function getPageSize() {
	var myWidth = 0, myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	}
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	}
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	var pageInfo = new Array(myWidth,myHeight);
	return pageInfo;
}
//this function check/uncheck the form
var checkboxbulkchecked = false;
function bulkAction(myfrmVar){
	if(!myfrmVar) return false;
	if(checkboxbulkchecked){
		for (var i=0; i < myfrmVar.length; i++){
			myfrmVar[i].checked = false;
		}

		if(myfrmVar.length == undefined) myfrmVar.checked = false;
		checkboxbulkchecked = false;
	}
	else{
		for (var i=0; i < myfrmVar.length; i++){
			myfrmVar[i].checked = true;
		}
		if(myfrmVar.length == undefined){
			myfrmVar.checked = true;
		}

		checkboxbulkchecked = true;
	}
}
//this function reset the form
function resetForm(frm){
	var myFrm = document.getElementById(frm);
	var i,all_input;
	for(i=0; (all_input = myFrm.getElementsByTagName("input")[i]); i++) {
   		if(all_input.getAttribute("type") == "text"){
   			all_input.value = "";
   			all_input.setAttribute("value",'');
   		}
   	}
}
//remove whitespace
function trimString (str) {
	while (str.charAt(0) == ' '){
		str = str.substring(1);
	}
	while (str.charAt(str.length - 1) == ' '){
		str = str.substring(0, str.length - 1);
	}
	return str;
}

//obtain the scrolling offsets.
function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

/**
* simple email validation
*/
function validate_email( email )
{
	if (/^([a-z0-9])(([-a-z0-9._+\'])*([a-z0-9]))*\@[a-z0-9]+?[-a-z0-9](\.([a-z0-9])([-a-z0-9_-])?([a-z0-9])+)+$/i.test( email ))
	{
		return true;
	}
 	return false;
}

function getElementsByClassName(oElm, strTagName, strClassName){
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/-/g, "\-");
	var oRegExp = new RegExp("(^|\s)" + strClassName + "(\s|$)");
	var oElement;
	for(var i=0; i<arrElements.length; i++){
		oElement = arrElements[i];
		if(oRegExp.test(oElement.className)){
			arrReturnElements.push(oElement);
		}
	}
	return (arrReturnElements)
}
function hide_message_display()
{
	// HIDE VALIDATION ERRORS IF EXISTS
	var validation_error_div = document.getElementById( '_validation_errors_div' );
	if( validation_error_div && ( validation_error_div != "undefined" ) )
	{
		validation_error_div.style.display = 'none';
	}

	// HIDE SUCCESS/FAILED MESSAGES IF EXISTS
	var success_failed_div = document.getElementById( 'successOrFail' );
	if( success_failed_div && ( success_failed_div != "undefined" ) )
	{
		success_failed_div.style.display = 'none';
	}
}

// THIS FUNCTION IS A FIX FOR IE
function getElementsByName(tag, name)
{
	var elem = document.getElementsByTagName(tag);
	var arr = new Array();
	for( i = 0, iarr = 0; i < elem.length; i++ )
	{
          att = elem[i].getAttribute("name");
          if(att == name)
          {
               arr[iarr] = elem[i];
               iarr++;
          }
     }
     return arr;
}


/**
 * FIXES FOR LAYOUT
 */

var fixBodyWidth_already_called = false;
function fixBodyWidth()
{
	if ( document.all )
	{
		var i=0;
		var biggerWidth = 0;
		var tables = document.getElementsByTagName( 'table' );
		for ( i = 0; i < tables.length; i++ )
		{
	
			if ( biggerWidth < tables[i].offsetWidth )
			{
				biggerWidth = tables[i].offsetWidth;
			}
		}

		if ( biggerWidth && !fixBodyWidth_already_called)
		{
			/* the number 50 is the sum of the borders plus the desktop's
			 * margins and paddings.
				 */
			var newWidth = biggerWidth + 40;
			if( document.body.offsetWidth <= newWidth )
			{
				document.body.style.width = newWidth + 'px';
			}
		}
	}
}

/* This toggles visibility
 * This has been created b/c prototype's toggle() only toggles display:none/block and
 * not visibility:hidden/visible.
 *
 * Note: This function requires prototype.js
 * @param string theElement (This can be either the id or name thanks to prototype)
 * @return true
 * @author Andrew Walker <awalker@hrsmart.com>
 */
function toggle_visibility( theElement )
{
	if( $(theElement).style.visibility == 'visible' )
	{
		$(theElement).style.visibility = 'hidden';
	}
	else
	{
		$(theElement).style.visibility = 'visible';
	}

 	return true;
}

/** This rounds corners inside successOrFail.
 * Taken from http://webdesign.html.it/articoli/leggi/528/more-nifty-corners/1/
 *
 * @author Melina Szarfsztejn <melina@hrsmart.com>
 * @author Ermin Pepito <epepito@hrsmart.com> - added parameter so it can be applied to a parent window
 */

function NiftyCheck(apply_to_parent){
var doc = ( opener && apply_to_parent ) ? opener.document : document;
if(!doc.getElementById || !doc.createElement)
    return(false);
isXHTML=/html\:/.test(doc.getElementsByTagName('body')[0].nodeName);
if(Array.prototype.push==null){Array.prototype.push=function(){
      this[this.length]=arguments[0]; return(this.length);}}
return(true);
}

function Rounded(selector,wich,bk,color,opt, apply_to_parent){
var i,prefixt,prefixb,cn="r",ecolor="",edges=false,eclass="",b=false,t=false;

if(color=="transparent"){
    cn=cn+"x";
    ecolor=bk;
    bk="transparent";
    }
else if(opt && opt.indexOf("border")>=0){
    var optar=opt.split(" ");
    for(i=0;i<optar.length;i++)
        if(optar[i].indexOf("#")>=0) ecolor=optar[i];
    if(ecolor=="") ecolor="#666";
    cn+="e";
    edges=true;
    }
else if(opt && opt.indexOf("smooth")>=0){
    cn+="a";
    ecolor=Mix(bk,color);
    }
if(opt && opt.indexOf("small")>=0) cn+="s";
prefixt=cn;
prefixb=cn;
if(wich.indexOf("all")>=0){t=true;b=true}
else if(wich.indexOf("top")>=0) t="true";
else if(wich.indexOf("tl")>=0){
    t="true";
    if(wich.indexOf("tr")<0) prefixt+="l";
    }
else if(wich.indexOf("tr")>=0){
    t="true";
    prefixt+="r";
    }
if(wich.indexOf("bottom")>=0) b=true;
else if(wich.indexOf("bl")>=0){
    b="true";
    if(wich.indexOf("br")<0) prefixb+="l";
    }
else if(wich.indexOf("br")>=0){
    b="true";
    prefixb+="r";
    }
var v=getElementsBySelector(selector, apply_to_parent);
var l=v.length;
for(i=0;i<l;i++){
    if(edges) AddBorder(v[i],ecolor, apply_to_parent);
    if(t) AddTop(v[i],bk,color,ecolor,prefixt, apply_to_parent);
    if(b) AddBottom(v[i],bk,color,ecolor,prefixb, apply_to_parent);
    }
}

function AddBorder(el,bc, apply_to_parent){
	var doc = ( opener && apply_to_parent ) ? opener.document : document;
	var i;
	if(!el.passed){
	    if(el.childNodes.length==1 && el.childNodes[0].nodeType==3){
	        var t=el.firstChild.nodeValue;
	        el.removeChild(el.lastChild);
	        var d=CreateEl("span", apply_to_parent);
	        d.style.display="block";
	        d.appendChild(doc.createTextNode(t));
	        el.appendChild(d);
	        }
	    for(i=0;i<el.childNodes.length;i++){
	        if(el.childNodes[i].nodeType==1){
	            el.childNodes[i].style.borderLeft="1px solid "+bc;
	            el.childNodes[i].style.borderRight="1px solid "+bc;
	            }
	        }
	    }
	el.passed=true;
}
    
function AddTop(el,bk,color,bc,cn, apply_to_parent){
	var i,lim=4,d=CreateEl("b", apply_to_parent);
	
	if(cn.indexOf("s")>=0) lim=2;
	if(bc) d.className="artop";
	else d.className="rtop";
	d.style.backgroundColor=bk;
	for(i=1;i<=lim;i++){
	    var x=CreateEl("b", apply_to_parent);
	    x.className=cn + i;
	    x.style.backgroundColor=color;
	    if(bc) x.style.borderColor=bc;
	    d.appendChild(x);
	    }
	el.style.paddingTop=0;
	el.insertBefore(d,el.firstChild);
}

function AddBottom(el,bk,color,bc,cn, apply_to_parent){
	var i,lim=4,d=CreateEl("b", apply_to_parent);
	
	if(cn.indexOf("s")>=0) lim=2;
	if(bc) d.className="artop";
	else d.className="rtop";
	d.style.backgroundColor=bk;
	for(i=lim;i>0;i--){
	    var x=CreateEl("b", apply_to_parent);
	    x.className=cn + i;
	    x.style.backgroundColor=color;
	    if(bc) x.style.borderColor=bc;
	    d.appendChild(x);
	    }
	el.style.paddingBottom=0;
	el.appendChild(d);
}

function CreateEl(x, apply_to_parent){
	var doc = ( opener && apply_to_parent ) ? opener.document : document;
	if(isXHTML) return(doc.createElementNS('http://www.w3.org/1999/xhtml',x));
	else return(doc.createElement(x));
}

function getElementsBySelector(selector, apply_to_parent){
	var doc = ( opener && apply_to_parent ) ? opener.document : document;
	var i,selid="",selclass="",tag=selector,f,s=[],objlist=[];
	
	if(selector.indexOf(" ")>0){  //descendant selector like "tag#id tag"
	    s=selector.split(" ");
	    var fs=s[0].split("#");
	    if(fs.length==1) return(objlist);
	    f=doc.getElementById(fs[1]);
	    if(f) return(f.getElementsByTagName(s[1]));
	    return(objlist);
	    }
	if(selector.indexOf("#")>0){ //id selector like "tag#id"
	    s=selector.split("#");
	    tag=s[0];
	    selid=s[1];
	    }
	if(selid!=""){
	    f=doc.getElementById(selid);
	    if(f) objlist.push(f);
	    return(objlist);
	    }
	if(selector.indexOf(".")>0){  //class selector like "tag.class"
	    s=selector.split(".");
	    tag=s[0];
	    selclass=s[1];
	    }
	var v=doc.getElementsByTagName(tag);  // tag selector like "tag"
	if(selclass=="")
	    return(v);
	for(i=0;i<v.length;i++){
	    if(v[i].className.indexOf(selclass)>=0){
	        objlist.push(v[i]);
	        }
	    }
	return(objlist);
}

function Mix(c1,c2){
	var i,step1,step2,x,y,r=new Array(3);
	if(c1.length==4)step1=1;
	else step1=2;
	if(c2.length==4) step2=1;
	else step2=2;
	for(i=0;i<3;i++){
	    x=parseInt(c1.substr(1+step1*i,step1),16);
	    if(step1==1) x=16*x+x;
	    y=parseInt(c2.substr(1+step2*i,step2),16);
	    if(step2==1) y=16*y+y;
	    r[i]=Math.floor((x*50+y*50)/100);
	    }
	return("#"+r[0].toString(16)+r[1].toString(16)+r[2].toString(16));
}

// I'm only running it for IE6/7
function roundSuccessOrFail(apply_to_parent)
{
	var doc = ( opener && apply_to_parent ) ? opener.document : document;
	if ( doc.all )
	{
		if(!NiftyCheck(apply_to_parent))
			return;
		Rounded("div#failed","all","#FFFFFF","#FFDCCE","border #FFCCB8", apply_to_parent);
		Rounded("div#success","all","#FFFFFF","#e3ffd3","border #009900", apply_to_parent);
	}
}

/**
 * @author nbezi
 * @param bool apply_to_parent
 * @param object domObj - success/fail div dom id
 * @return
 */
function fixIEWithIFrame(domObj)
{
	if ( document.all )
	{
		if (!domObj.fixWithIFrame)
		{
			// Creating the IFrame
			var iFrameFix = document.createElement('IFRAME');
			iFrameFix.style.border = '0px';
			iFrameFix.style.filter = 'alpha(opacity=0)';
			iFrameFix.style.opacity = '0';
			iFrameFix.style.position = 'absolute';
			iFrameFix.style.zIndex = domObj.style.zIndex-1;
			//this must be a found url or we get a redirect which unfortunately brings us to a
			//non SSL page, throwing a warning in IE6
			iFrameFix.src = '/images/menufix.gif';
			//iFrameFix.style.display = 'none';
			iFrameFix.style.display = 'inline';
		}
		else
		{
			var iFrameFix = domObj.fixWithIFrame;
		}
		
		domObj.appendChild(iFrameFix);
		Element.absolutize(domObj);
		Element.clonePosition(iFrameFix, domObj);
		domObj.fixWithIFrame = iFrameFix;
		
		domObj.onresize = function()
		{
			if (this.fixWithIFrame)
			{
				Element.absolutize(this);
				Element.clonePosition(this.fixWithIFrame, this);
			}
		}
	}
}

function fixIETabbed_Interface_Actions_Menus()
{
	if (document.all)
	{
		var huaRibbonActionElements = $$('div.tabbed_interface_actions');
		if (huaRibbonActionElements)
		{
			for (var i = 0, huaRibbonActionElementsLength = huaRibbonActionElements.length; i < huaRibbonActionElementsLength; ++i) {
				huaRibbonActionElements[i].observe('mouseenter', function(e) {
					if (!e) var e = window.event;
					e.srcElement.style.zIndex = '300';
					if (e.srcElement.parentNode.parentNode) e.srcElement.parentNode.parentNode.style.zIndex = '300';
					if (e.srcElement.parentNode.parentNode.parentNode) e.srcElement.parentNode.parentNode.parentNode.style.zIndex = '300';
				});
				huaRibbonActionElements[i].observe('mouseleave', function(e) {
					if (!e) var e = window.event;
					e.srcElement.style.zIndex = '100';
					if (e.srcElement.parentNode.parentNode) e.srcElement.parentNode.parentNode.style.zIndex = '10';
					if (e.srcElement.parentNode.parentNode.parentNode) e.srcElement.parentNode.parentNode.parentNode.style.zIndex = '10';
				});
			}
		}
	}
}

/***********************************************
Temporary hide for drop box under top navigation 
on /index while viewing notifications.

Mantis Ticket: 69664
 ***********************************************/
function toggleDropboxVisibility(divID)
{
	var el = document.getElementById(divID);
	if(el.style.display != 'none') 
	{ 
		el.style.display = 'none';
	} else {
		el.style.display = '';
	}
}

/**
* @author Safaa Alkhatib <salkhatib@hrsmart.com>
* This function is added to handle the use of escape with utf8 
*
* @see http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases
*/
function utf8_escape(s)
{
	if (window.encodeURIComponent)//check fn present in old browser
	{
		return unescape(encodeURIComponent(s));
	}
	else
	{
		return escape(s);
	}
}

/**
* @author Safaa Alkhatib <salkhatib@hrsmart.com>
* This function is added to handle the use of escape with utf8 
*
* @see http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases
*/
function utf8_unescape(s)
{
	if (window.decodeURIComponent)//check fn present in old browser
	{
		return decodeURIComponent(escape(s));
	}
	else
	{
		return unescape(s);
	}
}

// elavender - rewritten for jQuery (see global.NEWUI.js)
/**
 * autocomplete off
 */
/*
function autocompleteOff() {
	if (document.all == undefined ) {
		var input_elements = document.getElementsByClassName('autocomplete_off');
		for (var i = 0; i < input_elements.length; ++i)
		{
			input_elements[i].setAttribute('autocomplete', 'off');
		}	
	}
}
*/

// elavender - rewritten for jQuery (see global.NEWUI.js)
/**
 * Instruction box code
 */
/*
function InstructionBox(container, visible, showtext, hidetext, noheader)
{
	this.container = container;
	this.contentDomNode = this.container.getElementsByTagName("div")[0];
	this.lineBreakDomNode = $('instruction-linebreak');
	if (noheader)
	{
		this.linkDomNodes = this.container.getElementsByTagName("a");
		this.linkDomNode = this.linkDomNodes[this.linkDomNodes.length - 1];
	}
	else
	{
		this.linkContainer = $('instruction_toggle');
		
		if( this.linkContainer != null )
		{
			this.linkDomNodes = this.linkContainer.getElementsByTagName("a");
			this.linkDomNode = this.linkDomNodes[this.linkDomNodes.length - 1];
		}
		

	}
	this.visible = visible;
	this.showtext = showtext;
	this.hidetext = hidetext;

	this.init = function()
	{
		if(this.linkDomNode == null)
		{
			return false;
		}
		
		this.linkDomNode.style.display = "";
		if (this.visible)
		{
			this.expand();
		}
		else
		{
			this.collapse();
		}
		var instructionBox = this;
		this.linkDomNode.onclick = function()
		{
			instructionBox.linkDomNode.innerHTML = "";
			switch (instructionBox.visible)
			{
				case false:
					instructionBox.expand();
				break;
				case true:
					instructionBox.collapse();
				break;
			}
			return false;
		};
	}

	this.collapse = function()
	{
		this.contentDomNode.style.display = "none";
		this.lineBreakDomNode.style.display = "none";
		this.linkDomNode.innerHTML = this.showtext;
		this.visible = false;
	}

	this.expand = function()
	{
		this.contentDomNode.style.display = "";
		this.lineBreakDomNode.style.display = "";
		this.linkDomNode.innerHTML = "";
		this.linkDomNode.innerHTML = this.hidetext;
		this.visible = true;
	}

}
*/

/*
 * Set a Table Checkboxes funtionality
 * param: table id
 * if you want to exclude a checkbox from the masterbox funtionality, just add the class 'individual' to it
 */


/**
 * CheckAll function for general use
 */

function checkAllCheckboxes(obj, fieldName) 
{
	var toggle = obj.checked;
	var parentForm = $(obj.id).up('form');
	if( typeof parentForm != 'undefined' )
	{
		var checkBoxes = parentForm.getInputs('checkbox', fieldName);
		checkBoxes.each(function(check) {
			check.checked = toggle;
		});
	} 
}

// Set a Table Checkboxes funtionality
function setTableCheckboxesFunctionality (tableId) {
    var table = document.getElementById(tableId);
    if(table != undefined)
    {
    	var inputs = table.getElementsByTagName("input");
    	var isMasterCheckbox = true;
    	for (var i = 0 ; i < inputs.length; i++)
    	{
            if (inputs[i].type == "checkbox" && !hasTheClass(inputs[i], 'individual'))
            {
                if(isMasterCheckbox) {
                    var masterCheckbox = inputs[i];
                    masterCheckbox.onclick = function() {
                        setMasterCheckbox(table, masterCheckbox)
                    };
                    isMasterCheckbox = false;
                } else {
                    inputs[i].onclick = function(){
                        checkMasterCheckbox(table, masterCheckbox)
                    };
                }
            }
        }
    	checkMasterCheckbox (table, masterCheckbox);
    }
}

function setMasterCheckbox (table, masterCheckbox) {
        var inputs = table.getElementsByTagName("input");
        for (var i = 0 ; i < inputs.length; i++)
        {
                if (inputs[i].type == "checkbox" && !hasTheClass(inputs[i], 'individual'))
                {
                        inputs[i].checked = masterCheckbox.checked;
                }
        }

}

function checkMasterCheckbox (table, masterCheckbox) {
        var inputs = table.getElementsByTagName("input");
        for (var i = 1 ; i < inputs.length; i++)
        {
                if (inputs[i].type == "checkbox" && !hasTheClass(inputs[i], 'individual'))
                {
                    if(inputs[i].checked == false ){
                        masterCheckbox.checked = false;
                        return
                    }
                }
        }
        masterCheckbox.checked = true;
}

/*
 * Generic function that determines whether an element has a class, elementClass.
 * This function reuses part of jQuery's .hasClass() and written out of the necessity 
 * that this script may be included before jQuery is.  
 * @author Josel Pasilan <jpasilan@hrsmart.com>
 */
function hasTheClass(element, elementClass) {
	var className = " " + elementClass + " ";
	if(element.nodeType === 1 && (" " + element.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1 ) {
		return true;
	}
	return false;
}

/*
 * Reload tooltip after ajax request
 * 
 * @author Loriza Naingue <lorizanaingue@deltek.com>
 *  mantis #152293
 */

function showTooltip()
{
    jQuery.noConflict();
    jQuery('[data-bs-toggle=tooltip]').tooltip();

        // Fix Bootstrap tooltip conflict with Prototype
		(function() {
			var isBootstrapEvent = false;
			if (window.jQuery) {
				var bs_Tooltip = jQuery('[data-bs-toggle="tooltip"]');
				jQuery.each(['hide.bs.tooltip'], function(index, eventName) {
					bs_Tooltip.on(eventName, function( event ) {
						isBootstrapEvent = true;
					});
				});
			}
			var originalHide = Element.hide;
			Element.addMethods({
				hide: function(element) {
					if(isBootstrapEvent) {
						isBootstrapEvent = false;
						return element;
					}
					return originalHide(element);
				}
			});
		})();
}

function reInitializeTooltip()
{
    var isBootstrapEvent = false;
    var bs_Tooltip = jQuery('[data-bs-toggle="tooltip"]');
            jQuery.each(['hide.bs.tooltip'], function(index, eventName) {
                bs_Tooltip.on(eventName, function( event ) {
                    isBootstrapEvent = true;
                });
            });
    var originalHide = Element.hide;
        Element.addMethods({
            hide: function(element) {
                if(isBootstrapEvent) {
                    isBootstrapEvent = false;
                    return element;
                }
                return originalHide(element);
            }
        });
}

/**
 * mvestil - 156323
 * This will reinitialize the bootstrap events that got conflicted with prototype.
 * This is useful when an html is loaded dynamically via ajax. 
 * These events need to be initialized manually to the newly loaded elements to fix prototype-bootstrap conflict because the codes in master.tpl will not work in newly loaded elements.
 * @params parentelem - we must pass the parent element of the newly loaded html for efficiency.
 */
function reInitializeBootstrapEventsWithParent(parentelem) 
{
	// The codes in master.tpl are being copied here..
	var isBootstrapEvent = false;
	
	var bs_Collapse = parentelem.find('[data-bs-toggle="collapse"]');
	jQuery.each(['hide.bs.collapse'], function(index, eventName) {
		bs_Collapse.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	//var bs_Dropdown = jQuery('[data-bs-toggle="dropdown"]');
	var bs_Dropdown = parentelem.find('*');
	jQuery.each(['hide.bs.dropdown'], function(index, eventName) {
		bs_Dropdown.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	var bs_Modal = parentelem.find('[data-bs-toggle="modal"]');
	jQuery.each(['hide.bs.modal'], function(index, eventName) {
		bs_Modal.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	var bs_Tooltip = parentelem.find('[data-bs-toggle="tooltip"]');
	jQuery.each(['hide.bs.tooltip'], function(index, eventName) {
		bs_Tooltip.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	var bs_Popover = parentelem.find('[data-bs-toggle="popover"]');
	jQuery.each(['hide.bs.popover'], function(index, eventName) {
		bs_Popover.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	var bs_Tabs = parentelem.find('[data-bs-toggle="tab"]');
	jQuery.each(['hide.bs.tab'], function(index, eventName) {
		bs_Tabs.on(eventName, function( event ) {
			isBootstrapEvent = true;
		});
	});
	
	var originalHide = Element.hide;
	Element.addMethods({
		hide: function(element) {
			if(isBootstrapEvent) {
				isBootstrapEvent = false;
				return element;
			}
			return originalHide(element);
		}
	});
}

/* DOM Mutation */
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

function check_uncheck_all(	me,	field_name )
{
	var	is_checked = me.checked;
	var	fields = document.getElementsByName(field_name+'[]');
	for( var i = 0;	i <	fields.length; i++ )
	{
		fields[i].checked =	is_checked;
	}
	return true;
}

// Observe a specific DOM element:
/*
observeDOM( document.getElementById('dom_element') ,function(){ 
    console.log('dom changed');
});
*/
