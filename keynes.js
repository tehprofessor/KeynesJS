jQuery.ajaxPrefilter("script", function(s) {s.crossDomain = true;});
var Keynes = {
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
		["utils/keynesian.logger.js",
		 "mvc/model/exceptions/no_local_storage_error.js",
		 "mvc/model/exceptions/inserting_to_local_database_failed_error.js",
		 "mvc/model/exceptions/local_find_error.js",
		 "mvc/model/find.js",
		 "mvc/keynesian.model.js"
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
		}

		this.asyncLoop(startup_files.length, function(loop){
			$.getScript(startup_files[loop.iteration()])
			 .done(function(script, status){
			 	console.log("Loaded: " + startup_files[loop.iteration()]);
			 	loop.next();
			 })
			 .fail(function(xhr, settings, exception){
			 	console.log("failed! files: "+startup_files+" iteration: "+loop.iteration())
			 	console.log("Failed to load: " + startup_files[loop.iteration()]);
			});
		
		}, function(){
			// BootUp.call(Keynes);
		});
	
	}
}
powerButtons.call(Keynes);

