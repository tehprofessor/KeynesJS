Keynes.Error.LayoutTypeError = function(){
	arguments.caller = "LayoutTypeError"
	if(typeof arguments[0] == "undefined")
		arguments[0] = "Layout not found (404) missing"

	Keynes.Error.Base.apply(this, [arguments]);	
	
}