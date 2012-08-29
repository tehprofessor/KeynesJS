
// Shows: initialization and creating an instance method.

// currently only supports localStorage, remote support coming soon

var Post = new Keynes.Model.Base("Post", {
	storage: {
		remote: false,
		local: true
	},
	belongs_to: {
		user: "User"
	},
	attributes: {
		"title":"",
		"body":""
	}
});
