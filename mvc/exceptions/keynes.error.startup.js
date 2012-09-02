Keynes.Error.FileNotFoundError = function(){
	arguments.caller = "FileNotFoundError"
	Keynes.Error.Base.apply(this, [arguments]);	
}