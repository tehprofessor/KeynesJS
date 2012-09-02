Keynes.Error.Base = function() { 
	var args = arguments[0]
	var callingClass = args.caller

	function notify(msg){
		alert(msg)
		return null
	}
	
	function log(msg){
		Keynes.Logger.error(callingClass+": "+ msg)
	}

	function log_error(msg){
		Keynes.Logger.error(msg)
	}	
	
	if(typeof args[0] == "string") log(args[0])

	if((typeof args[1] == "boolean") && (args[1] == true)) notify(args[0])

	if(args[2] instanceof Error) error_log(args[0])

};