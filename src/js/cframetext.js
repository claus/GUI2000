
//
// _CFrameText class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameText(_x, _y, _width, _height, _text, _parentObj)
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
	this.CLIENTAREA_TEXTCOLOR = "White";
	this.CLIENTFRAME = true;
}

//
// inheritance
//

_CFrameText.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameText.prototype.toString =
	function()
	{
		return "_CFrameText";
	}


_CFrameText.prototype.buildLayers =
	function(visible)
	{
		var txt;
		var txtLay;
		var txtLayID = _CFrame.getUniqueID();

		if(_CFrame.isIE)
		{
			txt = "<div ID=" + txtLayID + " style='position:absolute'></div>";
			this.parentLayer.insertAdjacentHTML("BeforeEnd", txt);
		
			txtLay = eval("document.all." + txtLayID);
			txtLay.style.left = this.x;
			txtLay.style.top = this.y;
			txtLay.style.width = this.width;
			txtLay.style.height = this.height;
			txtLay.style.clip = "rect(0px " + txtLay.style.pixelWidth + "px " + txtLay.style.pixelHeight + "px 0px)";
			if(this.CLIENTAREA_BGCOLOR != "")
				txtLay.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
			txtLay.style.visibility = visible;
		}
		else
		{
			var txtLay = new Layer(this.width, this.parentLayer);
			txtLay.left = this.x;
			txtLay.top = this.y;
			txtLay.clip.height = this.height;
			txtLay.clip.width = this.width;
			if(this.CLIENTAREA_BGCOLOR != "")
				txtLay.bgColor = this.CLIENTAREA_BGCOLOR;
			txtLay.visibility = visible;
		}

		this.baseLayer = txtLay;

		var txt = "";
		txt += "<FONT face='" + this.CLIENTAREA_FONTFACE + "' ";
		txt += "size=" + this.CLIENTAREA_FONTSIZE + " ";
		txt += "color='" + this.CLIENTAREA_TEXTCOLOR + "'>";
		txt += "<NOBR><b>" + this.text + "</b></NOBR>";
		txt += "</FONT>";

		if(_CFrame.isIE)
		{
			this.baseLayer.innerHTML = txt;
		}
		else
		{
			this.baseLayer.document.write(txt);
			this.baseLayer.document.close();
		}
	}


/*
_CFrameText.prototype.insertText =
	function(lay, text, visible)
	{
		var txtdsp;
		var emptyHeight;
		alert(this.baseLayer.clip.height + " " + lay.clip.height);

		alert(this.baseLayer.clip.height + " " + lay.clip.height);
		lay.visibility = "hidden";
		emptyHeight = lay.clip.height;
		var txtLen = text.length;
		txtdsp = text;
		do
		{
			lay.document.write(txtdsp);
			lay.document.close();
			txtLen -= 1;
			txtdsp = text.substr(0, txtLen) + "...";
		}
		while((lay.clip.height > emptyHeight || lay.clip.width > this.baseLayer.clip.width) && txtLen >= 0);
		lay.top = (this.baseLayer.clip.height - emptyHeight) / 2 
		lay.visibility = visible;
	}

_CFrameText.prototype.debugLayer =
	function(lay)
	{
		var txt = "LAYER: " + lay.id + "\n";
		txt += "left: " + lay.left + "\n";		
		txt += "top: " + lay.top + "\n";		
		txt += "width: " + lay.clip.width + "\n";		
		txt += "height: " + lay.clip.height + "\n";		
		txt += "visibility: " + lay.visibility + "\n";		
		txt += "bgcolor: " + lay.bgColor + "\n";		
		
		alert(txt);
	}
*/
	


