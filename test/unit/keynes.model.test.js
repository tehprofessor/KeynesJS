module("Keynesian Model", {
	setup: function(){

	}
})

var UserFactory = {
	create: function(){
		
		var User = new Keynes.Model.Base("User", {
			storage: {
				remote: false,
				local: true
			},
			attributes: {
				"email":"",
				"first_name":"",
				"last_name":""
			},
			full_name: function(){
				return (this.first_name +" "+ this.last_name)
			}
		});
		defaults = [{
					data:{
						id: 1,
						email: "john.m.keynes@lordkeynes.com",
						first_name: "John",
						last_name: "Keynes"
					}
				},{
					data:{
						id: 2,
						email: "john.k.galbraith@theman.org",
						first_name: "John",
						last_name: "Galbraith"
					}
				}]
		model_data = [User, defaults]
		return model_data;
	}
}

test("is defined", function(){
	if(typeof Keynes.Model != "undefined")
		ok(true, "Keynesian Model is defined")
});

test("static methods exist", function(){
	
	u = UserFactory.create();
	var user = u[0]

	if (typeof user.create == "function")
		ok(true, "instance has #create defined");

	if (typeof user.save == "function")
		ok(true, "instance has #save defined");

	if (typeof user.reset_table == "function")
		ok(true, "instance has #reset_table defined");

	if (typeof user.destroy == "function")
		ok(true, "instance has #destroy defined");

	if (typeof user.attributes == "object")
		ok(true, "instance has #attributes defined");

	if (typeof user.model_name == "string")
		ok(true, "instance has #model_name defined");

});

test("model_name is properly set", function(){

	u = UserFactory.create();
	var user = u[0], defaults = u[1]

	if(user.model_name == "User")
		ok(true, "instance has name correctly set");

});

test("attributes are being properly assigned and set", function(){

	u = UserFactory.create();
	var M = u[0], default_data = u[1]
	var instance = M.create(u[1][0])

	function assignAndSetAttributeTest(a, b){
		if(a){
			ok(true, "instance attribute correctly assigned");
			if(b){
				ok(true, "instance attribute has correct value")	
			}
		}
	}

	assignAndSetAttributeTest(
		(typeof instance.id == "string"), 
		(instance.id == 1)
	);
	assignAndSetAttributeTest(
		(typeof instance.email == "string"), 
		(instance.email == "john.m.keynes@lordkeynes.com")
	);
	assignAndSetAttributeTest(
		(typeof instance._type == "string"),
		(instance._type == "User")
	);

	assignAndSetAttributeTest(
		(typeof instance.first_name == "string"),
		(instance.first_name == "John")
	);

	assignAndSetAttributeTest(
		(typeof instance.last_name == "string"),
		(instance.last_name == "Keynes")
	);

});


test("instance method is correctly set and returns correct value", function(){

	u = UserFactory.create();

	var user = u[0], default_data = u[1]
	var instance = user.create(default_data[1])

	var full_name = instance.full_name();
	console.log(full_name)
	if(full_name=="John Galbraith"){
		ok(true, "attributes are acceisible to instance methods via `this`")
		ok(true, "instance method is set and returns correct value")
	}



});

// Unapply returns an object which can be saved to the database (i.e. without instance methods)

test("unapply returns data object", function(){
	u = UserFactory.create();
	
	var user = u[0], default_data = u[1]
	var instance = user.create(default_data[0])

	var expected_object = {
		id:"1",
		first_name:"John",
		last_name:"Keynes",
		email:"john.m.keynes@lordkeynes.com"
	}
	
	var data_obj = instance.unapply();

	for(att in data_obj){
		if(expected_object[att] == data_obj[att])
			ok(true, "Attribute correctly unapplied")
	}
});
