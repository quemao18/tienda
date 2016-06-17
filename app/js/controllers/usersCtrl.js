//controlador loginController
//inyectamos la factoria authUsers en el controlador loginController
//para hacer el login de los usuarios
app.controller("loginCtrl", ['$scope', '$location', 'authUsers', 'Page', '$routeParams', function($scope, $location, authUsers, Page, $routeParams){
	//Page.setTitle('Login');
    $scope.user = { username : $routeParams.user, password : "" };
    authUsers.flash = "";
    //función que llamamos al hacer sumbit al formulario
    $scope.login = function(){
        authUsers.login($scope.user);
    };
    $scope.registerView = function(){
        $location.path('/register');
    };
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);
  
app.controller("forgetCtrl", ['$scope', '$location','Page', '$http', 'Flash', function($scope, $location, Page, $http, Flash){
	//Page.setTitle('Login');
     //función que llamamos al hacer sumbit al formulario
    $scope.forget = function(user){
    	//console.log(user);
        //authUsers.login($scope.user);
        $http({
		method:'GET', 
        url: Variables.ApiUrl +  '/users/forget/',
        params: {username: user.username}
    
    }).success(function(data){
		 //alert(user.nombre_usuario);
		 Flash.create('success', data.message);
		 //console.log(data.user);
		 	$http({
						 method:'POST', 
						 url: Variables.ApiUrl + '/users/sendEmailPassword/',
						 //headers: {'Content-Type': 'application/json'},
						 data: {"user":user.nombre_usuario,"password":data.password, "email":data.user.email, "name":data.user.nombre}
						 }).success(function(data){
							Flash.create('success', data.message, 0);
							$location.path("/");
			    		 //$timeout(window.location='/', 2000);
			    	    }).error(function(error){
			    	    	Flash.create('danger', error.message);
			                //$location.path("/")
			            });
		 
    	 //console.log(data);
    	
    }).error(function(data){
    	Flash.create('danger', data.message,0);
    });
    };
    
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);
 
app.controller("activateCtrl", ['$scope', '$http', '$location', 'authUsers', 'Page', '$routeParams', 'Flash', 
function($scope, $http, $location, authUsers, Page, $routeParams, Flash ){
	 //$scope.user = { username : "", password : "" }
    //authUsers.flash = "";
    
    //$location.path('');
    $http({
		method:'GET', 
        url: Variables.ApiUrl + '/users/activate/',
        params: {user:$routeParams.user }
		
    }).success(function(data){
    	//alert(data.message);
		 //alert("ok");
    	//sesionesControl.set('name', user.nombre);
    	Flash.create('success', data.message,0);
    	//$location.path("/login");
		//$timeout(window.location='welcome', '3000');
	       //$scope.user = user;
	    }).error(function(error){
	    	Flash.create('danger', error.message,0);
        	//$location.path("/")
        });
    
    //focus('username');
    //$scope.user = {username: $routeParams.user};
    //mensajesFlash.showMain('usuario ' + $routeParams.user + ' codigo ' + $routeParams.code );
    //función que llamamos al hacer sumbit al formulario
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);


app.controller("editCtrl", ['$http', '$scope', '$location', 'focus', 'authUsers', 'Page', 'sesionesControl', 'Flash', '$timeout', function($http, $scope, $location, focus, authUsers, Page, sesionesControl, Flash, $timeout){
	//Page.setTitle('Perfil usuario');
    //alert(sesionesControl.get("username"));
	//$scope.user.username = sesionesControl.get("username");
	//$scope.user.name = sesionesControl.get("name");

	focus('topic');
	$http({
		method:'GET', 
        url: Variables.ApiUrl +  '/users/user/',
        params: {username: sesionesControl.get("username")}
    
    }).success(function(user){
		 //alert(user.nombre_usuario);
    	
    	user.passwordConf = ""; 
     	user.password = "";
    	$scope.user = user;	
    });
	
    //authUsers.flash = "";
    //función que llamamos al hacer sumbit al formulario
	//$name, $user, $password, $email, $direction, $phone
    $scope.edit= function(user){
    	if(typeof user.password === "undefined")
    		user.password = "";    	
    	$http({
    		method:'GET', 
            url: Variables.ApiUrl + '/users/edit/',
            params: {name:user.nombre,user:user.nombre_usuario, email:user.email, direction:user.direccion, phone:user.telefono, password:user.password}
			
        }).success(function(data){
        	//alert(data.message);
    		 //alert("ok");
        	sesionesControl.set('name', user.nombre);
        	Flash.create('success', data.message);
    		//$location.path("/profile")
    		//$timeout(window.location='welcome', '5000');
    		//$timeout('5000');
    	       //$scope.user = user;
		        	$http({
		          		 method:'GET', 
		          		 url: Variables.ApiUrl +  '/users/sendEmailUpdate/',
		          		 //headers: {'Content-Type': 'application/json'},
		          		 params: {name: user.nombre, user: user.nombre_usuario, email: user.email, pass: user.password}
		          		 }).success(function(data){
		          		 //mensajesFlash.clear();
		          			Flash.create('success', data.message);
		          			$location.path("/");
		          		 //$timeout(window.location='welcome', 2000);
		          	    }).error(function(error){
		          	    	Flash.create('danger', error.message);
		                    //$location.path("/")
		                });
        	
    	    }).error(function(error){
            	//mensajesFlash.clear();
    	    	Flash.create('danger', error.message);
                //$location.path("/")
            });
    	
    	
    };
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);

app.controller("registerCtrl", ['$http', '$scope', '$location', 'authUsers', 'Page', 'sesionesControl', 'Flash', '$timeout', 'focus', function($http, $scope, $location, authUsers, Page, sesionesControl, Flash, $timeout, focus){
	$scope.user.password = "";
	$scope.user.passwordConf = "";


 $scope.focusOut = function(val) {
    		   var focusInputElem = document.getElementById('username');
    		   //console.log((val));
    		   if(!validarRIF(val)) {
    				$scope.error = true; 
    				focusInputElem.focus();
    				return;
    			}else{		                        				
    				$scope.error = false; 
    				//$scope.$broadcast('angucomplete-alt:changeInput', 'codigo', focusInputElem.value);
    				$http.get(Variables.ApiUrl + '/users/nombre_rif/?rif='+val ) .success(function(data){
    				//$http.get('http://contribuyente.seniat.gob.ve/getContribuyente/getrif?rif='+focusInputElem.value ) .success(function(data){
    				//console.log(data);
    					//if(val === undefined){
    					$scope.user.nombre = data.nombre;		                        				   				 		                        		        				 		                        		        
                    	if(data.nombre!='') focus('email');
    					
                       //}
                                                    
        			});
        			
    			}
                    		   
    	};

	
	$scope.register = function(user){

		$http({
			 method:'POST', 
			 url: Variables.ApiUrl + '/users/user/',
			 //headers: {'Content-Type': 'application/json'},
			 data: {"name":user.nombre,"user":user.nombre_usuario,"email":user.email, "direction":user.direccion, "phone":user.telefono, "password":user.password}
			 }).success(function(data){
				 
					 $http({
						 method:'POST', 
						 url: Variables.ApiUrl + '/users/sendEmailRegister/',
						 //headers: {'Content-Type': 'application/json'},
						 data: {"name":user.nombre,"user":user.nombre_usuario,"email":user.email, "direction":user.direccion, "phone":user.telefono, "password":user.password}
						 }).success(function(data){
							Flash.create('success', data.message, 0);
							$location.path("/");
			    		 //$timeout(window.location='/', 2000);
			    	    }).error(function(error){
			    	    	Flash.create('danger', error.message);
			                //$location.path("/")
			            });
					 
				Flash.create('success', data.message);
				$location.path("/");
    		 //$timeout(window.location='welcome', 2000);
    	    }).error(function(error){
    	    	Flash.create('danger', error.message);
                //$location.path("/")
            });
		 
		
				
    };
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);

// no en uso, porque el controlador lo uso en el mismo modalinstance
app.controller("registerPremiumCtrl", ['$http', '$scope', '$location', 'authUsers', 'Page', 'sesionesControl', 'Flash', '$timeout', function($http, $scope, $location, authUsers, Page, sesionesControl, Flash, $timeout){

	    $http({
	            method: 'GET',
	            url: Variables.ApiUrl + '/users/client_type_premium/'
	            //data: { applicationId: 3 }
	        }).success(function (result) {
	        $scope.tipoRes = result;
	    });
	    
	    //$scope.zona= {codigo: '02'};
		$http({
		         method: 'GET',
		         url: Variables.ApiUrl +  '/users/client_zone_premium/'
		        // data: { zone: '' }
		     }).success(function (result) {
		     $scope.zoneRes = result;
		    
		 });
		
	
	$scope.registerPremium = function(user){
		console.log(user);
/*
		$http({
			 method:'POST', 
			 url: 'api/users/client_premium/',
			 //headers: {'Content-Type': 'application/json'},
			 data: {"name":user.nombre,"user":user.nombre_usuario,"type":user.tipo, "direction":user.direccion, "phone":user.telefono, "zone":user.zona}
			 }).success(function(data){
				 	 
				Flash.create('success', data.message);
    		 //$timeout(window.location='welcome', 2000);
    	    }).error(function(error){
    	    	Flash.create('danger', error.message);
                //$location.path("/")
            });
		 */
		
				
    };
    	//$scope.loginIn  = authUsers.isLoggedIn();
  }]);
