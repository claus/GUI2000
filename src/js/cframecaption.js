
//
// _CFrameCaption class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameCaption(_x, _y, _width, _height, _captionText, _icon, _minimize, _maximize, _close, _parentObj) //_systemMenu
{
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	this.captionText = _captionText;
	this.iconURL = _icon;
	this.closeBtn = _close;
	this.minimizeBtn = _minimize;
	this.maximizeBtn = _maximize;

	this.childObj = null;
	this.parentObj = null;
	this.parentLayer = null;

	if(typeof _parentObj == "undefined")
		this.parentLayer = _CFrame.getRootObject();
	else
	{
		this.parentObj = _parentObj;
		this.parentLayer = _parentObj.baseLayer;
	}

	this.childLayer = null;
	this.baseLayer = null;
	this.container = new Array();

	//this.CLIENTAREA_BGCOLOR = "#000084";
	this.CLIENTAREA_BGCOLOR = "Gray";
	this.CLIENTFRAME = true;
	
}

//
// inheritance
//

_CFrameCaption.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameCaption.prototype.toString =
	function()
	{
		return "_CFrameCaption";
	}


_CFrameCaption.prototype.buildLayers =
	function(visible)
	{
		var txt;
		var capLay;
		var wndLayID = _CFrame.getUniqueID();

		if(_CFrame.isIE)
		{
			txt = "<div ID=" + wndLayID + " style='position:absolute'></div>";
			this.parentLayer.insertAdjacentHTML("BeforeEnd", txt);
		
			capLay = eval("document.all." + wndLayID);
			capLay.style.left = this.x;
			capLay.style.top = this.y;
			capLay.style.width = this.width;
			capLay.style.height = this.height;
			capLay.style.clip = "rect(0px " + capLay.style.pixelWidth + "px " + capLay.style.pixelHeight + "px 0px)";
			capLay.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
		}
		else
		{
			capLay = new Layer(this.width, this.parentLayer);
			capLay.left = this.x;
			capLay.top = this.y;
			capLay.clip.width = this.width;
			capLay.clip.height = this.height;
			capLay.bgColor = this.CLIENTAREA_BGCOLOR;
		}

		this.baseLayer = capLay;

		var textX = 2;
		var textWidth = this.width - 4;

		if(this.iconURL != null)
		{
			this.addObject(0, 0, new _CFrameImage(2, 1, 16, 16, this.iconURL));
			textX += 18;
			textWidth -= 18;
		}
		if(this.closeBtn)
		{
			textWidth -= 16;
			this.addObject(0, 0, new _CFrameButton(textX + textWidth, 2, 16, 14, "images/button/13x11_close.gif"));
			textWidth -= 2;
		}
		if(this.maximizeBtn)
		{
			textWidth -= 16;
			this.addObject(0, 0, new _CFrameButton(textX + textWidth, 2, 16, 14, "images/button/13x11_maximize.gif"));
		}
		if(this.minimizeBtn)
		{
			textWidth -= 16;
			this.addObject(0, 0, new _CFrameButton(textX + textWidth, 2, 16, 14, "images/button/13x11_minimize.gif"));
		}
		
		this.addObject(0, 0, new _CFrameTextCaption(textX, 2, textWidth, this.height-4, this.captionText));
		
		this.buildObjects(0);

		if(_CFrame.isIE)
			this.baseLayer.style.visibility = visible;
		else
			this.baseLayer.visibility = visible;
	}




//
// custom eventhandler
//

_CFrameCaption.prototype.sendEvt =
	function(evt, layArr)
	{
		var i;

		// delete first layArr element
		// (contains this.baseLayer and is no longer needed)		
		for(i = 0; i < layArr.length - 1; i++)
			layArr[i] = layArr[i+1];
		layArr.length -= 1;

		// route events to childs
		if(layArr.length > 0)
		{
			for(i = 0; i < this.container.length; i++)
			{
				if(this.container[i][2].baseLayer == layArr[0][0])
				{
					this.container[i][2].sendEvt(evt, layArr);
					break;
				}
			}
		}

		// handle event for this class
		if(evt == "EVT_MOUSEDOWN")
		{
			alert("start dragging");
			//_CWorkspace.wsArr[0].dragXOffset = (_CFrame.isIE) ? window.event.offsetX : evt.pageX - 0; // todo
			//_CWorkspace.wsArr[0].dragYOffset = (_CFrame.isIE) ? window.event.offsetY;
			
		}
		
		var txt = this.toString() + " " + evt + "\n";
		for(i = 0; i < layArr.length; i++)
			txt += layArr[i][0].id + " " + layArr[i][1] + " " + layArr[i][2] + "\n";
		// alert(txt);
	}


//
// custom messagehandler
//

_CFrameCaption.prototype.sendMsg =
	function(msg)
	{
		var i,j;
		var proceed = true;
		
		// process message
		if(msg == "MSG_ACTIVATE")
		{
			// activate the caption
			this.CLIENTAREA_BGCOLOR = "#000084";
		}
		else if(msg == "MSG_DEACTIVATE")
		{
			// deactivate the caption
			this.CLIENTAREA_BGCOLOR = "Gray";
		}

		if(msg == "MSG_ACTIVATE" || msg == "MSG_DEACTIVATE")
		{
			if(_CFrame.isIE)
				this.baseLayer.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
			else
				this.baseLayer.bgColor = this.CLIENTAREA_BGCOLOR;
		}
				
		// route message to childs
		for(i = 0; i < this.container.length && proceed; i++)
		{
			proceed = this.container[i][2].sendMsg(msg);
		}
		if(this.childObj != null && proceed)
		{
			proceed = this.childObj.sendMsg(msg);
		}
		
		return proceed;
	}


