Keynes.Model.Association = function (){
	
	/* 
		Setup the variables

		@param[Object] 			model_obj
		@param[String]			related_model_name
		@param[String]			association_type
		@param[String]			relationship

	*/

	var model_obj, related_model_name, association_type, relationship;
	
	if((arguments.length == 1) && (typeof arguments[0] == "object" )){

		model_obj = arguments[0].par
		related_model_name = arguments[0].child
		association_type = arguments[0].type

	}else{

		model_obj = arguments[0];
		related_model_name = arguments[1];
		association_type = arguments[2];

	}

	/* 
		@private 				belongs_to()
		
		@param[Object]			child								The child class which has the `belongs_to` association
		@param[String]			parent 								The parent class name (owner) of the relationship
		
		@return[Object]			result 								The instance of the parent model (it does not contain association data) 				

	*/


	function belongs_to(child, parent){
		
		var foreign_key, fk_id, result;

		foreign_key = parent.toLowerCase()+"_id"
		fk_id = child[foreign_key]

		result = Keynes.Models[parent].find.by('id', fk_id, true)

		if(result.length == 1){
			return result[0];
		}else{
			return null;
		}
	}

	/*

		@private 				has_many()						

		@param[Object]			parent								The parent (owner) of the relationship
		@param[String]			child								The child (owned) class name

		@return[Array]			result								An array of instances of the child model
		

	*/

	function has_many(parent, child){
		
		var foreign_key, result;

		(typeof parent == "object") ? null : (new Keynes.Error.NoAssociationSpecifiedForHasMany("Type error in parent (owner) association or object."));
		(typeof child == "string") ? null : (new Keynes.Error.NoAssociationSpecifiedForHasMany("Type error for child (model being owned) assocication name."));

		// Gets the foreign key name, expects convetion to be "model_id"
		// Example of what it would actually be calling for a User model
		// that has many posts:

		// Keynes.Model["User"].model

		foreign_key = Keynes.Models[parent._type].model_name.toLowerCase()+"_id";
		
		result = Keynes.Models[child].find.by(foreign_key, parent.id, true);

		return result;
	}

	this.create = function(){
		
		var relationship;

		if(association_type == "has_many"){

			relationship = has_many(model_obj, related_model_name);

		}

		if(association_type == "belongs_to"){

			relationship = belongs_to(model_obj, related_model_name);

		}


		return relationship;

	}

}