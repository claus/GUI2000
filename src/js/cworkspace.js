
//
// _CWorkspace class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CWorkspace()
{
	this.x = 0;
	this.y = 0;
	this.width = _CFrame.isNav ? window.innerWidth : document.body.clientWidth;
	this.height = _CFrame.isNav ? window.innerHeight : document.body.clientHeight;

	this.childObj = null;
	this.parentObj = null;
	this.parentLayer = _CFrame.isNav ? window : document.body;
	this.childLayer = null;
	this.baseLayer = null;

	this.container = new Array();
	this.dragXOffset = null;
	this.dragYOffset = null;
	
	this.setFrameStyle(this.FRAME_FLAT);
	this.setClientFrame(true);
	this.setBGColor("#008284");
}

//
// inheritance
// from _CFrame
//

_CWorkspace.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CWorkspace.prototype.toString =
	function()
	{
		return "_CWorkspace";
	}


_CWorkspace.prototype.buildLayers =
	function(visible)
	{
		var wndLay;
		var wndLayID = _CFrame.getUniqueID();

		if(_CFrame.isIE)
		{
			txt = "<div ID=" + wndLayID + " style='position:absolute'></div>";
			this.parentLayer.insertAdjacentHTML("BeforeEnd", txt);
		
			wndLay = eval("document.all." + wndLayID);
			wndLay.style.left = this.x;
			wndLay.style.top = this.y;
			wndLay.style.width = this.width;
			wndLay.style.height = this.height;
			wndLay.style.zIndex = 0;
			wndLay.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
			if(this.CLIENTAREA_BACKGROUND != null)
				wndLay.style.backgroundImage = "url(" + this.CLIENTAREA_BACKGROUND + ")";
		}
		else
		{
			wndLay = new Layer(this.width, this.parentLayer);
			wndLay.left = this.x;
			wndLay.top = this.y;
			wndLay.clip.height = this.height;
			wndLay.clip.width = this.width;
			wndLay.zIndex = 0;
			wndLay.bgColor = this.CLIENTAREA_BGCOLOR;
			if(this.CLIENTAREA_BACKGROUND != null)
				wndLay.background.src = this.CLIENTAREA_BACKGROUND;
		}
			
		this.baseLayer = wndLay;
		this.childLayer = wndLay;
		
		this.setEventHandler();

		// generate additional frame system objects
		// i.e. caption, menus, statusbar
		this.buildObjects(0);

		// generate client objects
		// (objects, that reside in the client area)
		this.buildObjects(1);

		// initialize the zindices
		// of the baselayers
		this.normalizeZIndices();

		if(_CFrame.isIE)
			this.baseLayer.style.visibility = visible;
		else
			this.baseLayer.visibility = visible;

		_CWorkspace.addWorkspaceObject(this);
	}


_CWorkspace.prototype.normalizeZ_Sort =
	function(a, b)
	{
		var aa = (typeof a[1] != "undefined") ? a[1] : 0;
		var bb = (typeof b[1] != "undefined") ? b[1] : 0;
		return aa - bb;
	}

_CWorkspace.prototype.normalizeZIndices =
	function()
	{
		var i;
		var z = new Array();
		for(i = 0; i < this.container.length; i++)
		{
			var zIdx;
			if(_CFrame.isIE)
				zIdx = this.container[i][2].baseLayer.style.zIndex;
			else
				zIdx = this.container[i][2].baseLayer.zIndex;
			z[i] = new Array(this.container[i][2].baseLayer, zIdx);
		}		
		z.sort(this.normalizeZ_Sort);
		for(i = 0; i < z.length; i++)
		{
			if(_CFrame.isIE)
				z[i][0].style.zIndex = 100 + i;
			else
				z[i][0].zIndex = 100 + i;
		}
	}
	
	
_CWorkspace.prototype.setEventHandler =
	function()
	{
		if(_CFrame.isNav)
		{
			this.baseLayer.captureEvents(Event.MOUSEDOWN | 
																	 Event.MOUSEMOVE |
																	 Event.MOUSEUP);
			
			//this.baseLayer.captureEvents(Event.CLICK | 
																	 //Event.DBLCLICK | 
																	 //Event.DRAGDROP | 
																	 //Event.KEYDOWN |
																	 //Event.KEYPRESS |
																	 //Event.KEYUP |
																	 //Event.MOUSEDOWN |
																	 //Event.MOUSEMOVE |
																	 //Event.MOUSEOUT |
																	 //Event.MOUSEOVER |
																	 //Event.MOUSEUP |
																	 //Event.RESIZE);
			//window.captureEvents(Event.RESIZE);
		}
		
		//this.baseLayer.onclick = this.handleOnClick;
		//this.baseLayer.ondblclick = this.handleOnDblClick;
		this.baseLayer.onmousedown = this.handleOnMouseDown;
		this.baseLayer.onmousemove = this.handleOnMouseMove;
		this.baseLayer.onmouseup = this.handleOnMouseUp;
		//this.baseLayer.onmouseout = this.handleOnMouseOut;
		//this.baseLayer.onmouseover = this.handleOnMouseOver;

		// handle the onresize-event
		// (bind it to the window object)
		// window.onresize = this.handleOnResize;
	}


_CWorkspace.prototype.handleOnMouseDown =
	function(evt)
	{
		var layArr = _CWorkspace.getLayer(evt);
		
		// route messages to childs
		for(i = 0; i < _CWorkspace.wsArr[0].container.length; i++)
		{
			if(layArr.length > 0 && _CWorkspace.wsArr[0].container[i][2].baseLayer == layArr[0][0])
			{
				_CWorkspace.wsArr[0].container[i][2].sendMsg("MSG_ACTIVATE");
				_CWorkspace.wsArr[0].container[i][2].sendEvt("EVT_MOUSEDOWN", layArr);
			}
			else
				_CWorkspace.wsArr[0].container[i][2].sendMsg("MSG_DEACTIVATE");
		}
	}

_CWorkspace.prototype.handleOnMouseMove =
	function(evt)
	{
		var x = (_CFrame.isIE) ? window.event.clientX : evt.pageX;
		var y = (_CFrame.isIE) ? window.event.clientY : evt.pageY;
		
		var txt = "";
		txt = "mousemove ";
		txt += x + " " + y;
		window.status = txt;
	}

_CWorkspace.prototype.handleOnMouseUp =
	function(evt)
	{
		var layArr = _CWorkspace.getLayer(evt);
		
		// route messages to childs
		for(i = 0; i < _CWorkspace.wsArr[0].container.length; i++)
		{
			if(layArr.length > 0 && _CWorkspace.wsArr[0].container[i][2].baseLayer == layArr[0][0])
			{
				_CWorkspace.wsArr[0].container[i][2].sendEvt("EVT_MOUSEUP", layArr);
			}
		}
	}



//
// globals
//

_CWorkspace.wsArr = new Array();

_CWorkspace.addWorkspaceObject =
	function(obj)
	{
		if(_CFrame.isIE)
			_CWorkspace.wsArr[_CWorkspace.wsArr.length] = obj;
		else
			_CWorkspace.wsArr.push(obj);
		return _CWorkspace.wsArr.length - 1;
	}


_CWorkspace.getLayer =
	function(evt)
	{
		var layArr = new Array();
		
		if(_CFrame.isNav)
		{
			var i;
			var max = 0;

			_CWorkspace.getLayerRecursive(document.layers, evt.pageX, evt.pageY, true, 0, 0, layArr);

			layArr.sort(_CWorkspace.sortLayArr);
			layArr.reverse();

			for(i = 0; i < layArr.length; i++)
			{
				if(layArr[i][2] > max)
					max = layArr[i][2];
				else
				{
					layArr.length = i;
					break;
				}
			}
		}
		else
		{
			var i;
			var lay = window.event.srcElement;
			while(lay != document.body)
			{
				layArr[layArr.length] = new Array(lay, lay.style.zIndex, 0);
				lay = lay.offsetParent;
			}
			layArr.reverse();

			for(i = 0; i < layArr.length - 1; i++)
				layArr[i] = layArr[i+1];
			layArr.length -= 1;
		}

		return layArr;
	}


_CWorkspace.getLayerRecursive =
	function(lay, x, y, visible, level, zidx, layArr)
	{
		var i;
		for(i = 0; i < lay.length; i++)
		{
			if(lay[i].visibility != "inherit")
			{
				if(lay[i].visibility == "hide")
					visible = false;
				else
					visible = true;
			}

			if(lay[i].zIndex != 0)
				zidx = lay[i].zIndex;

			if(lay[i].pageX <= x && x < lay[i].pageX + lay[i].clip.width && 
				 lay[i].pageY <= y && y < lay[i].pageY + lay[i].clip.height &&
				 visible)
			{
				layArr.push(new Array(lay[i], zidx, level));
			}

			_CWorkspace.getLayerRecursive(lay[i].document.layers, x, y, visible, level+1, zidx, layArr);
		}
	}

_CWorkspace.sortLayArr =
	function(a, b)
	{
		// sort evtarr:
		// 1. zindex ascending
		// 2. level descending
		if(a[1] != b[1])
			// sort zindex
			return a[1] - b[1];
		else
			// sort level
			return b[2] - a[2];
	}
