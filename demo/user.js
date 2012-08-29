
// Shows: initialization and creating an instance method.

// currently only supports localStorage, remote support coming soon

var User = new Keynes.Model.Base("User", {
	storage: {
		remote: false,
		local: true
	},
	has_many: {
		posts: "Post"
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