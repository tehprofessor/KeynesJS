jQuery.ajaxPrefilter("script", function(s) {s.crossDomain = true;});
var Keynes = {
		"Model":{
			"Base": {},
			"Find": {},
			"Association":{}
	
		},
		"Controller":{
			"Base":{}
		},
		"View": {
			"Base": {}
		},
		"Error":{
			"Model":{},
			"Controller":{},
			"View":{}
		},
		"Historian":{},
		"History":{},
		"Models":{},
		"Controllers":{},
		"Views": {},
		"Routing":{
			"Base": {}
		},
		"Router":{},
		"Dispatcher":{}
};

/* 
		Originally from: http://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
		Credit to: http://stackoverflow.com/users/170224/ivo-wetzel
*/
var AsyncLoop = function(){
	
	this.asyncLoop = function(iterations, func, callback) {
		    var index = 0;
		    var done = false;
		    var loop = {
		        next: function() {
		            if (done) {
		                return;
		            }
		
		            if (index < iterations) {
		                index++;
		                func(loop);
		
		            } else {
		                done = true;
		                callback();
		            }
		        },
		
		        iteration: function() {
		            return index - 1;
		        },
		
		        break: function() {
		            done = true;
		            callback();
		        }
		    };
		    loop.next();
		    return loop;
	};
};
AsyncLoop.call(Keynes)

var KeynesStartUpFiles = function(){ 
	this.framework_startup_files = 
		["/utils/keynesian.logger.js",
		 "/mvc/exceptions/keynes.error.base.js",
		 "/mvc/exceptions/keynes.error.startup.js",
		 "/mvc/exceptions/keynes.error.no_layout_found.js",
		 "/mvc/exceptions/keynes.error.layout_type_error.js",
		 "/mvc/exceptions/keynes.error.view_not_found.js",
		 "/mvc/router/keynes.router.js",
		 "/mvc/keynes.dispatcher.js",
		 "/mvc/model/exceptions/keynes.model.errors.js",
		 "/mvc/model/find.js",
		 "/mvc/keynes.model.js",
		 "/mvc/model/associations.js",
		 "/mvc/controller/keynes.controller.base.js",
		 "/mvc/router/keynes.historian.js",
		 "/mvc/view/keynes.view.base.js"
		];
}
KeynesStartUpFiles.call(Keynes)

var BootUp = function(){
	this.start = function(){
		var _final_route = this.routeIt();
		this.dispatch_from_route(_final_route);
	}
	this.start();
}

var powerButtons = function(){
	this.powerOn = function(config){

		var startup_files = this.framework_startup_files;

		if (config.environment == "test"){
			startup_files = startup_files.concat(config.tests)
		}else{
			startup_files = startup_files
							.concat(config.models.map(function(model){
								var str = !window.KEYNES_DEV ? "/models/" : "/demo/models/"
								return str+model;
							}))
							.concat(config.controllers.map(function(controller){
								var str = !window.KEYNES_DEV ? "/controllers/" : "/demo/controllers/"
								return str+controller;
							}))
							.concat(config.routes);
		}

		this.asyncLoop(startup_files.length, function(loop){
			
			$.getScript(startup_files[loop.iteration()])
			 .done(function(script, status){

			 	Keynes.Logger.log("Loaded: " + startup_files[ loop.iteration() ]);
			 	loop.next();
			 })
			 .fail(function(xhr, settings, exception){

			 	var msg = "Missing file <"+startup_files[loop.iteration()]+">"
			 	new Keynes.Error.FileNotFoundError(msg)
			 	
			});

		
		}, function(){
			// Router.call(Keynes);
			// BootUp.call(Keynes);
		});
	
	}
}
powerButtons.call(Keynes);

