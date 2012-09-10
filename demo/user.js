
// Shows: initialization and creating an instance method.

// currently only supports localStorage, remote support coming soon

var User = new Keynes.Model.Base("User", {
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


var economists = [{
					data:{
						id: 1,
						email: "john.m.keynes@lordkeynes.com",
						first_name: "John",
						last_name: "Keynes"
					}
				},{
					data:{
						id: 2,
						email: "john.k.galbraith@theman.org",
						first_name: "John",
						last_name: "Galbraith"
					}
				}]

for(var i = 0; i < economists.length; i++){
	User.create(economists[i])
}


// THIS IS NOT HOW OR WHERE TO RENDER TEMPLATES! I'm just trying things out...

	var tmpl = $("#layout_tmpl").html()
	var users = { users: User.find.all() }
	var rendered = Mustache.to_html(tmpl, users)
	$("body").append(rendered);