
//
// _CFrameImage class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameImage(_x, _y, _width, _height, _icon, _parentObj)
{
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	this.iconURL = _icon;

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

	this.frameStyle = this.FRAME_FLAT;
	this.CLIENTAREA_BACKGROUND = this.iconURL;
	this.CLIENTAREA_BGCOLOR = null;
	this.CLIENTFRAME = true;
}

//
// inheritance
//

_CFrameImage.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameImage.prototype.toString =
	function()
	{
		return "_CFrameImage";
	}



