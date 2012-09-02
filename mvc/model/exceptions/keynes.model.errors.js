/* 
	
	All Model Related Errors are listed here.

*/

/* 
	WTF? arguments.caller() ?
	
	1.) Yeah... it's an easy way to get the name of the error. I didn't want to make the functions available to the global namespace,
	so using arguments.callee.name went right in ye ol' shitter... I did look at just naming the functions, but IE 8 and below
	shit a storm with the syntax (or so the smart kids say).
	
	2.) Incase you didnt know it (arguments) is an object not an array.

*/

Keynes.Error.CannotParseLocalStorage = function(){
	arguments.caller = "CannotParseLocalStorage"
	Keynes.Error.Base.apply(this, [arguments]);
};

Keynes.Error.NoLocalStorage = function(){
	arguments.caller = "CannotParseLocalStorage"
	Keynes.Error.Base.apply(this, [arguments]);	
}

Keynes.Error.NoAssociationSpecifiedForBelongsTo = function() { 
	arguments.caller = "NoAssociationSpecifiedForBelongsTo"
	Keynes.Error.Base.apply(this, [arguments]);
};

Keynes.Error.NoAssociationSpecifiedForHasMany = function() { 
	arguments.caller = "NoAssociationSpecifiedForBelongsTo"
	Keynes.Error.Base.apply(this, [arguments]);
};