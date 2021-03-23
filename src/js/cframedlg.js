
//
// _CFrameDlg class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameDlg(_x, _y, _width, _height, _parentObj)
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

	this.setFrameStyle(this.FRAME_POPUP);
	this.setClientFrameStyle(this.FRAME_FLAT);
	this.setBGColor("Silver");
}

//
// inheritance
// from _CFrame
//

_CFrameDlg.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameDlg.prototype.toString =
	function()
	{
		return "_CFrameDlg";
	}


