var app = angular.module('myApp', ['ngRoute',                        
                                   'ui.bootstrap',
                                   'cgPrompt',
                                   'ngCart',
                                   'infinite-scroll',
                                   'angucomplete-alt', 
                                   'ngAnimate', 
                                   'ngResource', 
                                   'ngFlash', 
                                   'angular.filter', 
                                   'ngLoadingSpinner', 
                                   'angular-loading-bar']);

app.config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
        $routeProvider
            
            .when("/products", {
            	//title: 'Catálogo',
                templateUrl: "views/products/products_group.html"
                //controller: "searchCtrl"
            }) 
            .when("/products/:topic", {
            	//title: 'Catálogo',
                templateUrl: "views/products/products_group.html",               
                controller: "searchCtrl"
            }) 
            .when("/cart", {
            	title: 'Pedido',
                templateUrl: "views/cart/cart.html"               
                //controller: "cartCtrl"
            }) 
            .when("/products_list", {
            	//title: 'Catálogo',
                templateUrl: "views/products/products_list.html"
                //controller: "searchCtrl"
            }) 
            .when("/login", {
            	title: 'Login',
                templateUrl: "views/users/login.html"
                //controller: "loginCtrl"
            })            
            .when("/profile", {
            	title: 'Perfil usuario',
                templateUrl: "views/users/edit.html"
                //controller: "editCtrl"
            })
            .when("/register", {
            	title: 'Registro',
                templateUrl: "views/users/new.html",
                controller: "registerCtrl"
            })
            .when("/users/activate/:user", {
            	title: 'Login',
                templateUrl: "views/users/login.html",
                controller: "activateCtrl"
            })
            .when("/home", {
                //title: 'Inicio',
            	templateUrl: "views/index/index.html"
                //controller: "mainCtrl"
            })
            .when("", {
                //title: 'Inicio',
            	templateUrl: "views/index/index.html"
                //controller: "mainCtrl"
            })
            .when("/sales", {
                title: 'Ventas',
            	templateUrl: "views/sales/sales.html",
                controller: "salesCtrl"
            })
            .when("/forget", {
                title: 'Olvidó su password',
            	templateUrl: "views/users/forget.html",
                controller: "salesCtrl"
            })
            .otherwise({redirectTo:"/home"});
    });

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
    //cfpLoadingBarProvider.latencyThreshold = 2500;
}]);


app.factory('mainInfo', function($resource) { 
 return $resource('variables.json');
 
});

app.factory('Page', function() {
	   var title = 'default';	  
	   return {
	     title: function() { return title; },	     
	     setTitle: function(newTitle) { title = newTitle; }
	    
	   };
	});

app.factory('getTopic', function($window) {
	   //var ropic = $scope.topic;
	return {
		topic : function() {	
		return $window.document.getElementById('topic').value;  
    },
		setTopic : function(val) {	
		$window.document.getElementById('topic').value = val;  
    }
	      	    
	}; 
	  
	});

app.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });


//factoria para guardar y eliminar sesiones con sessionStorage
app.factory("sesionesControl", function(){
    return {
    	//obtenemos una sesión //getter
        get : function(key) {
            return sessionStorage.getItem(key);
        },
        //creamos una sesión //setter
        set : function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        //limpiamos una sesión
        unset : function(key) {
            return sessionStorage.removeItem(key);
        }
    };
});

//factoria para loguear y desloguear usuarios en angularjs
app.factory("authUsers", function($http, $location, sesionesControl, Flash, mainInfo, $route){
    var cacheSession = function(variable, value){
        //sesionesControl.set("userLogin", true);
        sesionesControl.set(variable, value);
        //sesionesControl.set("name", user);
    };
    var unCacheSession = function(){
        sesionesControl.unset("userLogin");
        sesionesControl.unset("username");
        sesionesControl.unset("role");
        sesionesControl.unset("name");
    };
 
    mainInfo.get(function(data){
    Variables = data.variables[0];   
    //console.log(Variables);
  });
    return {
        //retornamos la función login de la factoria authUsers para loguearnos correctamente
        login : function(user ){
        	//alert(user.username);
            return $http({
                //url: 'api/users/user/'+user.username+'/'+user.password,
                method: "GET",                
            	url: Variables.ApiUrl + '/users/user/', 
            	//url: 'api/login/loginUser/',                
            	params : {username: user.username, password: user.password }
                //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(user){
            	//alert(user);
               //console.log(user); 
               //si todo ha ido bien limpiamos los mensajes flash
                    //mensajesFlash.clear();
                    //creamos la sesión con el email del usuario
                    cacheSession('userLogin', true);
                    cacheSession('name', user.nombre);
                    cacheSession('username', user.nombre_usuario);
                    cacheSession('email', user.email);
                    cacheSession('direction', user.direccion);
                    cacheSession('role', user.tipo_usuario_id_tipo_usuario);
                    //mandamos a la home
                    //$route.reload();
                   window.location='';
                   //console.log(user); 
                   //$location.path("/welcome");
               
            }).error(function(error){
            	//alert(user.box);           	
            		//mensajesFlash.show(error.message, 'danger');
            	Flash.create('danger', error.message);
                //$location.path("/")
            });
        },
        //función para cerrar la sesión del usuario
        logout : function(){
            
            unCacheSession();
            //$route.reload();
            //$location.path("/welcome");
            window.location='';
        },
        //función que comprueba si la sesión userLogin almacenada en sesionStorage existe
        isLoggedIn : function(){
            return sesionesControl.get("userLogin");
        },
        
        isAdmin : function(){
        	if(sesionesControl.get("role") == 1)
                return true;
        	else
        	return false;	
        },
        
        isLocal : function(){
        	if($location.host() == 'localhost' || $location.host() == 'servidor')
            return true;
        	else
        	return false;	
        }
        
        
    };
});
 

 
//mientras corre la aplicación, comprobamos si el usuario tiene acceso a la ruta a la que está accediendo
//como vemos inyectamos authUsers
app.run(function($rootScope, $location, authUsers, $route, Page){
	//creamos un array con las rutas que queremos controlar
    var rutasPrivadas = ["/profile", "/sales"];
    
   //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function(){
    	//si en el array rutasPrivadas existe $location.path(), locationPath en el login
    	//es /login, en la home /home etc, o el usuario no ha iniciado sesión, lo volvemos 
    	//a dejar en el formulario de login
        if(in_array($location.path(), rutasPrivadas) && !authUsers.isLoggedIn()){
            $location.path("/login");
        }
        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
        if( ($location.path() == '/login' || $location.path() == '/register' ) && authUsers.isLoggedIn() ){
            $location.path("/home");
        }
    });
    $rootScope.$on('$routeChangeSuccess', function(newVal, oldVal) {
        if (oldVal != newVal) {
            //document.title = $route.current.title;
            Page.setTitle (  $route.current.title );
        }
    });
    
});

//$(this).val($(this).val().toUpperCase().replace(/[^VEJGP(0-9)$]/g,""));

function validarRIF( campo )
{
	//var divResultado = document.getElementById('errorDiv3');
	 if(campo === undefined || campo===""){
         return false;
     }
	
	else
	{
	var cedula = campo;
	var array = cedula.split( "" );
	var resto=cedula.substr(1);
			if(
				array[0]!=="V" &&		 
				array[0]!=="J" &&
				array[0]!=="E" &&
				array[0]!=="P" &&
				array[0]!=="G"  
				)
			{
		  	 return false;
			}else{
				if(	$.isNumeric(resto) && resto.length>5 && resto.length<10)
				{
					return true;
				}else{
					return false;
				}
			}
	}
}

//función in_array que usamos para comprobar si el usuario
//tiene permisos para estar en la ruta actual
function in_array(needle, haystack, argStrict){
  var key = '',
  strict = !! argStrict;
 
  if(strict){
    for(key in haystack){
      if(haystack[key] === needle){
        return true;
      }
    }
  }else{
    for(key in haystack){
      if(haystack[key] === needle){
        return true;
      }
    }
  }
  return false;
}

var directiveId = 'ngMatch';
app.directive(directiveId, ['$parse', function ($parse) {
 
var directive = {
link: link,
restrict: 'A',
require: '?ngModel'
};
return directive;
 
function link(scope, elem, attrs, ctrl) {	
// if ngModel is not defined, we don't need to do anything
if (!ctrl) return;
if (!attrs[directiveId]) return;
 
var firstPassword = $parse(attrs[directiveId]);
 
var validator = function (value) {
var temp = firstPassword(scope),
v = value === temp;
ctrl.$setValidity('match', v);
return value;

};
 
ctrl.$parsers.unshift(validator);
ctrl.$formatters.push(validator);
attrs.$observe(directiveId, function () {
validator(ctrl.$viewValue);
});
 
}
}]);
