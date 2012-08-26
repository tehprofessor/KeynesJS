Keynes.Model = function() {

	var db = (typeof localStorage != "undefined") ? localStorage : NoLocalStorageError.alert

	var model = arguments[1]

	var model_name = arguments[0]

	this.model_name = model_name;

	var attrs = model.attributes;

	this.attributes = attrs;

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

	initializeModelInDatabase();

	function storeInLocalDB(data){
		var tmpTable = db.getItem(model_name)
		var table = jQuery.parseJSON(tmpTable);
		table[data.id] = data;
		db.setItem(model_name, JSON.stringify(table));
	}

	function build_instance(){

		var instance = {"_type":model_name,"id":""};

		for(attr in attrs){
			instance[attr] = ""
		};

		if(typeof arguments[0] == "object"){
			for(attr in instance){
				if(typeof arguments[0][attr] != "undefined"){
					instance[attr] = arguments[0][attr];
				}
			}
		}

		for(method in model){
			if(method != "attributes"){
				instance[method] = model[method]
			}
		}

		instance["unapply"] = function(){
			var dao = {}
			for(a in attrs){
				dao[a] = instance[a]
			}
			dao["id"] = instance["id"]
			return dao;
		}

		return instance;
	}

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

			return build_instance();

		}
		
	}

	function save(instance){

		if(model.storage.local)
			storeInLocalDB(instance)

		if(model.storage.remote)
			storeInLocalDB(instance)

		return true

	}

	this.save = function(instance){

		return save(instance);

	}

	this.destroy = function(field){

		delete fields[field]

	}

	// Removes all the data currently saved to the model's table
	// (only works for localStorage)

	this.reset_table = function(){
		db.removeItem(model_name)
	}


	AbstractFind.call(Find, {"db": db, "name": model_name})
	this.find = Find;
}