Keynes.Router = function(){
    
    var routing_table = {};
    /* 
        @public                 routes                      Public method to access the routing table

        @return[Object]

    */
    this.routes = routing_table;

    /* 
        @private                isEmptyString()             Checks to see if the value is a valid, non-empty (e.g. "") string

        @param[String]          str

        @return[Boolean]        
        
    */

    function isEmptyString(str){
        return (typeof str != "undefined" && str.length > 0) ? false : true
    }

    /* 
        @private                isParameter()               Checks to make sure the string can generate a valid key/value (e.g. `key=value`)

        @param[String]          str

        @return[Boolean]

    */

    function isParameter(str){
        return (typeof str != "undefined" && str.match(/\=/)) ? true : false;
    }

    
    /* 
        @private                toParams()

        @param[String]          str                             A string of URL params (should have initial "?" removed from string)
        
        @return[Object]

        @example                An example of what the function expects and returns
    
            var str = "22?name=Seve&email=coolguy@lamester.org&age=27"
            var params = toParams(str)
            
            => {
                name: "Seve",
                email: "coolguy@lamester.org",
                age: 27
            }
    */

    function toParams(str){

        var result = str.split(/\&/).reduce(function(a,b){

            var key, _t, o;

            if(typeof a == "object"){

                if(isParameter(b)){

                    _t = b.split(/\=/);
                    key = _t[0];
                    a[key] = _t[1];
                    return a;
                }

            }else{

                if(isParameter(b)){
                    _t = b.split(/\=/);
                    key = _t[0]; 
                    var _o = {}; 
                    _o[key] = _t[1];
                    return _o;
                }
                
            }
        });
        return result;
    }

    function splitPath(path){

        path = path.split("/").reduce(function(a,b){
            return (a) ? 
                (!isEmptyString(b)) ? a.concat(b) : a
                : (!isEmptyString(b)) ? [b] : null
        });

        return path;
    }

    function map(path, controller_action){

        var action, // the controller action
            controller, // the controller
            path_array, // an array of the path (i.e. the path's pieces )
            path_length, // the number of items in path_array
            named_param, // regex to extract named parameters
            splat_param, // regex to extract splat parameters
            escape_reg_exp; // regex to escape regular expressions

        // Assign variables their values
        
        controller = controller_action.split(/\./)[0];
        action = controller_action.split(/\./)[1];
        
        path_array = splitPath(path);
        path_length = (path_array == null) ? 0 : path_array.length;

        // Credit to Backbone.js for these three...
        // this was far simpler, and cleaner than anything I was
        // originally trying to implement.

        named_param    = /:\w+/g;
        splat_param    = /\*\w+/g;
        escape_reg_exp  = /[-[\]{}()+?.,\\^$|#\s]/g;

        /* 

            Alright, this is an idea I'm trying out, the
            'routing table' is indexed by the number of segments (pieces)
            in the path.

            When the router parses a path, it grabs the length, goes to the index,
            and then attempts to match it.

            I'm hoping this is more efficient than testing against all the paths;
            it's most likely not (more efficent) for very simple routes... but for 
            more complex ones, I'd expect it to outperform.

        */
        if(routing_table[path_length] == undefined) routing_table[path_length] = [];

        var final_path = path.replace(escape_reg_exp, '\\$&')
                   .replace(named_param, '([^\/]+)')
                   .replace(splat_param, '(.*?)');

        routing_table[path_length].push({

            path: final_path,
            controller: controller,
            action: action,
            params: path.match(named_param)

        });

    }

    function findRoute(path){

        var final_route, path_array, path_length;

        path_array = splitPath(path)
        path_length = path_array.length

        matchingRoute:

            for(var i in routing_table[path_length]){

                var route, result;

                route = routing_table[path_length][i]
                result = path.match(route.path);

                if(result != null){ 

                    final_route = route;
                    break matchingRoute;

                }

            }

        return final_route;
    }

    this.routeIt = function(){
        var _route;
        _route = arguments[0];

        final_route = (typeof _route == "string" && _route.length == 1) ? routing_table[0] : findRoute(_route)

        return final_route;

    }
    
    arguments[0].call(this, map);


}