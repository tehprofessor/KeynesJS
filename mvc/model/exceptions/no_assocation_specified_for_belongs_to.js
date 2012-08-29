		/* 
		NoLocalStorageError
		
		Displays an alert or logs, both are statically defined...

	*/

var NoAssociationSpecifiedForBelongsTo = {}
var NoAssociationSpecifiedForBelongsTo = function() { 
	
	this.alert = function(){
		
		alert("There was no parent specified for belongs_to!"+
		" Please make sure to include a reference (id) to the parent's relationship")
		
		return null
		
	}
	
	this.log = function(){
		Logger.error("There was no `parent` specified for belongs_to!"+
		" Please make sure to include a reference (id) to the parent's relationship")
	}	
	
};
AbstractNoLocalStorageError.call(NoLocalStorageError)