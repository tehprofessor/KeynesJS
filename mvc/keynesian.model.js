function KeynesianModel(options){
	
	var self = this;

	/* name (String) 					singular name of the model  */
	var model_name = options.name

	/*  name() (String) 				getter */
	this.model_name = function(){ 
		return model_name
	}

	/*  hasData (Boolean) 				if this model already has data in localStorage.
		Used in conjunction with adding data, to see if a comma separator is needed */

	var hasData = false
	
	/*  hasData (Boolean) 	getter */
	this.hasData = function(){
		return hasData
	}

	/*	fields (Object) 				holds the current instance's data */
	var fields = {};

	/*	Maybe change this to `for` prop `in` field  */
	this.fields = options.fields;

	/*	data (Object)					getter */
	this.data = function(){
		return fields
	}

	var initialized = false;

	this.set = function(){
		
		if(initialized == false){

			initializeModelInDatabase();
			initialized = true;

		}
		if(typeof arguments[0] == "object"){

			for(f in arguments[0]){
				fields[f] = arguments[0][f]
			}

		}else{

			var field = arguments[0]
			var value = arguments[1]
			fields[field] = value;
		}

		storeInDBProper();
		return true;
	}

	this.remove = function(field){
		delete fields[field]
	}

	/* 	db
		Alias for localStorage */

	var db = (typeof localStorage != "undefined") ? localStorage : NoLocalStorageError.alert

	/* 	Create psuedo-table with local storage. 

		The idea is:
		Use model#name as the localStorage key (table name), and set the value to a JSON list of objects,
		where the key is the id of the object.

		Ex.

		var user = new User();
		user.set("id",2)
	*/

	function createTable(){
		var o = {};
		db.setItem(model_name, JSON.stringify(o));
		return true;	
	}

	function initializeModelInDatabase(){
		existing = db.getItem(model_name);
		if(db){
			if((!existing)){
				createTable();
			}
		}
	}
	
	function storeInDBProper(){
		var tmpTable = db.getItem(model_name)
		var table = jQuery.parseJSON(tmpTable);
		var dataObject = self.data();
		table[dataObject.id] = dataObject;
		db.setItem(model_name, JSON.stringify(table));
	}

	/* 
		Use this method to store objects in the localStorage. It checks to make sure it's sane.
		Otherwise it logs a message, and alerts.
	*/

	function storeInDB(){
		if(db){
			try {
				storeInDBProper()
			}catch(e){
				if((typeof arguments[0] != "undefined") && (arguments[0].alert == true)){
					InsertingToLocalDatabaseFailedError.alert("There was an error setting the localStorage.")
					InsertingToLocalDatabaseFailedError.log("Could not insert into localStorage, attempted to set key "+
															"`"+model_name+"`"+
															" attempted value was\n"+
															d)
				}
			}
		}else{
			NoLocalStorageError.log();
		}
	}

	AbstractFind.call(Find, {"db": db, "name": model_name})
	this.find = Find;

}



	/* 


	function findLocallyAll(id){
		var result = ""
		if(db){
			try{
				var str = "["+db.getItem(name)+"]"
				result = jQuery.parseJSON(obj);
			}catch(e){

			}
		}
	}

		KeynesianModel#set
		=> null

		Sets a property on the data object to a value, parameters can be either:

			b.) A javascript object
			a.) A pair of string values: set(key, value)
				@param 		arguments[0] 	key s
				@param 		arguments[0]	object
		
	*/