Keynes.View.Base = function(){
	var view_name, view_function, View;

	View = this;
	view_name = arguments[0];
	view_function = arguments[1];

	view_function.call(View)
	Keynes.Views[view_name] = View;
}