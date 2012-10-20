new Keynes.Controller.Base("ApplicationController", function(){

	var c = this;

	c.layout = function(){
		return {
			template: "application",
			partials: {
				navigation: "navigation",
				economists: "economists"
			},
			data: {
				economists: User.find.all()
			},
			views: [
				"navigation"
			]
		}	
	}

});