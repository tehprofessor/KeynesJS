Keynes.Model.Association = function (){
	
	var par, child, association_type, relationship;
	
	if((arguments.length == 1) && (typeof arguments[0] == "object" )){

		par = arguments[0].par
		child = arguments[0].child
		association_type = arguments[0].type

	}else{

		par = arguments[0];
		child = arguments[1];
		association_type = arguments[2];

	}

	function belongs_to(p, c){

		var foreign_key = c.toLowerCase()+"_id"
		var fk_id = p[foreign_key]

		result = Keynes.Models[c].find.byId(fk_id, true)
		
		return result;
	}

	function has_many(parent, child){
		
		
		(typeof parent == "object") ? null : (new Keynes.Error.NoAssociationSpecifiedForHasMany("Type error in parent (owner) association or object."));
		(typeof child == "string") ? null : (new Keynes.Error.NoAssociationSpecifiedForHasMany("Type error for child (model being owned) assocication name."));

		// Gets the foreign key name, expects convetion to be "model_id"
		// Example of what it would actually be calling for a User model
		// that has many posts:

		// Keynes.Model["User"].model

		var foreign_key = Keynes.Models[parent._type].model_name.toLowerCase()+"_id"
		
		result = Keynes.Models[child].find.by(foreign_key, p.id, true)

		return result;

	}

	this.create = function(){
		
		if(association_type == "has_many"){

			relationship = has_many(par, child);

		}

		if(association_type == "belongs_to"){

			relationship = belongs_to(par, child);

		}


		return relationship;

	}

}