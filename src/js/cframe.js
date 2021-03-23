
//
// _CFrame base class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrame(_x, _y, _width, _height, _parentObj)
{
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;

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
	
	this.frameStyle = this.FRAME_WINDOW;

	this.frameDim = new Array(0, 0, 0, 0);
}

//
// constants
//

_CFrame.prototype.FRAME_FLAT = 0;
_CFrame.prototype.FRAME_RAISED = 1;
_CFrame.prototype.FRAME_SUNKEN = 2;
_CFrame.prototype.FRAME_BUTTON = 3;
_CFrame.prototype.FRAME_WINDOW = 4;
_CFrame.prototype.FRAME_POPUP = 5;
_CFrame.prototype.FRAME_CLIENT = 6;

//
// global variables
//

_CFrame.prototype.CLIENTAREA_BGCOLOR = "Silver";
_CFrame.prototype.CLIENTAREA_BACKGROUND = null;
_CFrame.prototype.CLIENTAREA_FONTFACE = "MS Sans Serif";
_CFrame.prototype.CLIENTAREA_FONTSIZE = 0;
_CFrame.prototype.CLIENTAREA_TEXTCOLOR = "Black";
_CFrame.prototype.CLIENTAREA_FRAMESTYLE = 6;
_CFrame.prototype.CLIENTFRAME = false;

//
// member functions
//

_CFrame.prototype.toString =
	function()
	{
		return("_CFrame");
	}


_CFrame.prototype.setWidth =
	function(width)
	{
		this.width = width;
	}

_CFrame.prototype.setHeight =
	function(height)
	{
		this.height = height;
	}

_CFrame.prototype.setXY =
	function(x, y)
	{
		this.x = x;
		this.y = y;
	}


_CFrame.prototype.setParentLayer =
	function(parentLayer)
	{
		this.parentLayer = parentLayer;
	}


_CFrame.prototype.setParentObj =
	function(parentObj)
	{
		this.parentObj = parentObj;
	}


_CFrame.prototype.setFrameStyle =
	function(frameStyle)
	{
		this.frameStyle = frameStyle;
	}


_CFrame.prototype.setClientFrame =
	function(isClientFrame)
	{
		this.CLIENTFRAME = isClientFrame;
	}


_CFrame.prototype.setClientFrameStyle =
	function(style)
	{
		this.CLIENTAREA_FRAMESTYLE = style;
	}


_CFrame.prototype.setBGColor =
	function(bgColor)
	{
		this.CLIENTAREA_BGCOLOR = bgColor;
	}


_CFrame.prototype.setBackground =
	function(background)
	{
		this.CLIENTAREA_BACKGROUND = background;
	}


_CFrame.prototype.setTextColor =
	function(color)
	{
		this.CLIENTAREA_TEXTCOLOR = color;
	}


_CFrame.prototype.buildLayers =
	function(visible)
	{
		var txt;
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
			
			//if(this.isRoot())
				//wndLay.style.zIndex = 1;
		}
		else
		{
			wndLay = new Layer(this.width, this.parentLayer);
			wndLay.left = this.x;
			wndLay.top = this.y;
			wndLay.clip.height = this.height;
			wndLay.clip.width = this.width;

			//if(this.isRoot())
				//wndLay.zIndex = 1;
		}
			
		this.baseLayer = wndLay;
		
		var type;
		
		switch(this.frameStyle)
		{
			case 1:
				// raised
				this.frameDim[0] = this.frameDim[1] = this.frameDim[2] = this.frameDim[3] = 1;
				type = "raised";
				break;
			case 2:
				// sunken
				this.frameDim[0] = this.frameDim[1] = this.frameDim[2] = this.frameDim[3] = 1;
				type = "sunken";
				break;
			case 3:
				// button
				this.frameDim[0] = this.frameDim[2] = 1;
				this.frameDim[1] = this.frameDim[3] = 2;
				type = "button0";
				break;
			case 4:
				// window
				this.frameDim[0] = this.frameDim[1] = this.frameDim[2] = this.frameDim[3] = 4;
				type = "window";
				break;
			case 5:
				// popup
				this.frameDim[0] = this.frameDim[1] = this.frameDim[2] = this.frameDim[3] = 3;
				type = "popup";
				break;
			case 6:
				// client
				this.frameDim[0] = this.frameDim[1] = this.frameDim[3] = 2;
				this.frameDim[2] = 3;
				type = "client";
				break;
			default:
				// flat
				type = "flat";
				break;
		}

		if(this.frameStyle != this.FRAME_FLAT)
		{
			if(_CFrame.isIE)
			{
				txt = "<div ID=" + wndLayID + "_tl style='position:absolute'></div>";
				txt += "</div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_tl");
				frmObj.style.pixelLeft = 0;
				frmObj.style.pixelTop = 0;
				frmObj.style.pixelWidth = this.frameDim[0];
				frmObj.style.pixelHeight = this.frameDim[2];
				frmObj.style.clip = "rect(0px " + this.frameDim[0] + "px " + this.frameDim[2] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_tl.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_tr style='position:absolute'>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_tr");
				frmObj.style.pixelLeft = this.width - this.frameDim[1];
				frmObj.style.pixelTop = 0;
				frmObj.style.pixelWidth = this.frameDim[1];
				frmObj.style.pixelHeight = this.frameDim[2];
				frmObj.style.clip = "rect(0px " + this.frameDim[1] + "px " + this.frameDim[2] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_tr.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_bl style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_bl");
				frmObj.style.pixelLeft = 0;
				frmObj.style.pixelTop = this.height - this.frameDim[3];
				frmObj.style.pixelWidth = this.frameDim[0];
				frmObj.style.pixelHeight = this.frameDim[3];
				frmObj.style.clip = "rect(0px " + this.frameDim[0] + "px " + this.frameDim[3] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_bl.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_br style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_br");
				frmObj.style.pixelLeft = this.width - this.frameDim[1];
				frmObj.style.pixelTop = this.height - this.frameDim[3];
				frmObj.style.pixelWidth = this.frameDim[1];
				frmObj.style.pixelHeight = this.frameDim[3];
				frmObj.style.clip = "rect(0px " + this.frameDim[1] + "px " + this.frameDim[3] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_br.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_tm style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_tm");
				frmObj.style.pixelLeft = this.frameDim[0];
				frmObj.style.pixelTop = 0;
				frmObj.style.pixelWidth = this.width - this.frameDim[0] - this.frameDim[1];
				frmObj.style.pixelHeight = this.frameDim[2];
				frmObj.style.clip = "rect(0px " + frmObj.style.pixelWidth + "px " + this.frameDim[2] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_tm.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_tb style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_tb");
				frmObj.style.pixelLeft = this.frameDim[0];
				frmObj.style.pixelTop = this.height - this.frameDim[3];
				frmObj.style.pixelWidth = this.width - this.frameDim[0] - this.frameDim[1];
				frmObj.style.pixelHeight = this.frameDim[3];
				frmObj.style.clip = "rect(0px " + frmObj.style.pixelWidth + "px " + this.frameDim[3] + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_bm.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_ml style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_ml");
				frmObj.style.pixelLeft = 0;
				frmObj.style.pixelTop = this.frameDim[2];
				frmObj.style.pixelWidth = this.frameDim[0];
				frmObj.style.pixelHeight = this.height - this.frameDim[2] - this.frameDim[3];
				frmObj.style.clip = "rect(0px " + this.frameDim[0] + "px " + frmObj.style.pixelHeight + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_ml.gif)";
				frmObj.style.visibility = "inherit";
			
				txt = "<div ID=" + wndLayID + "_mr style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				frmObj = eval("document.all." + wndLayID + "_mr");
				frmObj.style.pixelLeft = this.width - this.frameDim[1];
				frmObj.style.pixelTop = this.frameDim[2];
				frmObj.style.pixelWidth = this.frameDim[1];
				frmObj.style.pixelHeight = this.height - this.frameDim[2] - this.frameDim[3];
				frmObj.style.clip = "rect(0px " + this.frameDim[1] + "px " + frmObj.style.pixelHeight + "px 0px)";
				frmObj.style.backgroundImage = "url(images/frame/" + type + "_mr.gif)";
				frmObj.style.visibility = "inherit";
			}
			else
			{
				var wndLay_tl = new Layer(this.frameDim[0], wndLay);
				wndLay_tl.left = 0;
				wndLay_tl.top = 0;
				wndLay_tl.clip.height = this.frameDim[2];
				wndLay_tl.visibility = "inherit";
				wndLay_tl.background.src = "images/frame/" + type + "_tl.gif";
		
				var wndLay_tr = new Layer(this.frameDim[1], wndLay);
				wndLay_tr.left = this.width - this.frameDim[1];
				wndLay_tr.top = 0;
				wndLay_tr.clip.height = this.frameDim[2];
				wndLay_tr.visibility = "inherit";
				wndLay_tr.background.src = "images/frame/" + type + "_tr.gif";
		
				var wndLay_bl = new Layer(this.frameDim[0], wndLay);
				wndLay_bl.left = 0;
				wndLay_bl.top = this.height - this.frameDim[3];
				wndLay_bl.clip.height = this.frameDim[3];
				wndLay_bl.visibility = "inherit";
				wndLay_bl.background.src = "images/frame/" + type + "_bl.gif";
		
				var wndLay_br = new Layer(this.frameDim[1], wndLay);
				wndLay_br.left = this.width - this.frameDim[1];
				wndLay_br.top = this.height - this.frameDim[3];
				wndLay_br.clip.height = this.frameDim[3];
				wndLay_br.visibility = "inherit";
				wndLay_br.background.src = "images/frame/" + type + "_br.gif";
		
				var wndLay_tm = new Layer(this.width - this.frameDim[0] - this.frameDim[1], wndLay);
				wndLay_tm.left = this.frameDim[0];
				wndLay_tm.top = 0;
				wndLay_tm.clip.height = this.frameDim[2];
				wndLay_tm.visibility = "inherit";
				wndLay_tm.background.src = "images/frame/" + type + "_tm.gif";

				var wndLay_tb = new Layer(this.width - this.frameDim[0] - this.frameDim[1], wndLay);
				wndLay_tb.left = this.frameDim[0];
				wndLay_tb.top = this.height - this.frameDim[3];
				wndLay_tb.clip.height = this.frameDim[3];
				wndLay_tb.visibility = "inherit";
				wndLay_tb.background.src = "images/frame/" + type + "_bm.gif";

				var wndLay_ml = new Layer(this.frameDim[0], wndLay);
				wndLay_ml.left = 0;
				wndLay_ml.top = this.frameDim[2];
				wndLay_ml.clip.height = this.height - this.frameDim[2] - this.frameDim[3];
				wndLay_ml.visibility = "inherit";
				wndLay_ml.background.src = "images/frame/" + type + "_ml.gif";
		
				var wndLay_mr = new Layer(this.frameDim[1], wndLay);
				wndLay_mr.left = this.width - this.frameDim[1];
				wndLay_mr.top = this.frameDim[2];
				wndLay_mr.clip.height = this.height - this.frameDim[2] - this.frameDim[3];
				wndLay_mr.visibility = "inherit";
				wndLay_mr.background.src = "images/frame/" + type + "_mr.gif";
			}
		}

		// generate additional frame system objects
		// i.e. caption, menus, statusbar
		this.buildObjects(0);

		// generate client frame
		if(!this.CLIENTFRAME)
		{
			this.childObj = new _CClientFrame(this.frameDim[0], this.frameDim[2], this.width-this.frameDim[0]-this.frameDim[1], this.height-this.frameDim[2]-this.frameDim[3], this);
			this.childObj.setBGColor(this.CLIENTAREA_BGCOLOR);
			if(this.CLIENTAREA_BACKGROUND != null)
				this.childObj.setBackground(this.CLIENTAREA_BACKGROUND);
			this.childObj.setFrameStyle(this.CLIENTAREA_FRAMESTYLE);
			this.childObj.buildLayers("inherit");
			this.childLayer = this.childObj.childLayer;
		}
		else
		{
			var wndLay_client;
			
			if(_CFrame.isIE)
			{
				txt = "<div ID=" + wndLayID + "_client style='position:absolute'></div>";
				wndLay.insertAdjacentHTML("BeforeEnd", txt);
			
				wndLay_client = eval("document.all." + wndLayID + "_client");
				wndLay_client.style.pixelLeft = this.frameDim[0];
				wndLay_client.style.pixelTop = this.frameDim[2];
				wndLay_client.style.pixelWidth = this.width - this.frameDim[0] - this.frameDim[1];
				wndLay_client.style.pixelHeight = this.height - this.frameDim[2] - this.frameDim[3];
				wndLay_client.style.clip = "rect(0px " + wndLay_client.style.pixelWidth + "px " + wndLay_client.style.pixelHeight + "px 0px)";
				wndLay_client.style.visibility = "inherit";
				wndLay_client.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
				if(this.CLIENTAREA_BACKGROUND != null)
					wndLay_client.style.backgroundImage = "url(" + this.CLIENTAREA_BACKGROUND + ")";
			}
			else
			{
				wndLay_client = new Layer(this.width - this.frameDim[0] - this.frameDim[1], wndLay);
				wndLay_client.left = this.frameDim[0];
				wndLay_client.top = this.frameDim[2];
				wndLay_client.clip.height = this.height - this.frameDim[2] - this.frameDim[3];
				wndLay_client.clip.width = this.width - this.frameDim[0] - this.frameDim[1];
				wndLay_client.visibility = "inherit";
				wndLay_client.bgColor = this.CLIENTAREA_BGCOLOR;
				if(this.CLIENTAREA_BACKGROUND != null)
					wndLay_client.background.src = this.CLIENTAREA_BACKGROUND;
			}
			
			this.childLayer = wndLay_client;
			
			/*
			var clientTxt = "";
			clientTxt += "<FONT face='" + this.CLIENTAREA_FONTFACE + "' ";
			clientTxt += "size=" + this.CLIENTAREA_FONTSIZE + " ";
			clientTxt += "color='" + this.CLIENTAREA_FONTSIZE + "'>";
			clientTxt += "CFrame Test One Two<br><a href='#'>CFrame Test One Two</a><br>CFrame Test One Two<br>CFrame Test One Two<br>CFrame Test One Two<br>CFrame Test One Two<br>CFrame Test One Two<br>CFrame Test One Two<br>";
			clientTxt += "</FONT>";
			
			if(_CFrame.isIE)
			{
				this.childLayer.innerHTML = clientTxt;
			}
			else
			{
				this.childLayer.document.write(clientTxt);
				this.childLayer.document.close();
			}
			*/
		}
		
		// generate client objects
		// (objects, that reside in the client area)
		this.buildObjects(1);

		if(_CFrame.isIE)
			this.baseLayer.style.visibility = visible;
		else
			this.baseLayer.visibility = visible;
	}


_CFrame.prototype.addObject =
	function(type, align, obj)
	{
		if(_CFrame.isIE)
			this.container[this.container.length] = new Array(type, align, obj);
		else
			this.container.push(new Array(type, align, obj));
	}


_CFrame.prototype.buildObjects =
	function(type)
	{
		var i;
		for(i = 0; i < this.container.length; i++)
		{
			if(this.container[i][0] == type)
			{
				switch(type)
				{
					case 0:
					{
						var baseWidth = _CFrame.isIE ? this.baseLayer.style.pixelWidth : this.baseLayer.clip.width;
						var baseHeight = _CFrame.isIE ? this.baseLayer.style.pixelHeight : this.baseLayer.clip.height;
						
						if(this.container[i][2].width == 0)
						{
							if(this.container[i][1] == 0)
							{
								// align top
								this.container[i][2].setWidth(baseWidth - this.frameDim[0] - this.frameDim[1]);
								this.container[i][2].setXY(this.frameDim[0], this.frameDim[2]);
								this.frameDim[2] += this.container[i][2].height;
							}
							else if(this.container[i][1] == 1)
							{
								// align bottom
								this.container[i][2].setWidth(baseWidth - this.frameDim[0] - this.frameDim[1]);
								this.container[i][2].setXY(this.frameDim[0], baseHeight - this.frameDim[3] - this.container[i][2].height);
								this.frameDim[3] += this.container[i][2].height;
							}
						}
						else if(this.container[i][2].height == 0)
						{
							if(this.container[i][1] == 0)
							{
								// align left
								this.container[i][2].setHeight(baseHeight - this.frameDim[2] - this.frameDim[3]);
								this.container[i][2].setXY(this.frameDim[0], this.frameDim[2]);
								this.frameDim[0] += this.container[i][2].width;
							}
							else if(this.container[i][1] == 1)
							{
								// align right
								this.container[i][2].setHeight(baseHeight - this.frameDim[2] - this.frameDim[3]);
								this.container[i][2].setXY(baseWidth - this.frameDim[1] - this.container[i][2].width, this.frameDim[2]);
								this.frameDim[1] += this.container[i][2].width;
							}
						}
						this.container[i][2].setParentObj(this);
						this.container[i][2].setParentLayer(this.baseLayer);
						this.container[i][2].buildLayers("inherit");
						break;
					}
					
					case 1:
					{
						this.container[i][2].setParentObj(this);
						this.container[i][2].setParentLayer(this.childLayer);
						this.container[i][2].buildLayers("inherit");
 						break;
					}
				}
			}
		}
	}


_CFrame.prototype.isRoot =
	function()
	{
		var i;
		var j;
		for(i = 0; i < _CWorkspace.wsArr.length; i++)
		{
			for(j = 0; j < _CWorkspace.wsArr[i].container.length; j++)
			{
				if(_CWorkspace.wsArr[i].container[j][2].baseLayer == this.baseLayer)
					return true;
			}
		}
		return false;
	}
	


//
// default eventhandler
//

_CFrame.prototype.sendEvt =
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
		var txt = this.toString() + " " + evt + "\n";
		for(i = 0; i < layArr.length; i++)
			txt += layArr[i][0].id + " " + layArr[i][1] + " " + layArr[i][2] + "\n";
		// alert(txt);
	}
	

//
// default messagehandler
//

_CFrame.prototype.sendMsg =
	function(msg)
	{
		var i,j;
		var proceed = true;
		
		// process message
		if(msg == "MSG_ACTIVATE")
		{
			// activate this window
			if(this.isRoot())
			{
				if(_CFrame.isIE)
					this.baseLayer.style.zIndex = 1000;
				else
					this.baseLayer.zIndex = 1000;

				_CWorkspace.wsArr[0].normalizeZIndices();
			}
		}
		else if(msg == "MSG_DEACTIVATE")
		{
			// nothing to do here
		}
		else
		{
			// message not handled
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


//
// debugging stuff
//

_CFrame.prototype.debug =
	function()
	{
		if(_CFrame.isNav)
		{
			var txt = "";
			txt += this.toString() + "\n";
			if(this.baseLayer != null)
				txt += "baseLayer: " + this.baseLayer.id + " - { " + this.baseLayer.left + " " + this.baseLayer.top + " " + this.baseLayer.clip.width + " " + this.baseLayer.clip.height + " }\n";
			else
				txt += "baseLayer: null\n";
			if(this.childLayer != null)
				txt += "childLayer: " + this.childLayer.id + " - { " + this.childLayer.left + " " + this.childLayer.top + " " + this.childLayer.clip.width + " " + this.childLayer.clip.height + " }\n";
			else
				txt += "childLayer: null\n";
			if(typeof this.parentLayer.id != "undefined")
				txt += "parentLayer: " + this.parentLayer.id + " - { " + this.parentLayer.left + " " + this.parentLayer.top + " " + this.parentLayer.clip.width + " " + this.parentLayer.clip.height + " }\n";
			else
				txt += "parentLayer: undefined (root)\n";
			txt += "baseLayer contains:\n";
			for(i = 0; i < this.baseLayer.layers.length; i++)
				txt += this.baseLayer.layers[i].id + " - { " + this.baseLayer.layers[i].left + " " + this.baseLayer.layers[i].top + " " + this.baseLayer.layers[i].clip.width + " " + this.baseLayer.layers[i].clip.height + " }\n";
			
			if(this.childObj != null)
			{
				txt += this.childObj.toString() + " contains:\n";
				if(this.childObj.baseLayer != null)
					txt += "\tbaseLayer: " + this.childObj.baseLayer.id + " - { " + this.childObj.baseLayer.left + " " + this.childObj.baseLayer.top + " " + this.childObj.baseLayer.clip.width + " " + this.childObj.baseLayer.clip.height + " }\n";
				else
					txt += "\tbaseLayer: null\n";
				if(this.childObj.childLayer != null)
					txt += "\tchildLayer: " + this.childObj.childLayer.id + " - { " + this.childObj.childLayer.left + " " + this.childObj.childLayer.top + " " + this.childObj.childLayer.clip.width + " " + this.childObj.childLayer.clip.height + " }\n";
				else
					txt += "\tchildLayer: null\n";
				if(typeof this.childObj.parentLayer.id != "undefined")
					txt += "\tparentLayer: " + this.childObj.parentLayer.id + " - { " + this.childObj.parentLayer.left + " " + this.childObj.parentLayer.top + " " + this.childObj.parentLayer.clip.width + " " + this.childObj.parentLayer.clip.height + " }\n";
				else
					txt += "\tparentLayer: undefined (root)\n";
				txt += "\tbaseLayer contains:\n";
				for(i = 0; i < this.childObj.baseLayer.layers.length; i++)
					txt += "\t" + this.childObj.baseLayer.layers[i].id + " - { " + this.childObj.baseLayer.layers[i].left + " " + this.childObj.baseLayer.layers[i].top + " " + this.childObj.baseLayer.layers[i].clip.width + " " + this.childObj.baseLayer.layers[i].clip.height + " }\n";
			}
			else
				txt += "no childObj\n";
			
			if(this.container.length > 0)
			{
				txt += "\n" + this.toString() + " contains:\n";
				for(i = 0; i < this.container.length; i++)
				{
					txt += this.container[i][2].toString() + "\n";

					if(this.baseLayer != null)
						txt += "baseLayer: " + this.container[i][2].baseLayer.id + " - { " + this.container[i][2].baseLayer.left + " " + this.container[i][2].baseLayer.top + " " + this.container[i][2].baseLayer.clip.width + " " + this.container[i][2].baseLayer.clip.height + " }\n";
					else
						txt += "baseLayer: null\n";
					if(this.container[i][2].childLayer != null)
						txt += "childLayer: " + this.container[i][2].childLayer.id + " - { " + this.container[i][2].childLayer.left + " " + this.container[i][2].childLayer.top + " " + this.container[i][2].childLayer.clip.width + " " + this.container[i][2].childLayer.clip.height + " }\n";
					else
						txt += "childLayer: null\n";
					if(typeof this.container[i][2].parentLayer.id != "undefined")
						txt += "parentLayer: " + this.container[i][2].parentLayer.id + " - { " + this.container[i][2].parentLayer.left + " " + this.container[i][2].parentLayer.top + " " + this.container[i][2].parentLayer.clip.width + " " + this.container[i][2].parentLayer.clip.height + " }\n";
					else
						txt += "parentLayer: undefined (root)\n";
					txt += "baseLayer contains:\n";
					//for(i = 0; i < this.container[i][2].baseLayer.layers.length; i++)
						//txt += this.container[i][2].baseLayer.layers[i].id + " - { " + this.container[i][2].baseLayer.layers[i].left + " " + this.container[i][2].baseLayer.layers[i].top + " " + this.container[i][2].baseLayer.layers[i].clip.width + " " + this.container[i][2].baseLayer.layers[i].clip.height + " }\n";
				}
			}				
			alert(txt);
		}
	}


//
// globals
//

_CFrame.uniqueID = 1;
_CFrame.isNav = (document.layers) ? true : false;
_CFrame.isIE = (document.all) ? true : false;
_CFrame.frameArr = new Array();

_CFrame.getUniqueID =
	function()
	{
		return "lay" + _CFrame.uniqueID++;
	}

_CFrame.getRootObject =
	function()
	{
		return _CFrame.isNav ? window : document.all.root;
	}

_CFrame.getMainObjFromLayer =
	function(lay)
	{
		var i;
		var layTmp = lay;
		var retObj = null;
		
		if(_CFrame.isIE)
		{
			// search topmost layer
			while(layTmp.offsetParent != document.body)
				layTmp = layTmp.offsetParent;
		}
		else
		{
			// search topmost layer
			while(layTmp.parentLayer != window)
				layTmp = layTmp.parentLayer;
		}

		// find corresponding CFrame derived 
		// object in the _CFrame.frameArr array
		for(i = 0; i < _CFrame.frameArr.length; i++)
		{
			if(_CFrame.frameArr[i].baseLayer == layTmp)
			{
				retObj = _CFrame.frameArr[i];
				break;
			}
		}
		
		return retObj;
	}


/*
_CFrame.isTopmostObject =
	function(obj)
	{
		var i;
		var z;
		var zThis = _CFrame.isIE ? obj.baseLayer.style.zIndex : obj.baseLayer.zIndex;
		if(typeof zThis == "undefined" || zThis == 0)
			return false;
		else
		{
			for(i = 0; i < _CFrame.frameArr.length; i++)
			{
				z = _CFrame.isIE ? _CFrame.frameArr[i].baseLayer.style.zIndex : _CFrame.frameArr[i].baseLayer.zIndex;
				if(typeof z != "undefined" && z > zThis)
					return false;
			}
		}
		return true;
	}
*/


//
// global debugging stuff
//

_CFrame.debugLayer =
	function(lay)
	{
		var txt = "";
		txt += lay.id + " - { " + lay.left + " " + lay.top + " " + lay.clip.width + " " + lay.clip.height + " }\n";
		for(i = 0; i < lay.layers.length; i++)
			txt += "\t" + lay.layers[i].id + " - { " + lay.layers[i].left + " " + lay.layers[i].top + " " + lay.layers[i].clip.width + " " + lay.layers[i].clip.height + " }\n";
		alert(txt);
	}

