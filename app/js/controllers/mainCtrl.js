
/* global app */

app.controller('mainCtrl', [ '$scope', '$http', 'focus', 'Flash', 'sesionesControl', 'authUsers', 'mainInfo', 'dolartoday', 'btc', '$location', 
    function ( $scope, $http, focus, Flash, sesionesControl, authUsers, mainInfo, dolartoday, btc, $location) {   
    //$scope.Variables = [];
    
    $scope.date = new Date();
    focus ('topic');
    $scope.dolarUp = false;
    //localStorage.setItem('dolartoday', '100');
    dolartoday.success(function(data){
    console.log(data);
    localStorage.setItem('dolartoday', data.USD.dolartoday*Variables.DolarAumento);
    $scope.dolartoday = data.USD.dolartoday*Variables.DolarAumento;
  }).error(function(){
      localStorage.setItem('dolartoday', 0);
      $scope.dolartoday = 0;
      if(authUsers.isLocal())
			Flash.create('danger', 'No hay respuesta del API de Dolar Today');
    });
    
    btc.success(function(data){
      console.log(data);
      localStorage.setItem('btc', data[0].price_usd);
      $scope.btc = data[0].price_usd;
    }).error(function(){
        localStorage.setItem('btc', 0);
        $scope.btc = 0;
        if(authUsers.isLocal())
        Flash.create('danger', 'No hay respuesta del API de Coin Market');
      });
  
    
    setInterval(function () {
    dolartoday.success(function(data){
      //console.log(Math.floor(Math.random() * 6) + 3680)
      if(data.USD.dolartoday > localStorage.getItem('dolartoday')) 
        $scope.dolarUp = true;
          else
        $scope.dolarUp = false;
	    
        localStorage.setItem('dolartoday', data.USD.dolartoday*Variables.DolarAumento);
        $scope.dolartoday = data.USD.dolartoday*Variables.DolarAumento;
      }).error(function(){
      localStorage.setItem('dolartoday', 0);
      $scope.dolartoday = 0;
      if(authUsers.isLocal())
			Flash.create('danger', 'No hay respuesta del API de Dolar Today');
		});
    }, 1800000);

    setInterval(function () {
      btc.success(function(data){
        //console.log(Math.floor(Math.random() * 6) + 3680)
        $scope.btc = data[0].price_usd;
        localStorage.setItem('btc', data[0].price_usd);
        }).error(function(){
        localStorage.setItem('btc', 0);
        $scope.btc = 0;
        if(authUsers.isLocal())
        Flash.create('danger', 'No hay respuesta del API de Coin Market');
      });
      }, 1800000);
  
    mainInfo.get(function(data){
    $scope.Variables = data.variables[0];   
    Variables = data.variables[0]; 
    var message = 'Email <a href ="mailto:' + Variables.Email + '?Subject=Información" target = "_blank">'+ Variables.Email +'</a>';
    //if(!authUsers.isLocal())
    //    Flash.create('warning', message, 0, {class: 'custom-class', id: '1'}, true);
    var message = 'Tienda carrada. Abrimos en Enero';
    if(!authUsers.isLocal())
        Flash.create('warning', message, 0, {class: 'custom-class', id: '1'}, true);    
  });


    $scope.user = { username : "", password : "" },
    authUsers.flash = "";
    
    $scope.username = sesionesControl.get("username");
    $scope.name = sesionesControl.get("name");

    $scope.login = function(){
    authUsers.login($scope.user);           	      
    };
	
	$scope.logout = function(){	
	authUsers.logout();       
   };
    $scope.isLoggedIn  = authUsers.isLoggedIn();
    $scope.isAdmin     = authUsers.isAdmin();
    $scope.isLocal     = authUsers.isLocal();
    
    
			
}]);

app.controller('menuCtrl', [ '$scope', '$location', 'focus' ,'authUsers', function ($scope, $location, focus, authUsers) {
	//$scope.Page = Page;
        // console.log(Variables);
  $scope.isLoggedIn  = authUsers.isLoggedIn();
	$scope.isAdmin     = authUsers.isAdmin();
	$scope.isLocal     = authUsers.isLocal();
        
	focus ('topic');
        $scope.getClass = function (path) {
    	//alert($location.path());
    	  if ($location.path() === '/'+path) {
    	    return 'active';
    	  } else {
    	    return '';
    	  }
    	};
    	
    clearSearch = function() {
        $scope.topic = null;
    };
    
     $scope.login = function(){
    authUsers.login($scope.user);           	      
    };
	
	$scope.logout = function(){
	
	authUsers.logout();
       
  };
    
}]);

