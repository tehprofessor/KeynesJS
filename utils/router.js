var Router = function(){
	
	this.location_hash_to_path = function(location_hash){
		var path = "";
		if(location_hash.length>0){
			path = location_hash.split(/#/).pop().split("/");
		}else{
			var _cookie = $.cookie('_fauxtobox_session');
			if(_cookie){
				path = "logged_in_root";
			}else{
				path = "root";
			}
		}
		return path;
	};

	this.routeIt = function(){
		var current_path = this.location_hash_to_path(location.hash);
		var final_route = this.match_route(current_path);
		return final_route;
	};

	this.match_route = function(path){
		var final_route = {}
		if(path == "root"){
			for(i=0;i<this.routes.length;i++){
				if(this.routes[i].kind == "root"){
					jQuery.extend(final_route, this.routes[i]);
					break;
				}
			}
		}else if(path == "logged_in_root"){
			for(i=0;i<this.routes.length;i++){
				if(this.routes[i].kind == "logged_in_root"){
					jQuery.extend(final_route, this.routes[i]);
					break;
				}
			}
		}
		return final_route;
	};

};