
/* global app */

app.controller('salesCtrl', 
['$scope', '$filter', '$http', '$modal', 'Page', '$location', 'focus', 'sesionesControl', 'authUsers', 'mainInfo', 'dolartoday',
function ($scope, $filter, $http, $modal, Page, $location, focus, sesionesControl, authUsers, mainInfo, dolartoday) {
	$scope.Page = Page;
	$scope.isLocal = authUsers.isLocal();
        
            mainInfo.get(function(data){
            $scope.Variables = data.variables[0];   
            Variables = data.variables[0];   

            //$scope.appName = data.variables[0].AppName;
            //console.log(Variables);
          });
        
	//$scope.Math = window.Math;
	//	dolartoday.get(function(data){
			//console.log(data.USD.dolartoday);
	//		$scope.dolartoday = data.USD.dolartoday;
	//	});

	  $scope.dolartoday = localStorage.getItem('dolartoday');

	  $scope.openSale = function (sale) {
		//$log.info(size);
		  var modalInstance = $modal.open({
	            templateUrl: 'views/sales/sale_details.html',
	            controller: 'ModalInstanceCtrl',
	            //windowClass: 'app-modal-window',
	            //backdrop: 'static',
	           size: 'lg',
	            
                resolve: {
                    item: function () {
                        return sale;
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
	  
	  
	  $scope.openDevol = function (dev) {
			//$log.info(size);
			  var modalInstance = $modal.open({
		            templateUrl: 'views/sales/devol_details.html',
		            controller: 'ModalInstanceCtrl',
		            //windowClass: 'app-modal-window',
		            //backdrop: 'static',
	               size: 'lg',
	                resolve: {
	                    item: function () {
	                        return dev;
	                    	//return $scope.client;
	                    }
	                }

		           });
		        
		        modalInstance.result.then(function (selectedItem) {
		            $scope.selected = selectedItem;

		            
		        }, function () {
		      //  $log.info('Modal dismissed at: ' + new Date());
		      });
		       
		       
		  };
	    
	 

	focus ('topic');
    //var message = '<strong> Well done!</strong>  You successfully read this important alert message.';
    //Flash.create('warning', message, 0, {class: 'custom-class', id: '1'}, true);
   
    //Flash.create('warning', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
   
	$scope.username = sesionesControl.get("username");
	$scope.name = sesionesControl.get("name");
	
	
	$scope.isLoggedIn  = authUsers.isLoggedIn();
	$scope.isAdmin     = authUsers.isAdmin();
	$scope.isLocal     = authUsers.isLocal();

	//if(!authUsers.isAdmin()) $location.path('welcome');
	
	 $scope.parseDate = function(jsonDate) {
	        //date parsing functionality
	        return Date.parse(jsonDate);
	     };
	 
	$scope.date = {
	         ini: new Date(),
	         end: new Date()
	       };
	
	 $scope.getSales = function(date_ini, date_end) {   
	    	date_ini = $filter('date')(new Date(date_ini), 'yyyy-MM-dd 00:00:00');
	    	date_end = $filter('date')(new Date(date_end), 'yyyy-MM-dd 24:00:00');
	    	$scope.date_ini2 = $filter('date')(new Date(date_ini), 'dd/MM/yy');
	    	$scope.date_end2 = $filter('date')(new Date(date_end), 'dd/MM/yy');
	    	
	    	code = '';
	    	//$scope.fecha = date_end;
		$http({
			method:'GET', 
		        url: Variables.ApiUrl + '/sales/sales/',
		        params: {date_ini: date_ini, date_end: date_end, code:code}
				
		    }).success(function(data){
		    	//Flash.create('warning', data.venta_facturas, 0)
	        	$location.path('sales');
	        	$scope.ventas_web = data;
	        	$scope.devoluciones_web = data;
	        	//console.log(data);
	        	var ventas_web = data.venta_web.total_ventas_web;
	        	var devoluciones_web = data.devolucion_web.total_devolucion_web;
	        	var total_facturas= data.venta_facturas.total_facturas;
	        	var credito = data.venta_facturas.total_facturas_credito;
	        	var total_cobrado = ventas_web - devoluciones_web + total_facturas;
	        	
	        	$scope.total_ventas_web =  window.Math.round(ventas_web);
	        	//$scope.total_devolucion_web = data.venta_web.total_devolucion_web;
	        	$scope.total_devolucion_web = window.Math.round(devoluciones_web);
	        	$scope.total_facturas = window.Math.round(total_facturas);
	        	$scope.total_facturas_credito = window.Math.round(credito); 	        		        		        	
	          	$scope.total = window.Math.round(total_cobrado);
	        }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
			});

	      	
	     }; 
	     
	     
	     $scope.getSalesByItem = function(code) {   
		    	date_ini = '';//$filter('date')(new Date(date_ini), 'yyyy-MM-dd 00:00:00');
		    	date_end = '';//$filter('date')(new Date(date_end), 'yyyy-MM-dd 24:00:00');
		     	//$scope.fecha = date_end;
			$http({
                            method:'GET', 
			        url: Variables.ApiUrl + '/sales/sales/',
			        params: {date_ini: date_ini, date_end: date_end, code: code}
					
			    }).success(function(data){
			    	//Flash.create('warning', data.venta_facturas, 0)
		        	$location.path('sales');
		        	$scope.ventas_web = data;
		        	$scope.devoluciones_web = data;
		        	
		        	
		        	var ventas_web = data.venta_web.total_ventas_web;
		        	var devoluciones_web = data.devolucion_web.total_devolucion_web;
		        	var total_facturas= data.venta_facturas.total_facturas;
		        	var credito = data.venta_facturas.total_facturas_credito;
		        	var total_cobrado = ventas_web - devoluciones_web + total_facturas;
		        	
		        	$scope.total_ventas_web =  window.Math.round(ventas_web);
		        	//$scope.total_devolucion_web = data.venta_web.total_devolucion_web;
		        	$scope.total_devolucion_web = window.Math.round(devoluciones_web);
		        	$scope.total_facturas = window.Math.round(total_facturas);
		        	$scope.total_facturas_credito = window.Math.round(credito); 	        		        		        	
		          	$scope.total = window.Math.round(total_cobrado);
		        }).error(function(){
					Flash.create('danger', Variables.ApiErrorMessage);
				});

		      	
		     }; 
			
}]);

app.filter("totalDev", function() {
	return function(items) {
	    var total = 0, i = 0;
	    angular.forEach(items.venta, function(item, key) {
	    	total += item.precio_venta;
	    });
	    //for (i = 0; i < items.length; i++) total += items[i].precio_venta;
	    return total;
	  };
	
  });

app.controller('ModalInstanceCtrl', ['authUsers', '$scope', '$modalInstance', 'item', '$http', 'Flash', '$timeout', 'mainInfo', 
    
        function(authUsers, $scope, $modalInstance, item, $http, Flash, $timeout, mainInfo) {
	 //console.log(item);
	//$scope.$on('$scope.venta_dev.venta', getTotalDev2);
	$scope.isLocal = authUsers.isLocal();
	mainInfo.get(function(data){
            $scope.Variables = data.variables[0];   
            Variables = data.variables[0];   
          });
        
	$scope.getTotalDev2 = function(venta){

	    
	    var total = 0;
    	angular.forEach(venta, function(product, key)
        {
    		if(product.cant_devol>0)
    		total += product.precio_venta * product.cant_devol;
    		//$scope.total = total;
        });
    	//console.log(total);
    	
    	return total;
	    
	};
	
	 $scope.parseDate = function(jsonDate) {
	        //date parsing functionality
	        return Date.parse(jsonDate);
	     };
	     
	     $scope.getTotalDev = function(art ) {
	    	 dev=0;
	    	 if(art.cant_devol>0)
	    		 dev= art.cant_devol*art.precio_venta;
	    	 
	    		 return dev;
		     };    
	
	 $scope.getCantidadMax = function (cantidad, art) {
		 res = [];
		 dev = 0;
	     if(art.cantidad_devuelta>0) dev=art.cantidad_devuelta;
	     for (i = cantidad-dev; i >= 1; i--) {
	       res.push(i);
	     }
	     //console.log(dev);
	     return res;
	  };
	
	$scope.item = item;
	//console.log(item);
	$scope.devolver = function (item){
		//console.log(item);
		$http({
			method:'get', 
	        url: Variables.ApiUrl + '/cart/devol/',
	        params: {id_venta: item.id_venta_web_detalle, codigo_articulo: item.codigo_articulo, cant_devol:item.cant_devol, precio_venta:item.precio_venta}
			
	    }).success(function(data){
	    	Flash.create('success', data.message);
	    	//$scope.id_venta = item.id_venta;
	    	//$scope.venta_web_detalle = data;
	    	$timeout(function() { $modalInstance.dismiss();}, '2000');
	    	 //$modalInstance.dismiss();
	    	//console.log(data);
	    }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
	};
	
	
	$scope.devolver2 = function (id_venta, list){
		
		$http({
			method:'get', 
	        url: Variables.ApiUrl + '/cart/devol2/',
	        params: {id_venta: id_venta}
			
	    }).success(function(data){
	   	Flash.create('success', data.message);
	   	
		angular.forEach(list, function(item, key) {
			//  this.push(key + ': ' + art);
			  //console.log(key + ': ' + art);
			 // console.log(art.cant_dev);
		//	 if(key==0) 	Flash.create('success', data.message)	
		//console.log(key);
		if(item.cant_devol>0){
			
		$http({
			method:'get', 
	        url: Variables.ApiUrl + '/cart/devol/',
	        params: {id_venta: item.id_venta_web_detalle, codigo_articulo: item.codigo_articulo, cant_devol:item.cant_devol, precio_venta:item.precio_venta, key: key}
			
	    }).success(function(data){
	   // if(key==0) 	Flash.create('success', data.message)
	    	//$scope.id_venta = item.id_venta;
	    	//$scope.venta_web_detalle = data;
	    	$timeout(function() { $modalInstance.dismiss();}, '2000');
	    	 //$modalInstance.dismiss();
	    	//console.log(data);
	    }).error(function(){
			//Flash.create('danger', Variables.ApiErrorMessage);
		});
		}
		/*
		}else{
			 if(key==0)	Flash.create('danger', 'Revise los datos');
		}*/
		
		});
	   	
	    	//$scope.id_venta = item.id_venta;
	    	//$scope.venta_web_detalle = data;
	    	//$timeout(function() { $modalInstance.dismiss()}, '2000')
	    	 //$modalInstance.dismiss();
	    	//console.log(data);
	    	
	    }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
		
	
		
	};
	
	$http({
		method:'GET', 
                url: Variables.ApiUrl + '/sales/sale_detail/',
                params: {id_venta: item.id_venta}

    }).success(function(data){
    	//Flash.create('warning', data.venta_facturas, 0)
    	$scope.id_venta = item.id_venta;
    	//$scope.fecha = data.venta;
    	$scope.venta_dev = data;
    	//$scope.devolucion_web_detalle = data.devolucion;
    	
    	//console.log(data);
    }).error(function(){
			Flash.create('danger', Variables.ApiErrorMessage);
		});
	
	
	$http({
		method:'GET', 
                url: Variables.ApiUrl + '/sales/devol_detail/',
                params: {id_devolucion: item.id_devolucion}

    }).success(function(data){
    	//Flash.create('warning', data.venta_facturas, 0)
    	$scope.id_devolucion = item.id_devolucion;
    	$scope.codigo_articulo = data.codigo_articulo;
    	$scope.precio_venta = data.precio_venta;
    	$scope.nombre = data.nombre;
    	$scope.detalles = data.detalles;
    	$scope.referencia = data.referencia;
    	$scope.medidas = data.medidas;
    	$scope.cantidad = data.cantidad;
    	//$scope.devolucion_web_detalle = data;
    	var total = 0;
    	angular.forEach(data, function(data, key)
        {
    		//console.log(data);
    		total += data.cantidad*data.precio_venta;
    		$scope.total = total;
        });
    	
    	$scope.devolucion_detail = data;
    	
    }).error(function(){
			//Flash.create('danger', Variables.ApiErrorMessage);
		});
		
		
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);


