/* 

	FYI: If location changes happen too quickly they wont be picked up and saved to the array.

*/

Keynes.Historian.Base = function(){

	var history, current_offeset;

	history = [];
	current_offeset = 0;

	$(window).bind('hashchange', function(){
		
		var hash = window.location.hash;
		
		history.push(hash);

	});

	this.timeline = function(){
		return history;
	}

	this.back = function(){
		if(current_offeset > 0) current_offeset--;

		return history[current_offeset]
	}

	this.forward = function(){
		
		// If the length is equal to the offset+1 then we are
		// on the current page and should return null;

		if((current_offeset.length+1 == history.length) || (current_offeset == 0)){

			return null;

		}else{

			current_offeset++;
			
			// Return the hash location

			return history[current_offeset]

		}
	}

}
