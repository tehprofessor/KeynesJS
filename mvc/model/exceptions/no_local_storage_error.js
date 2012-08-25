		/* 
		NoLocalStorageError
		
		Displays an alert or logs, both are statically defined...

	*/

var NoLocalStorageError = {}
var AbstractNoLocalStorageError = function() { 
	
	this.alert = function(){
		
		alert("No local storage present!"+
		" Please upgrade your browser,"+
		" or use the newest version of"+
		" Chrome, Safari, or Firefox.")
		
		return null
		
	}
	
	this.log = function(){
		Logger.error("No `localStorage` present! \n"+
					"Certain features may not behave correctly,"+
					"please use the newest version of Chrome, Safari, or Firefox")
	}	
	
};
AbstractNoLocalStorageError.call(NoLocalStorageError)