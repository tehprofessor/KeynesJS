/* 

	@notes

	@idea 		Create constructor for to wrap data objects?
	@idea		Create relational data-store in memory, and save on unload
	@idea 		Sync over websockets
	@idea 		Type checking on the columns

*/

/* 
	
	@class Keynes.Controller.Base

	Basis for creating Controllers.

	@param[String] 				controller_name					The (class) name of the controller (case sensitive)
	@param[Object]				controller 						The guts of the controller: methods


	@example					No methods or relational information, data only.

	var User = new Keynes.Model.Base("User", {
		attributes: {
				"email":"",
				"first_name":"",
				"last_name"
		}
	});


	@example 					Adding an instance method

	var UsersController = new Keynes.Controller.Base("UsersController", {
		
		before_filters:[
			{
				actions: ["index", "edit"],
				method: "log_to_console"
			},{
				actions: ["index"],
				method: "log_to_console"
			}
		],
		index: function(){
			var u = User.find.byId(1);
			render({
				template: {html: "users/index", data: u},
				partials: []
				actions: [function(){}, function(){}, function(){}] // view logic (bindings, effects, etc)
			});
		},
		show: function(){
	
		},
		edit: function(){
	
		},
		new: function(){
	
		},
		destroy: function(){
	
		},
		log_to_console: function(){
			console.log("it's working")
		},
		log_to_console2: function(){
			console.log("it's still working")
		}

	});

*/

Keynes.Controller.Base = function() {

	var controller_name, controller_obj, before_filters;

	controller_name = arguments[0]
	controller_obj = arguments[1]

	before_filters = controller_obj["before_filters"];


	function render(){

	}

	function template(){

	}

	function create(){

	}

	Keynes.Controllers[controller_name] = this;

}


