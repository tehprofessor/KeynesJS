new Keynes.View.Base("users/show", function(){
	this.initialize = function(tmpl){
		if($("#users-show")){
			$("#users-show").remove();
		}
		$("body").append(tmpl)
	}
});