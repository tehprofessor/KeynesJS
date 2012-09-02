/* 

	@notes

	@idea 		Create constructor for to wrap data objects?
	@idea		Create relational data-store in memory, and save on unload
	@idea 		Sync over websockets
	@idea 		Type checking on the columns

*/

/* 
	
	@class Keynes.Model.Base

	Basis for creating Models.

	@param[String] 				model_name						The (class) name of the model (case sensitive)
	@param[Object]				model 							The guts of the model: attributes, relational information, and methods.


	@example					No methods or relational information, data only.

	var User = new Keynes.Model.Base("User", {
		attributes: {
				"email":"",
				"first_name":"",
				"last_name"
		}
	});


	@example 					Adding an instance method

*/

Keynes.Model.Base = function() {
	/* 
		@unused

		@param 					_index_offset

	*/

	var _index_offset = 0;

	/* 
		
		@param[localStorage]	db 								Shortcut, and sanity check, for localStorage


	*/

	var db = (typeof localStorage != "undefined") ? localStorage : Keynes.Error.NoLocalStorage("No `localStorage` present! \n"+"Certain features may not behave correctly, "+"please use the newest version of Chrome, Safari, or Firefox")

	/* 

		@param[Object] 			model 							The model object passed when in creating a new model

		Below are reserved properties for the model object

		@param[Object]			attributes 						Property names of the object are used as the attributes (columns) for the data object
		@param[Object]			belongs_to 						Property names become the accessors for relationships, the property values are the model class names
		@param[Object]			has_many 						Property names become the accessors for the relationship, the property values are the model class names 
		

		@example 				See Keynes.Model.Base
	*/


	var model = arguments[1]

	/* 
		@private

		@param[String] 			model_name						The (class) name of the model (case sensitive)

	*/

	var model_name = arguments[0]

	/* 
	
		@public 				model_name						Gets the model name

		@return[String] 		model_name 				

	*/

	this.model_name = model_name;

	/* 
		@private[Object]		attrs 							The data attributes (columns) for the model

	*/

	var attrs = model.attributes;

	/* 
		
		@public 				attributes 						Gets the data attributes (this is not how to get the values of the attributes, it's just the original list of them)
		
		@return[Object]			attrs 

	*/

	this.attributes = attrs;

	/* 
		@TODO 					Have the return value actually mean something... instead of just returning true.

		@private 				createTable() 					Creates an empty psuedo-table in localStorage, using the class name as the key

		@return[Boolean]		true 				

	*/

	function createTable(){
		var o = {};
		db.setItem(model_name, JSON.stringify(o));
		return true;	
	}

	/* 

		@private 				initializeModelInDatabase() 	Checks to see if the key for the psuedo-table exists, and if not calls createTable();

		@return[undefined] 				

	*/

	function initializeModelInDatabase(){
		existing = db.getItem(model_name);
		if(db){
			if((!existing)){
				createTable();
			}
		}
	}

	/* 
		
		Call #initializeModelInDatabase in the constructor
		
	*/

	initializeModelInDatabase();

	/* 
		@private 				storeInLocalDB()
		
		@param[Object] 			data

	*/

	function storeInLocalDB(data){
		var tmpTable = db.getItem(model_name)
		var table = jQuery.parseJSON(tmpTable);
		table[data.id] = data.unapply();
		db.setItem(model_name, JSON.stringify(table));
	}

	/* 

		@semi-private   		build_instance() 		 		Constructs an instance of a model with the methods and attributes applied.

		@param[Object] 			arguments[0]	 		 		A data object (unapplied instance of the model)
		@param[Boolean]			arguments[1]					If it is building from an association, prevents recursion.
		@param[String]			arguments[2]					The name of the model the association is from (the unknown model)
		
		@return[Object]			instance 				 		An instance of the the model

	*/

	function build_instance(){

		var instance = {"_type":model_name,"id":""};
		var from_association, fk_from_association;

		// Establish if #build_instance is being called for a relationship, and if it is, prevent looking up the model which called #build_instance

		if(typeof arguments[1] == "boolean"){
			from_association = arguments[1]; // this will probably never be set to false, it'll either be undefined, or true
			fk_from_association = arguments[2] // will always be a string
		}

		// Set empty model attributes (properties)

		for(attr in attrs){
			instance[attr] = ""
		};

		// Set values to attributes

		if(typeof arguments[0] == "object"){
			for(attr in instance){

				if(typeof arguments[0][attr] != "undefined"){

					instance[attr] = arguments[0][attr];

				}

			}
		}

		// Setup instance methods

		for(method in model){
			if((method != "attributes") && (method != "belongs_to") && (method != "has_many") && (method != "storage")){

				instance[method] = model[method]

			}
		}

		// Create has_many relationship

		if((typeof model.has_many != "undefined") && (!from_association)){
			for(ass_model in model.has_many){

				var c = model.has_many[ass_model]
				instance[ass_model] = (new Keynes.Model.Association(instance, c, "has_many").create()); 	

			}
		}

		// Create belongs_to relationship, 
		// @foreign_key_data is used in the unapply method

		var foreign_key_data;

		// Create the belongs to relationship
		// TODO: Review this code, it seems a bit sketch

		if((typeof model.belongs_to != "undefined") && (!from_association)){
			for(ass_model in model.belongs_to){

				var c = model.belongs_to[ass_model]

				var fk = model.belongs_to[ass_model].toLowerCase()+"_id";
				instance[fk] = null
				var fk_id = arguments[0][fk];
				
				foreign_key_data = [true, fk, fk_id];

				if(typeof arguments[0][fk] != "undefined"){

					instance[fk] = arguments[0][fk]
					instance[ass_model] = (new Keynes.Model.Association(instance, c, "belongs_to").create());

				}
			}
		}

		// Set the id of the relationship
		
		if ((typeof from_association == "boolean")) {
			instance[fk_from_association] = arguments[0][fk_from_association]
		};

		// Unapply returns an object which can be saved to the database (i.e. without instance methods)

		instance["unapply"] = function(){

			// @dobj is the `data object`

			var dobj = {}

			// Assign each of the properties from the model
			// to the data object.

			for(a in attrs){

				dobj[a] = instance[a]

			}

			// Check if we need to add foreign keys

			if(foreign_key_data){
				if(foreign_key_data[0])
					dobj[foreign_key_data[1]] = foreign_key_data[2]
			}

			dobj["id"] = instance["id"]

			return dobj;
		}

		return instance;

	}

	this.build_instance = function(){
		var instance = build_instance.apply(this, arguments);
		return instance
	}

	/* 

		@public 				create()
		
		@param[Object] 			arguments[0] 					Object for creating an instance, currently only has one, the `data` property
		@param[Object] 			arguments[0].data 				Data for creating an instance

		@param[Array] 			arguments[0]					An array of aformentioned objects to create multiple instances

		@return[Object]			instance 						if arguments[0] is an Object
		@return[Array] 			models							if arguments[0] is an Array

	*/

	this.create = function(){

		if(typeof arguments[0] == "object"){

			var options = arguments[0];


			if(options.data.constructor.name == "Object"){
				
				var inst = build_instance(options.data);
				save(inst)
				return inst;

			}else if(options.data.constructor.name == "Array"){
				
				models = []

				for(i=0;i<options.data.length;i++){
					
					var inst = build_instance(options.data[i])
					save(inst)
					models.push(inst)

				}

				return models;
			}


		}else{

			// Create an empty instance

			return build_instance();

		}
		
	}
	/* 
		@TODO: Have return value mean something, currently hard-coded to true.

		@semi-private 			save() 							Saves the instance to localStorage
		
		@param[Object] 			instance  						An instance of a model

		@return[Boolean]

	*/
	function save(instance){

		if(model.storage.local)
			storeInLocalDB(instance)

		if(model.storage.remote)
			storeInLocalDB(instance)

		return true

	}

	/* 
		
		@public 				save() 							Calls private method with the same name

		@return[Boolean]

	*/

	this.save = function(instance){

		return save(instance);

	}

	/*

		@TODO					Implement method

		@public 				destroy()						Removes instance from localStorage

		@return[Boolean]


	 */

	this.destroy = function(instance){

	}

	/* 

		@public 				reset_table()					Removes all the data currently saved to the model's table (only works for localStorage)

	*/

	this.reset_table = function(){

		db.removeItem(model_name)

	}


	// Add the model to the Models hash

	Keynes.Models[model_name] = this;

	// Initialize Find

	this.find = new Keynes.Model.Find({
		"db": db, 
		"name": model_name, 
		 "model": Keynes.Models[model_name] 
	});
	
}