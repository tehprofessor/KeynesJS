/* 
	
	Tests will most likely never be very DRY. I think tests should be informative, and I think brevity often
	assumes too much and as a result only hinders understanding (especially if I've done something overtly stupid, 
	i.e. I prefer to fail fast).

	However, the form could definitely use some improvement.

*/


module("Keynes.Routing.Base", {
	setup: function(){

		// There's no reason for the routes to be created and destroyed in the test as they're 'static'

	}

	teardown: function(){

		// do nothing

	}
});

// Create the routes:

new Keynes.Routing.Base(function(map){

    map('/', "UsersController.index");
    map('/users/:id', "UsersController.show");
    map('/users/:id/edit', "UsersController.edit");

});

test("", function(){



});