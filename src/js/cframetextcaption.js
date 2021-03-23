
//
// _CFrameTextCaptionCaption class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameTextCaption(_x, _y, _width, _height, _text, _parentObj)
{
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	this.text = _text;

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

	this.CLIENTAREA_BGCOLOR = "";
	this.CLIENTAREA_TEXTCOLOR = "Silver";
	this.CLIENTFRAME = true;
}

//
// inheritance
//

_CFrameTextCaption.prototype = new _CFrameText(0,0,0,0);


//
// member functions
//

_CFrameTextCaption.prototype.toString =
	function()
	{
		return "_CFrameTextCaption";
	}


//
// custom messagehandler
//

_CFrameTextCaption.prototype.sendMsg =
	function(msg)
	{
		var i,j;
		var proceed = true;
		
		// process message
		if(msg == "MSG_ACTIVATE")
		{
			// activate the text
			this.CLIENTAREA_TEXTCOLOR = "White";
		}
		else if(msg == "MSG_DEACTIVATE")
		{
			// deactivate the text
			this.CLIENTAREA_TEXTCOLOR = "Silver";
		}

		if(msg == "MSG_ACTIVATE" || msg == "MSG_DEACTIVATE")
		{
			// rewrite text
			var txt = "";
			txt += "<FONT face='" + this.CLIENTAREA_FONTFACE + "' ";
			txt += "size=" + this.CLIENTAREA_FONTSIZE + " ";
			txt += "color='" + this.CLIENTAREA_TEXTCOLOR + "'>";
			txt += "<NOBR><b>" + this.text + "</b></NOBR>";
			txt += "</FONT>";

			if(_CFrame.isIE)
				this.baseLayer.innerHTML = txt;
			else
			{
				this.baseLayer.document.write(txt);
				this.baseLayer.document.close();
			}
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

