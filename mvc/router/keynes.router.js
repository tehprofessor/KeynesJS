Keynes.Routing.Base = function(){
    
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

        var result;
        result = {};

        str.split(/\&/).map(function(key_val){
            var k_v_array = key_val.split(/\=/)
            result[k_v_array[0]] = k_v_array[1]
        });

        return result;
    }

    /* 

        @private                splitPath()                     Turns a path into an array

        @param[String]          path                            The path, e.g. /users/22

    */

    function splitPath(path){

        var path_array = [];

        path.split("/").map(function(piece){
            if(!isEmptyString(piece)) path_array.push(piece)
        });

        return path_array;
    }

    function mapAction(path, controller_action){

        var _params, // Temporary object to hold params
            params, // array of parameter names (names of the variables, e.g. id, user_id, age)
            action, // the controller action
            controller, // the controller
            path_array, // an array of the path (i.e. the path's pieces )
            path_length, // the number of items in path_array
            named_param, // regex to extract named parameters
            splat_param, // regex to extract splat parameters
            escape_reg_exp, // regex to escape regular expressions
            final_path;

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


        _params = path.match(named_param)
        params = []

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

        final_path = path.replace(escape_reg_exp, '\\$&')
                   .replace(named_param, '([^\/]+)')
                   .replace(splat_param, '(.*?)');

        if(_params != null){

            _params.map(function(param){
                 params.push(param.replace(/(^\:|\*)/, ''));
            });

        }

        routing_table[path_length].push({

            "path": final_path,
            "controller": controller,
            "action": action,
            "params": params

        });

        

    }

    function mapResource(path, controller){

        var actions;
        actions = ["index", "show", "edit", "new", "update", "destroy"]

        for(var i = 0; i < actions.length; i++){
            /* 

                @param[String]          resource_path             The path with the action appended
                @param[String]          resource_action           The controller with the action appended

            */

            var resource_path, resource_action;


            resource_path = path+actions[i];
            resource_action = controller+"."+actions[i];

            mapAction(resource_path, resource_action);

        }

    }

    /* 
        @public                 map
        
        @param[String]          path
        @param[Object]          routeDetails

    */

    function map(path, routeDetails){
        if(typeof routeDetails == "object"){
            determineRouteTypeAndMapIt(path, routeDetails)
        }else if(typeof routeDetails == "string") mapAction(path, routeDetails); // it's faster to not use an object, if you just want to route an action.
    }


    function determineRouteTypeAndMapIt(path, routeDetails){

        if(routeDetails.resource != undefined){
            
            mapResource(path, routeDetails.resource); 

        }else if(routeDetails.action != undefined){
            
            mapAction(path, routeDetails.action);

        }

    }

    function findRoute(path){

        var final_route, path_array, path_length;
        
        // This is to get the length of the path (in pieces)
        // to determine the starting index

        path_array = splitPath(path)
        path_length = path_array.length



        matchingRoute:

            for(var i in routing_table[path_length]){

                var route, result;

                route = routing_table[path_length][i]
                result = path.match(route.path);

                if(result != null){ 
                    
                    var params, params_array;

                    params = {};
                    params_array = result.slice(1);

                    // Need to clone the route into final_route

                    final_route = {}

                    for(prop in route){
                        final_route[prop] = route[prop]
                    }

                    // Go through the params array and assign them to the params obj
                    
                    for(var j = 0; j < final_route.params.length; j++){
                        params[final_route.params[j]] = params_array[j];
                    }
                    final_route.params = params

                    break matchingRoute;

                }

            }

        return final_route;
    }

    this.routeIt = function(){
        var _path, path, query;

        _path = arguments[0];

        path_and_query = _path.split(/\?/);

        if(path_and_query.length <= 1){ 

            path = _path

        }else{ 

            path = path_and_query[0]
            query = toParams(path_and_query[1]);

        }

        final_route = (typeof path == "string" && path.length == 1) ? routing_table[0] : findRoute(path)
        if(query != undefined){
            for(key in query){
                if(final_route.params[key] == undefined) final_route.params[key] = query[key]
            }
        }
        
        Keynes.Dispatcher.dispatch(final_route)

    }
    
    arguments[0].call(this, map);

    Keynes.Router = this;


}