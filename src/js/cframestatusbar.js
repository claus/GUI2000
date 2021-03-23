
//
// _CFrameStatusbar class
// (c) 1999 Claus Wahlers
// email: claus@wahlers.de
// phone: +49-89-12164101
// fax:   +49-89-12164102
//

//
// constructor
//

function _CFrameStatusbar(_x, _y, _width, _height, _parentObj)
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

	this.frameStyle = this.FRAME_FLAT;
}

//
// inheritance
//

_CFrameStatusbar.prototype = new _CFrame(0,0,0,0);


//
// member functions
//

_CFrameStatusbar.prototype.toString =
	function()
	{
		return "_CFrameStatusbar";
	}


_CFrameStatusbar.prototype.buildLayers =
	function(visible)
	{
		var txt;
		var statLay;
		var statLayID = _CFrame.getUniqueID();

		if(_CFrame.isIE)
		{
			txt = "<div ID=" + statLayID + " style='position:absolute'></div>";
			this.parentLayer.insertAdjacentHTML("BeforeEnd", txt);
		
			statLay = eval("document.all." + statLayID);
			statLay.style.left = this.x;
			statLay.style.top = this.y;
			statLay.style.width = this.width;
			statLay.style.height = this.height;
			statLay.style.backgroundColor = this.CLIENTAREA_BGCOLOR;
		}	
		else
		{
			statLay = new Layer(this.width, this.parentLayer);
			statLay.left = this.x;
			statLay.top = this.y;
			statLay.clip.height = this.height;
			statLay.clip.width = this.width;
			statLay.bgColor = this.CLIENTAREA_BGCOLOR;
		}

		this.baseLayer = statLay;

		var innerFrm = new _CFrame(0, 2, this.width, this.height - 2)
		innerFrm.setFrameStyle(this.FRAME_FLAT);
		innerFrm.setClientFrameStyle(this.FRAME_SUNKEN);
		this.addObject(0, 0, innerFrm);

		this.buildObjects(0);

		// if this object is a root object
		if(this.isRoot())
		{
			// and make object topmost
			// this.sendMsg("_MSG_ACTIVATE_MAIN_");
			alert("statusbar activate_main");
		}

		statLay.visibility = visible;
	}


