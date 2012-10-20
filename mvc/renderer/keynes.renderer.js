Keynes.Renderer.Layout = function(layout){

	function getLayout(layout){
		
		var _url, rendered_layout;

		if(typeof layout == "string"){
			_url = "/templates/layouts/"+layout+".html";
		}else{
			new Keynes.Error.LayoutTypeError();
		}

		if(!!Keynes.Cache.on && (typeof Keynes.Cache.Layouts[layout] != "undefined")){

			$("body").html(Keynes.Cache.Layouts[layout])
				
		}else{

			rendered_layout = Keynes.Renderer.File.get(_url, "html");

			if(rendered_layout != null){
				Keynes.Cache.Layouts[layout] = rendered_layout;
				$("body").html(rendered_layout);
			}else{
				new Keynes.Error.LayoutNotFound();
			}

		}
		
	}
	renderLayout(layout);

}

(function(){

	// used mostly internally
	r.get = function(_url, _type){
		var result = {};
		$.ajax({
			type: "GET",
			url: _url,
			dataType: _type
		})
		.done(function(data){
			if(_type == "html")
				result = $(data)
			if(_type == "json" && (typeof data == "object")){
				result = data
			}else if(_type == "json" && (typeof data == "string")){
				try{
					result = $.parseJSON(data)
				}catch(e){
					new Keynes.Error.CouldNotParseJSON(_url, e)
				}
			}
		})
		.fail(function(data){
			result = null;
			Keynes.Logger.error(data)
			new Keynes.Error.FileNotFound(_url);
		});

		return result;
	}

})(Keynes.Renderer.File);