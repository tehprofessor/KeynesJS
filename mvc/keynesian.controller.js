var Routes = {

}

var RoutingTable = {
	"users_controller" : {
		"index": function(){
			
		}
	}
}


var KeynesianController = {}
function AbstractKeynesianController(){
	this.action = function(m, block){
		RoutingTable[name][m] = block
	}
}
AbstractKeynesianController.call(KeynesianController)