
// Shows: initialization and creating an instance method.

// currently only supports localStorage, remote support coming soon

var User = new Keynes.Model("User", {
	storage: {
		remote: false,
		local: true
	},
	attributes: {
		"email":"",
		"first_name":"",
		"last_name":""
	},
	full_name: function(){
		return (this.first_name +" "+ this.last_name)
	}
});
// Class Methods
User.find_by_email = function(){

}