Keynes.Controller.Base("UsersController", function(){
	
	var c = this;

	c.layout = function(params){
		return {
			template: "application",
			partials: {
				navigation: "shared/navigation",
				footer: "shared/footer"
			}
		}	
	}

	c.before = function(){



	}

	c.index = function(){

		var users = Users.find.all();

		render({
			action: "index",
			locals: {
				"users": users
			}
		});

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