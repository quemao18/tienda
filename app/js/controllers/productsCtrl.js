/* global app */

app.controller('searchCtrl',
        ['$routeParams', '$scope', 'mainInfo', 'Flash', 'dolartoday', '$http', '$timeout', 'Page', 'getTopic', '$location', 'ngCart', 'authUsers', '$modal', '$rootScope', 'focus', 
    function ($routeParams, $scope, mainInfo, Flash, dolartoday, $http, $timeout, Page, getTopic, $location, ngCart, authUsers, $modal, $rootScope, focus) {
    
    mainInfo.get(function(data){
    $scope.Variables = data.variables[0];   
    Variables = data.variables[0];   

    //$scope.appName = data.variables[0].AppName;
    //console.log(Variables);
  });

     
   // dolartoday.get(function(data){
    //console.log(data.USD.dolartoday);
	$scope.dolartoday = localStorage.getItem('dolartoday');//data.USD.dolartoday;
  //});

    $scope.Page = Page;	
    focus('topic');
    $scope.entryGroup = 12; 
    $scope.isLocal = authUsers.isLocal();

   //ngCart.setTaxRate(12);
    //ngCart.setShipping(2.99);   
	
    $scope.loadMoreGroup = function () {
     	  $scope.entryGroup += 4;  
     };
     
     $scope.loadMore= function () {
    	  $scope.entryLimit += 4;  
    };
    
     
    $rootScope.$on("loadGroupParent", function(event, item){
    	//console.log(getTopic.topic());    	
        $scope.loadGroup(item.codigo_grupo, getTopic.topic());
     });
    
    $scope.getNameSubGroup = function(subgroup){
    	$http({
                method:'GET', 
	        url: Variables.ApiUrl + '/products/subgroup_name/',
	        params: {subgroup: subgroup}
			
	    }).success(function(data){
	    	return data;
	    }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
    };

   //https://s3.amazonaws.com/dolartoday/data.json     	      
    


    $scope.isExist = function(exist){
        return function(product) {
             //console.log(exist);
             //console.log(thirdParam);
             if(exist)
            	 return product.existencia > 0;
            	 else
            	 return product;
                 
       };
  };
  
  $scope.isSubGrupo = function(subgrupo){
      return function(product) {
           //console.log(subgrupo);
           //console.log(thirdParam);
           if(subgrupo)
          	 return product.subgrupo === subgrupo;
           else
          return product;	 
               
     };
};
    
	//Page.setTitle('Resultados');		
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };
    
    $scope.clearUrl = function (topic){
    	//console.log("ok");
    	if(topic === undefined) topic = '';
    	
    	if(topic!==null || topic!=='')
    		topic = topic.toUpperCase().replace('*', 'X');
    	
    	$location.search('topic='+topic);
    	getTopic.setTopic(topic);    
		//this.searchFnc('', topic);	
    	//$location.url($location.path());
    };
      	
    $scope.searchFnc = function(group, topic) {
	/*		
     $http({
          method:'GET', 
	        url: Variables.ApiUrl + '/products/test/',
	    }).success(function(data){
			Flash.create('success', data.message);
	    }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
     */
		
		if($routeParams.topic!=='') {
			topic=$routeParams.topic;
				if(topic === undefined) topic = '';
			topic = topic.toUpperCase().replace('*', 'X');
		}else{
    		$location.search('topic='+topic);
    		if(topic === undefined) topic = '';
    		if(topic!==null || topic!=='')
    			topic = topic.toUpperCase().replace('*', 'X');
    	
		 }
    	getTopic.setTopic(topic);
    	focus('topic');
    	//$location.search('topic='+topic);
    	$location.path('products');
    	//$scope.products = {};
    	
    		$http({
    			method:'GET', 
    	        url: Variables.ApiUrl + '/products/index/',
    	        params: {group: group, topic:topic}
    			
    	    }).success(function(data){
    			
        		$scope.products = data;        		        
        		//alert(data.codigo_grupo.length );
        		$scope.filteredItems = $scope.products.length; //Initially for no filter  
                $scope.totalItems = $scope.products.length;
                if($scope.totalItems >= 1 ){
                	Page.setTitle($scope.totalItems + " grupos encontrados con '" + topic + "'");
                	//$location.path('products');
                	//$location.path('products?topic='+topic);
                }
                if($scope.totalItems < 1 ){                	            		
                	Page.setTitle("Nada encontrado con '" + topic + "'");
                	//$location.path('products'); 
                	//$location.path('products?topic='+topic);
                } /*
                if($scope.totalItems == 1 ){          
                $scope.loadGroup(group, topic);      	            		
                	//Page.setTitle($scope.totalItems + " grupos encontrados con '" + topic + "'");
                	//$location.path('products_list');                	
                } */
   		
            }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
    		   		
      };    
     
      
      $scope.loadGroup = function(group, topic) {   
    	 //topic = getTopic.topic();
    	 //$routeParams = {topic:topic};
    	 
    	 if($routeParams.topic!=='' || $routeParams.topic!==undefined) topic= $routeParams.topic;
    	 
    	 if(topic!==null || topic!==undefined)
    	  topic = topic.toUpperCase().replace('*', 'X');
    	 
    	 $scope.clearUrl(topic);    
    	 getTopic.setTopic(topic);
    	 focus('topic'); 
    	 Page.setTitle('');
    	 //$scope.products = {};
     	 $location.path('products_list');
    	  if(topic===null){ topic= '';} 
    	    
    	  $scope.entryLimit = 20; 
    	  
    	  $http({
                method:'GET', 
    	        url: Variables.ApiUrl + '/products/index/',
    	        params: {group: group, topic:topic}
    			
    	    }).success(function(data){
    	    	    	    	
    	    	$scope.products = data;
    	        	    	
    	    	$scope.filteredItems = $scope.products.length; //Initially for no filter  
                $scope.totalItems = $scope.products.length;
                if($scope.totalItems > 1 ){
                	Page.setTitle($scope.totalItems + " resultados con '" + topic +"'");            	                	  
                	focus('topic');//focus('filterList');
                }else{
                	Page.setTitle($scope.totalItems + " resultado con '" + topic +"'");                  	
                	focus('topic');        	    	        	      	
                }         
             
          }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
    	  
		 };

		 
    
    $scope.filter = function() {
        $timeout(function() { 
            $scope.filteredItems = $scope.filtered.length;
        }, 10);
    };
    $scope.sort_by = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };
    
   
	  $scope.openProduct = function (product) {
			//$log.info(size);
			  var modalInstance = $modal.open({
		            //templateUrl: 'myModalProduct.html',
                    templateUrl: 'views/products/product_edit.html',
		            controller: 'productEditCtrl',
		            //windowClass: 'app-modal-window',
		            //backdrop: 'static',
		           size: 'lg',
		            
	                resolve: {
	                    item: function () {
	                        return product;
	                    	//return $scope.client;
	                    }
	                }

		           });
		        
		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;

		            
		        }, function () {
		       // $log.info('Modal dismissed at: ' + new Date());
		      });
		        
		       
		  };
		  
		  
		  $scope.openImage = function (product) {
				//$log.info(size);
				  var modalInstance = $modal.open({
			            templateUrl: 'myModalImage.html',
			            controller: 'productEditCtrl',
			           
			            windowClass: 'app-modal-window',
			            //backdrop: 'static',
			           size: 'md',
			            
		                resolve: {
		                    item: function () {
		                        return product;
		                    	//return $scope.client;
		                    }
		                }

			           });
			        
			        modalInstance.result.then(function (selectedItem) {
			            $scope.selected = selectedItem;

			            
			        }, function () {
			       // $log.info('Modal dismissed at: ' + new Date());
			      });
			        
			       
			  };
    
    
}]);


app.controller('cartCtrl', ['scope', 'authUsers', function ($scope, authUsers) {

	$scope.isLoggedIn  = 'OK';//authUsers.isLoggedIn();
	$scope.isAdmin     = authUsers.isAdmin();
	
	
	
	}]);


app.controller('productEditCtrl', ['$scope', '$modalInstance', 'item', '$http', 'Flash', '$timeout', '$rootScope', function ($scope, $modalInstance, item, $http, Flash, $timeout, $rootScope) {

  //$scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        
        $scope.updateProduct = function (item) {
        	 $http({
         	method:'GET', 
                 url: Variables.ApiUrl + '/products/update_product/',
                 params: {	codigo: item.codigo, 
                                referencia: item.referencia, 
                                nombre:item.nombre, 
                                detalles:item.detalles, 
                                medidas:item.medidas, 
                                marca:item.marca,
                                ubicacion: item.ubicacion
                	 		}
         		
             }).success(function(data){
            	 Flash.create('success', data.message);
     	    	//$scope.id_venta = item.id_venta;
     	    	//$scope.venta_web_detalle = data;
     	    	$timeout(function() { $modalInstance.dismiss();}, '2000');
            	 $rootScope.$emit("loadGroupParent", item);
            	 //loadGroup(group, topic);
     	    	 //$modalInstance.dismiss();
     	    	//console.log(item.group);
             	
             }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
        };
        
        $http({
            method:'GET', 
            url: Variables.ApiUrl + '/products/product/',
            params: {code: item.codigo}
    		
        }).success(function(data){
        	//Flash.create('warning', data.venta_facturas, 0)
        	$scope.product = data;

        }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});

}]);
