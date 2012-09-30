Keynes.Dispatcher.dispatch = function(route){

	var controller = Keynes.Controllers[route.controller];
	// Remember, that route contains the action, controller name (should we for some reason need it),
	// and the params. At this point we're ready to just let the controller have it.

    controller.process(route);

        
}