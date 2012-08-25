var Find = {}
var AbstractFind = function(opts){	
	
	var db = opts.db
	var name = opts.name

	this.all = function(){
		var result = ""
		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				result = jQuery.parseJSON(str);
			}catch(e){
				Logger.error(e)
			}
		}
		return result
	}
	
	this.byId = function(id){
		var result = ""
		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				result = table[0][id]
			}catch(e){
				Logger.error(e)
			}
		}
		return result
	}
	
	this.byProperty = function(key, value){
		var result = ""
		if(db){
			try {
				var str = "["+db.getItem(name)+"]"
				table = jQuery.parseJSON(str);
				found = false
				for(i = 0, tblLength = table.length; i<tblLength; i++){
					if(!found){
						if((typeof table[i] == "string")){
							if((typeof table[i][property] == "string")){
								if(table[i][property] == value){
									result = table[i] 
									found = true
								}else{ 
									null
								}
							}
						}
					}
				}
			}catch(e){
				LocalFind.log("Nothing found matching key: `"+key+"` with value: "+value)
			}
		}
		return result	
	}
	
}