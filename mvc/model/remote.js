var Remote = {}
var AbstractRemote = function(opts){

	var GET = {}
	var AbstractGET = function(){

		this.it = function(){

		}

		this.them = function(){

		}

	}
	AbstractRemote.call(GET)

	this.get = GET;

	var POST = {}
	var AbstractPOST = function(){

		this.it = function(){

		}

		this.them = function(){

		}

	}
	AbstractPOST.call(POST)

	this.post = POST;

	var UPDATE = {}
	var AbstractUPDATE = function(){

		this.it = function(){

		}

		this.them = function(){

		}

	}
	AbstractUPDATE.call(UPDATE)

	this.update = UPDATE

	var DESTROY = {}
	var AbstractDESTROY = function(){

		this.it = function(){
			
		}

		this.them = function(){

		}

	}
	AbstractDESTROY.call(DESTROY)

	this.destroy = DESTROY

}
AbstractRemote.call(Remote)