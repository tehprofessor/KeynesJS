Keynes.Error.LayoutTypeError = function(){
	arguments.caller = "LayoutTypeError"
	if(typeof arguments[0] == "undefined")
		arguments[0] = "Invalid layout type, controller#layout must be of a String, or a Function that returns a string"

	Keynes.Error.Base.apply(this, [arguments]);	
	
}