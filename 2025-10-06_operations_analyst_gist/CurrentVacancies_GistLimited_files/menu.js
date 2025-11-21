function menu_init()
{
	if ( ! window.XMLHttpRequest )
	{
		// Initialize vertical menu
		// Check for DOM support.
		if(!document.getElementById && !document.createTextNode)
		{
			return;
		}
		else
		{
			//horizontal_source = document.getElementById('tier2_submenu');
			horizontal_source = document.getElementById('hua_menu_tier2_bar').childNodes[0];

			if ( horizontal_source != undefined )
			{
				hmenu = new HorizontalMenu( horizontal_source );
				horizontal_source.className += horizontal_source.className == '' ? "menu_js" : " menu_js";
				hmenu.trasverse();
			}
		}
	}
}

function HorizontalMenu( source )
{
	var hidden_item='hidden_item';			//gets applied to hide the nested UL
	var shown_item='shown_item';			//gets applied to show the nested UL
	this.source = source;
	this.expandOrCollapseCall = true;

	function expandOrCollapse( source )
	{
		var container = source.getElementsByTagName('ul')[0];

		// Is the parent branch expanded?
		if ( container.className == shown_item )
		{
			// Hide the Branch
			container.className = hidden_item;
		//	if ( menuIframe ) menuIframe.style['display'] = 'none';
		}
		else if ( container.className == hidden_item )
		{
			// Expand the branch
			container.className = shown_item;
			// Fix for IE6, so expanded branch goes over any select boxes in the desktop area.
	    	fixIEWithIFrame(container);            
		}
	}

	function expand( source )
	{
		var container = source.getElementsByTagName('ul')[0];
		container.className = shown_item;
	}

	function collapse( source )
	{
		var container = source.getElementsByTagName('ul')[0];
		container.className = hidden_item;
	}

	function collapseHorizontalMenu( link )
	{
		// Look for parents, until we get a 'menu_js' class.
		// This marks the container menu element
		var mymenu = link;

		while( mymenu.className != 'no_hover_item menu_js' )
		{
			mymenu = mymenu.parentNode;
		}

		var children = mymenu.childNodes;
		for(i = 0; i < children.length; i++)
		{
			menu_slice = children[i].childNodes;
			for ( j = 0; j < menu_slice.length; j++ )
			{
				if ( menu_slice[j].tagName == 'UL' )
				{
					menu_slice[j].parentNode.onmouseover = function(){};
					menu_slice[j].parentNode.onmouseout = function(){};
					menu_slice[j].className = hidden_item;

				}
			}
		}

	}

	this.trasverse = function( )
	{
		// For this menu slice, get its direct children
		var children = this.source.childNodes;

		for(i = 0; i < children.length; i++)
		{
			menu_slice = children[i].childNodes;
			for ( j = 0; j < menu_slice.length; j++ )
			{
				if ( menu_slice[j].tagName == 'UL' )
				{
					menu_slice[j].className = hidden_item;
					menu_slice[j].parentNode.onmouseover = function(){expand(this);}
					menu_slice[j].parentNode.onmouseout = function(){collapse(this);}

					// Let's get all the links inside this UL
					mylinks = menu_slice[j].getElementsByTagName('a');
					if ( mylinks.length )
					{
						for ( k = 0; k < mylinks.length; k++ )
						{
							mylinks[k].onclick = function(){collapseHorizontalMenu(this);}
						}
					}
				}
			}
		}
		return;
	}
}

/******* Get the absolute X (left) coordinate *******/
function menu_findPosX(obj)
{
	var curleft = 0;
    if( obj.offsetParent )
    {
    	while( obj.offsetParent )
        {
        	curleft += obj.offsetLeft
        	obj = obj.offsetParent;
        }
    }
    else if( obj.x )
    {
        curleft += obj.x;
    }
    return curleft;
}

/******* Get the absolute Y (top) coordinate *******/
function menu_findPosY(obj)
{
	var curtop = 0;
    if( obj.offsetParent )
    {
    	while( obj.offsetParent )
    	{
        	curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    }
    else if( obj.y )
    {
    	curtop += obj.y;
    }
    return curtop;
}
