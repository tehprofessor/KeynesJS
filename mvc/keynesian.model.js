Keynes.Model.Base = function() {

	var _index_offset = 0;

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
		table[data.id] = data.unapply();
		db.setItem(model_name, JSON.stringify(table));
	}

	function build_instance(){

		var instance = {"_type":model_name,"id":""};
		var from_association, fk_from_association;

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

		// Create belongs_to relationship, @foreign_key_data is used in the unapply method

		var foreign_key_data;

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

		
		if ((typeof from_association == "boolean")) {
			instance[fk_from_association] = arguments[0][fk_from_association]
		};

		instance["unapply"] = function(){

			var dao = {}

			for(a in attrs){

				dao[a] = instance[a]

			}

			// Add the foreign keys

			if(foreign_key_data[0]){
				dao[foreign_key_data[1]] = foreign_key_data[2]
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


	
	this.find = new Keynes.Model.Find({"db": db, "name": model_name});
	this.find.set_self(this.find);
	this.find.build_instance = build_instance;
	Keynes.Models[model_name] = this;
	
}