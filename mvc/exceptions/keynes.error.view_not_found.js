Keynes.Error.ViewNotFoundError = function(){
	arguments.caller = "ViewNotFoundError"
	Keynes.Error.Base.apply(this, [arguments]);	
}