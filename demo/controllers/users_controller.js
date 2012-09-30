Keynes.Controller.Base("UsersController", function(){
	
	var c = this;
	c.layout = function(params){
		var layout;
		layout = "application"
		return layout
	}

	c.before = function(){



	}

	c.index = function(){

		var users = Users.find.all();
		render({action: "index"});

	}

	c.show = function(params){
		var user = User.find.byId(params.id);
		c.render({

			action: "show", 
			locals: {
				"user": user
			}

		});
	}

	c.log_to_console = function(){

	}

});