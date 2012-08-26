var Find = {}
var AbstractFind = function(opts){	
	
	var db = opts.db
	var name = opts.name
	/* 
		Remember to use @self inside of private methods instead of `this`
		or the reference will not be to the correct object.
	*/
	var self = this;

	this.set_self = function(s){ self = s; }

	function convert_table_instances_to_model_instances(tbl_instances){
		var instances = []
		for(tbl_inst in tbl_instances){
			var inst = self.build_instance(tbl_instances[tbl_inst])
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
		instances = convert_table_instances_to_model_instances(result[0])
		return instances;
	}
	
	this.byId = function(id){
		var result = ""
		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				result = table[0][id]
			}catch(e){
				Logger.error(e)
			}
		}
		return this.build_instance(result)
	}
	
	this.by = function(key, value){
		var result = []
		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				instances = convert_table_instances_to_model_instances(table[0])
				found = false
				for(i in instances){
					if(instances[i][key] == value)
						result.push(instances[i]);
				}
			}catch(e){
				LocalFind.log("Nothing found matching key: `"+key+"` with value: "+value)
			}
		}
		return result	
	}
	
}