
/* global app */

app.controller('mainCtrl', [ '$scope', 'focus', 'Flash', 'sesionesControl', 'authUsers', 'mainInfo', '$location', 
    function ( $scope, focus, Flash, sesionesControl, authUsers, mainInfo, $location) {   
    //$scope.Variables = [];
    
    $scope.date = new Date();
    focus ('topic');
        
    mainInfo.get(function(data){
    $scope.Variables = data.variables[0];   
    Variables = data.variables[0]; 
    var message = 'Información sólo por Email <a href ="mailto:' + Variables.Email + '?Subject=Información" target = "_blank">'+ Variables.Email +'</a>';
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

