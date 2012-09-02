/* 

	In the Global Namespace:

		To turn on the debugging mode:
		var debugMode = true 
	
		To turn off debugging mode:
		delete debugMode
*/

Keynes.Logger = {}
var AbstractLogger = function(){
	
	this.log = function(message){
		var msg = null

		if(console){
			console.log(message)
			msg = message
		}

		return msg
	}

	this.debug = function(message){
		if(!(typeof debugMode === "undefined")){
			var finalMessage = this.newlines_with_mode(message, "debug")
			return this.log(finalMessage)
		}
	}
	
	this.error = function(message){
		var finalMessage = this.newlines_with_mode(message, "error")
		return this.log(finalMessage)
	}

	this.newlines_with_mode = function(message, mode){
		var split = message.split(/\n/)
		var msg = []
		var finalMessage = ""
		if(split.length > 1){
			for(s in split){
				var str = "["+mode+"] "+split[s]
				msg.push(str);
			}
			finalMessage = msg.join("\n")
		}else{
			finalMessage = "["+mode+"] "+message.toString()
		}
		return finalMessage
	}

}
AbstractLogger.call(Keynes.Logger)