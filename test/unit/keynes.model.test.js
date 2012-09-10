/* 
	
	Tests will most likely never be very DRY. I think tests should be informative, and I think brevity often
	assumes too much and as a result only hinders understanding (especially if I've done something overtly stupid, 
	i.e. I prefer to fail fast).

	However, the form could definitely use some improvement.

*/


module("Keynes.Model.Base", {
	setup: function(){

	}
});

var UserFactory = {

	// @param[Boolean] 			arguments[0]					Set to true if you want the psuedo-table reset
	// @return[Array]			model_data 						Has two items the actual Model and default data for the model to create an instance
	create: function(){

		var User = new Keynes.Model.Base("User", {
			storage: {
				remote: false,
				local: true
			},
			has_many: {
				posts:"Post"
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

		var Post = new Keynes.Model.Base("Post", {
			storage: {
				remote: false,
				local: true
			},
			belongs_to: {
				user:"User"
			},
			attributes: {
				"title":"",
				"body":""
			},
			author: function(){
				return (this.user.full_name)
			}
		});
		
		// Reset the psuedo-table.

		if (arguments[0] == true) User.reset_table();

		var default_users = [{
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

		var model_data = [User, default_users]

		return model_data;
	}
}

/* 
	Previously calling reset_database() would (accidentally) delete the key
	and not create another one. This caused problems because the key would
	only be created when the model was initialized. Meaning if you called it
	after initialization it'd complain about a null key.

	It now calls #initializeModelInDatabase() after removing the key.

*/


test("reset database deletes the key/value in localstorage, and then creates a new empty key for the model", function(){

	var u = UserFactory.create();
	var instance = u[0].create(u[1][0]);

	u[0].reset_table();

	if(localStorage[u[0].model_name]) ok(true, "reset table removes the table then recreates they table key.");

});

test("is defined", function(){
	if(typeof Keynes.Model != "undefined")
		ok(true, "Keynesian Model is defined")
});

test("static methods exist", function(){
	
	var u = UserFactory.create();
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

	var u = UserFactory.create();
	var user = u[0], defaults = u[1]

	if(user.model_name == "User")
		ok(true, "instance has name correctly set");

});

test("attributes are being properly assigned and set", function(){

	var u = UserFactory.create();
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

	var u = UserFactory.create();

	var user = u[0], default_data = u[1]
	var instance = user.create(default_data[1])

	var full_name = instance.full_name();
	
	if(full_name=="John Galbraith"){
		ok(true, "attributes are acceisible to instance methods via `this`")
		ok(true, "instance method is set and returns correct value")
	}



});

// Unapply returns an object which can be saved to the database (i.e. without instance methods)

test("unapply returns data object", function(){
	var u = UserFactory.create();
	
	var user = u[0], default_data = u[1]
	var instance = user.create(default_data[0]);

	var expected_object = {
		id:"1",
		first_name:"John",
		last_name:"Keynes",
		email:"john.m.keynes@lordkeynes.com"
	}
	
	var data_obj = instance.unapply();

	for(var att in data_obj){
		if(expected_object[att] == data_obj[att])
			ok(true, "Attribute correctly unapplied")
	}
});


module("Keynes.Model.Find", {
	setup: function(){

	}
})

test("find is an instance of Keynes.Model.Find", function(){
	var u = UserFactory.create();

	var model = u[0], default_data = u[1]

	if(model.find instanceof Keynes.Model.Find){
		ok(true, "find is an instance of Keynes.Model.Find");
	}
});

test("find.byId returns an intance with the correct id", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);

	var instance_found = model.find.byId(1);

	if(instance.id == instance_found.id){
		ok(true, "find.byId returns an object with the correct id");
	}

});

test("find.by returns the correct instance", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);

	var instance_found_by_id = model.find.by('id',1);
	var instance_found_by_email = model.find.by('email', 'john.m.keynes@lordkeynes.com');

	if(instance_found_by_id.id == instance_found_by_email.id){
		ok(true, "find.by returns the correct instance");
	}

});

test("find.all returns the correct instance", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);
	var instance2 = model.create(default_data[1]);

	var instances_found = model.find.all();

	var count = 0;

	if(instances_found.length == 2){
		for(var i = 0; i < instances_found.length; i++){
			for(var prop in instances_found[i]){
				if(instances_found[i][prop] == "John") count++;
			}
		}
	}

	if(count == 2){
		ok(true, "find.all() returns all the instances");
	}

});

module("Keynes.Model.Association", {
	setup: function(){

	}
})

test("has_many returns the child (owned) model", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);
	var instance2 = model.create(default_data[1]);
	
	var data = {
					data:{
						id: 1,
						title: "A Treatise on Money",
						user_id: "1"
					}
				}

	var post = Keynes.Models.Post.create(data)

	var user = model.find.byId(1)

	if(user.posts[0].title == "A Treatise on Money") ok(true, "has_many correctly matches the parent (owner) with its children (owned)")

});


test("has_many returns an null when the model has no children", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);
	var instance2 = model.create(default_data[1]);
	
	var data = {
					data:{
						id: 1,
						title: "A Treatise on Money",
						user_id: "1"
					}
				}

	var user_with_no_posts = model.find.byId(2);

	if(!(user_with_no_posts.posts)) ok(true, "has_many correctly returns an empty array")

});

test("belongs_to returns the child (owned) model", function(){
	
	var u = UserFactory.create(true);

	var model = u[0], default_data = u[1];

	var instance = model.create(default_data[0]);
	var instance2 = model.create(default_data[1]);

	var data = {
					data:{
						id: 1,
						title: "A Treatise on Money",
						user_id: "1"
					}
				}

	var post = Keynes.Models.Post.create(data)
	if(post.user.id == instance.id) ok(true, "belongs_to correctly matches the child (owned) with its parent (owner)")

});