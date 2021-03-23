
//
// _CFrameButton class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameButton(_x, _y, _width, _height, _icon, _parentObj)
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

	this.frameStyle = this.FRAME_BUTTON;
	this.CLIENTAREA_BACKGROUND = this.iconURL;
	this.CLIENTFRAME = true;
}

//
// inheritance
//

_CFrameButton.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameButton.prototype.toString =
	function()
	{
		return "_CFrameButton";
	}


//
// custom eventhandler
//

/*
_CFrameButton.prototype.handleOnMouseDown =
	function(evt)
	{
		var mainObj = _CFrame.getMainObjFromLayer(this);
		if(mainObj != null)
			mainObj.sendMsg("_MSG_ACTIVATE_MAIN_");

		if(_CFrame.isNav)
			this.routeEvent(evt);
	}
*/


