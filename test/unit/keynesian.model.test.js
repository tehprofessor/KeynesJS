module("Keynesian Model", {
	setup: function(){

	}
})

var UserFactory = {
	create: function(){
		
		var User = {}
		opts = {
			"name":"user",
			"fields":{
				"id":"", "type":"User","email":"","first_name":"","last_name":""
			},
			"key":"id"
		}
		KeynesianModel.call(User, opts);

		user_data = [User, opts]
		return user_data;
	},
	create_many: function(){
		u = create()
	}
}

test("is defined", function(){
	if(typeof KeynesianModel != "undefined")
		ok(true, "Keynesian Model is defined")
});

test("static methods exist", function(){
	
	u = UserFactory.create();
	var user = u[0], opts = u[1]

	if (typeof user.data == "function")
		ok(true, "instance has #data defined");

	if (typeof user.set == "function")
		ok(true, "instance has #set defined");

	if (typeof user.remove == "function")
		ok(true, "instance has #remove defined");

	if (typeof user.model_name == "function")
		ok(true, "instance has #name defined");

	if (typeof user.hasData == "function")
		ok(true, "instance has #hasData defined");
});

test("name is properly set", function(){

	u = UserFactory.create();
	var user = u[0], opts = u[1]

	if(user.model_name() == "user")
		ok(true, "instance has name correctly set")

});

test("fields are being properly set", function(){

	u = UserFactory.create();
	var user = u[0], opts = u[1]

	if(typeof user.fields.id == "string")
		ok(true, "field correctly set")

	if(typeof user.fields.email == "string")
		ok(true, "field correctly set")

	if(typeof user.fields.type == "string")
		ok(true, "field correctly set")

	if(typeof user.fields.first_name == "string")
		ok(true, "field correctly set")

});


// The information from the following test is stored locally
// and not reset between runs. Its persistence doesn't 
// have any affect on the tests, but I figured I'd note
// it.

test("fields can be set", function(){

	u = UserFactory.create();
	var user = u[0], opts = u[1]

	user.set("id", 1);
	if(user.data().id == 1)
		ok(true, "field was properly set")

	user.set("email", "testing@keynesjs.com");
	if(user.data().email == "testing@keynesjs.com")
		ok(true, "field was properly set")

	user.set("type", "Users")
	if(user.data().type == "Users")
		ok(true, "field was properly set")

	user.set("first_name", "John");
	if(user.data().first_name == "John")
		ok(true, "field was properly set")

	user.set("last_name", "Keynes");
	if(user.data().last_name == "Keynes")
		ok(true, "field was properly set")

});

test("finding by id", function(){
	u = UserFactory.create();
	var user = u[0], opts = u[1]
	lord_keynes = user.find.byId(1)
	if(lord_keynes.first_name == "John")
		ok(true, "Correctly looked up by id")
});
