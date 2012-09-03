/* 

	All public find methods will return one of three things:

	1.) A single instance of your model (an object)
	2.) An array of instances of your model (an array of objects).
	3.) null if nothing is found

*/

Keynes.Model.Find = function(opts){	
	
	var db = opts.db
	var name = opts.name
	/* 
		Remember to use @self inside of private methods instead of `this`
		or the reference will not be to the correct object.
	*/
	var self = opts.model;

	/* 
		@private 				parse()

		@param[String]			name 							The key to lookup the model
		
		@return[Object] 		table 							The psuedo table for the model
	*/

	function parse(){

		var table;

		try{

			var str = "["+db.getItem(name)+"]"
			table = jQuery.parseJSON(str);

		}catch(e){

			var msg = "Error parsing table "+name;
			new Keynes.Error.CannotParseLocalStorage(msg);
		}

		return table;
	}

	/* 
		
		@private 				convert_table_to_model()

		@param[object]			arguments[0] 					The JSON object representing the table (i.e. psuedo table)
		@param[Boolean] 		arguments[1]					If call is from, or for, a relationship
		@param[String]			arguments[2]					The foreign key to be used

		@return[Object] 		instances 						An instance of each model

	*/

	function convert_table_to_model(){

		var tbl_instances, from_association;
		
		tbl_instances = arguments[0];
		
		if(typeof arguments[1] == "boolean"){
			from_association = arguments[1]
			fk_from_association = arguments[2]
		}

		var instances = []

		for(tbl_inst in tbl_instances){
			
			var inst;

			if(!from_association){

				inst = self.build_instance(tbl_instances[tbl_inst])

			}else{

				inst = self.build_instance(tbl_instances[tbl_inst], true, fk_from_association)

			}
			
			instances.push(inst)
		}

		return instances;
	}

	this.all = function(){

		var table = parse();

		instances = convert_table_to_model(result[0])

		if(instances.length > 0){

			return instances;

		}else{

			return null;
		}
	}
	
	this.byId = function(){

		var id = arguments[0]
		var from_association, result, instance;
		
		// @from_association is to prevent circular lookups from
		// has_many and belongs_to

		if(typeof arguments[1] == "boolean")
			from_association = arguments[1]
		
		table = parse();
		result = table[0][id]
	
		// Check if this is being called by an association (it shouldn't be!)
		// all relationships should be looked up using find#by.

		if(typeof from_association == "undefined"){
			
			// Check to see if something was actually `found` matching the id. If not,
			// set instance to undefined so this function returns `null`

			instance = (typeof result == "object") ? self.build_instance(result) : undefined
		}

		if(instance){

			return instance

		}else{

			return null

		}
	}
	
	this.by = function(){
		
		var key, value, from_association, table, instances;
		var result = [];

		key = arguments[0]
		value = arguments[1]
		
		if(typeof arguments[2] == "boolean")
			from_association = arguments[2];


		table = parse();

		if(!from_association){

			instances = convert_table_to_model(table[0])
			
		}else{
			
			instances = convert_table_to_model(table[0], from_association, key)
					
		}

		for(i in instances){

			if(instances[i][key] == value){

				result.push(instances[i]);

			}

		}

		if(result.length > 0){

			return result;	

		}else{

			return null

		}
		
	}
	
}