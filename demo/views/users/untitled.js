function View(){
	var self, partials;

	self = this;

	self.template = "";
	self.activeBindings = {
		actions: [],
		partials: []
	};

	self.setTemplate = function(templ){
		$.ajax({
			url: templ,
			type: "GET",
			dataType: "HTML"
		})
		.done(function(data){

			self.template = data.responseType
			
		})
		.fail(function(data){

			new Keynes.Error.TempalteNotFound();

		});
	}

	self.render = function(obj){

	}

	self.destroy = function(){
		self.activeBindings.map(function(item){
			$(item.element).off(item.binding);
		});
	}

	self.bind = function(elem, name, fn){

		if(typeof name == "object" && typeof name.binding == "string" && typeof name.child == "string"){
			$(elem).on(name.event, name.child, fn);
			self.activeBindings.actions.push({element: elem, event: name.event});
		}else if(typeof name == "string" && typeof fn == "function"){
			$(elem).on(name, fn);
			self.activeBindings.actions.push({element: elem, event: name});
		}else{
			new Keynes.Error.InvalidBindingNameType(name);
		}
	}

}

function Partial(name, fn){

	var self, name, file_name, template;

	self = this;

	file_name = (function(name){
		var name_array, result;
		name_array = name.split("/")
		result = null
		if(name_array.length == 2)
			result = "_"+name_array[1]
		return result
	})(name);

	template = (function(file){

	})(file_name);

	self.create = function(data){
		self.initialize(data);
	}

}


Keynes.Controller.Base("PropertiesContoller", function(){

	var c = this;

	c.layout = {
		layout: "home",
		data: Application.defaults
	}

	c.index = function(){
		var properties = Property.find.all()
		render({
			action: "index",
			locals: {
				"properties": properties
			}
		});
	};

});


new Keynes.View.Base("properties/index", function(){

	var v;
	v = this;
	
	var template = v.getTemplate("index")

	v.initialize = function(properties){

		index(properties);

	}

	function index(properties){

		v.render({
			partial: "house_grid"
		});

	}
 
});

new Keynes.View.Partial("properties/house_grid", function(){

	var p;
	p = this;

	p.house_grid = function(data){

		p.bind("[properties]", {event: "onmouseover.HouseGrid", child: "[property]"}, function(){
			showMicroDetails(this);
		});

		p.bind("[properties]", {event: "onmouseout.HouseGrid", child: "[property]"}, function(){
			hideMicroDetails(this);
		});

	}

	function showMicroDetails(elem){

		var microDetailHtml = "<div class='property-hover'>"+
						"<ul>"+
							"<li data-neighborhood=""></li>"+
							"<li data-bed-bath="">3=</li>"+
							"<li data-price=""></li>"+
							"<li data-likes=""></li>"+
						"</ul></div>"

		var property = $(this).html();

		$(p.template).innerHTML(microDetailHtml);
	}

});