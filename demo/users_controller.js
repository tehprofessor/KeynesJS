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
			template: { html: "users/index", data: u }
		});
	}

});