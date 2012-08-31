Keynes.Model.Find = function(opts){	
	
	var db = opts.db
	var name = opts.name
	/* 
		Remember to use @self inside of private methods instead of `this`
		or the reference will not be to the correct object.
	*/
	var self = this;

	this.set_self = function(s){ self = s; }

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

		var result = ""

		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				result = jQuery.parseJSON(str);
			}catch(e){
				Logger.error(e)
			}
		}

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

		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				result = table[0][id]
			}catch(e){
				Logger.error(e)
			}
		}
		
		if(typeof from_association == "undefined"){
			instance = self.build_instance(result);
		}

		if(instance){

			return instance

		}else{

			return null

		}
	}
	
	this.by = function(){
		
		var key, value, from_association;
		var result = [];

		key = arguments[0]
		value = arguments[1]
		
		if(typeof arguments[2] == "boolean")
			from_association = arguments[2];

		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				var instances;

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
			}catch(e){
				Logger.log("Nothing found matching key: `"+key+"` with value: "+value)
			}
		}
		return result	
	}
	
}