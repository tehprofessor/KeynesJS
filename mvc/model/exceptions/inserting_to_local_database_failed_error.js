var InsertingToLocalDatabaseFailedError = {};
	function AbstractLocalDatabaseError(){
		this.alert = function(msg){
			alert(msg)

			return null
		}

		this.log = function(msg){
			Logger.error(msg)
		}
	}
AbstractLocalDatabaseError.call(InsertingToLocalDatabaseFailedError);