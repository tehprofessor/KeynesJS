Keynes.Controller.Base = function(){

	var Controller, controller_name, controller_obj, Renderer;

	Controller = this;

	controller_name = arguments[0]
	controller_obj = arguments[1]

	Renderer = {}
	AsyncLoop.call(Renderer)

	function renderLayout(layout){
		var _url;
		if(!window.KEYNES_DEV){
			_url = "/templates/layouts/"+layout+".html";
		}else{
			_url = "/demo/templates/layouts/"+layout+".html";
		}
		$.ajax({
			type: "GET",
			url: _url,
			dataType: "HTML"
		})
		.done(function(data){
			var html, rendered_layout;

			html = $(data).html();
			rendered_layout = Mustache.to_html(html)
			$("body").html(rendered_layout);
		})
		.fail(function(){
			new Keynes.Error.LayoutNotFound();
		});
	}

	function renderTemplate(obj, result, loop){

		var _url, rendered, response_obj;
		response_obj = {}
		
		if(!window.KEYNES_DEV){
			_url = "/templates/"+controller_name.toLowerCase().split("controller")[0]+"/"+obj.action+".html";
		}else{
			_url = "/demo/templates/"+controller_name.toLowerCase().split("controller")[0]+"/"+obj.action+".html";
		}

		$.ajax({
			type: "GET",
			url: _url,
			dataType: "HTML"
		}).done(function(data){
			result.template = data
			loop.next();
		})
		.fail(function(){
			var msg = "Template not found <"+_url+">"
			new Keynes.Error.TemplateNotFound(msg)
		});
	}

	function renderView(obj, loop){

		var _url;
		if(!window.KEYNES_DEV){
			_url = "/views/"+controller_name.toLowerCase().split("controller")[0]+"/"+obj.action+".js";
		}else{
			_url = "/demo/views/"+controller_name.toLowerCase().split("controller")[0]+"/"+obj.action+".js";
		}
		

		$.getScript(_url)
		.done(function(){
			loop.next();
		})
		.fail(function(){
			var msg = "View not found <"+obj.url+".js>"
			new Keynes.Error.ViewNotFound(msg)
		});
	}

	function renderLayoutIfNecessary(){
		
		var success, layout, layout_type;

		layout_type = typeof Controller.layout
		success = true;

		if(layout_type == "function"){
			layout = Controller.layout();
		}else if(layout_type == "string") {
			layout = Controller.layout
		}else{
			new Keynes.Error.LayoutTypeError();
			success = false;
		}

		if(!$("#"+layout) && success == true)
			renderLayout(layout)

		return success;
	}

	Controller.render = function(obj){
		var result, loadedView;
		result = {};
		if(typeof obj.action != "undefined"){
			Renderer.asyncLoop(2, function(loop){
				if(loop.iteration() == 1){
					renderTemplate(obj, result, loop);
				}else{
					renderView(obj, loop);
				}
				
			}, function(){
				var renderedTemplate = Mustache.to_html($(result.template).html(), obj.locals);
				loadedView = controller_name.toLowerCase().split("controller")[0]+"/"+obj.action
				Keynes.Views[loadedView].initialize(renderedTemplate);
			});
		}
	}

	Controller.process = function(route){

		var params, action;

		params = route.params;
		action = route.action;

		// Layout can be either a function (that returns a string) or a string
		// if the layout is not present, the body of the page will be replaced
		// before rendering the action.

		renderLayoutIfNecessary();

		Controller[action](params);

	}

	controller_obj.call(Controller);

	Keynes.Controllers[controller_name] = Controller;

}