'use strict';


angular.module('ngCart', ['ngCart.directives'])

    .config([function () {

    }])

    .provider('$ngCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function(){
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', 'ngCartItem', 'store', 'sesionesControl', '$location', function ($rootScope, ngCartItem, store, sesionesControl, $location) {

        this.init = function(){
            this.$cart = {
                shipping : null,
                taxRate : null,
                tax : null,
                items : []
            };
        };

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
                $rootScope.$broadcast('ngCart:itemUpdated', inCart);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate){
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function(){
            return this.$cart.taxRate
        };

        this.getTax = function(){
            return +parseFloat(((this.getSubTotal()/100) * this.getCart().taxRate )).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };

        this.removeItem = function (index) {
            var item = this.$cart.items.splice(index, 1)[0] || {};
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});
           
            

        };

        this.removeItemById = function (id) {
            var item;
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if(item.getId() === id) {
                    item = cart.items.splice(index, 1)[0] || {};
                    //console.log( cart.items.splice(index,1)[0] );
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});
            //window.location='cart';
            //$rootScope.price = '1111';
            //console.log($rootScope.price);
        };

        this.empty = function () {
            
            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };
        
        this.isEmpty = function () {
            
            return (this.$cart.items.length > 0 ? false : true);
            
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                username: sesionesControl.get('username'),
                name: sesionesControl.get('name'),
                email: sesionesControl.get('email'),
                direction: sesionesControl.get('direction'),
                items:items
            };
        };


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set('cart', JSON.stringify(this.getCart()));
        };

    }])

    .factory('ngCartItem', ['$rootScope', '$log', '$http', function ($rootScope, $log, $http) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this._name;
        };

        item.prototype.setPrice = function(price){
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                    
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function(){
            return this._price;
        };
               
        item.prototype.setQuantity = function(quantity, relative){


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0){
                if (relative === true){
                    this._quantity  += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
               // $log.info($rootScope.isAdmin);
                if (this._quantity < 1 ) 
                	this._quantity = 0;
                

            } else {            	
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }


        };

        item.prototype.getQuantity = function(){
            return this._quantity;
        };

        item.prototype.setData = function(data){
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function(){
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                //precio_articulo: this.getPrecioArticulo(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage [key]) {
                    var cart = angular.fromJson($window.localStorage [key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage .removeItem(key);
                } else {
                    $window.localStorage [key] = angular.toJson(val);
                }
                return $window.localStorage [key];
            }
        }
    }])

    .controller('CartController',['$scope', 'ngCart', 'authUsers', '$modal', 'mainInfo', function($scope, ngCart, authUsers, $modal, mainInfo) {
        $scope.ngCart = ngCart;
    	$scope.isLoggedIn  = authUsers.isLoggedIn();
    	$scope.isAdmin     = authUsers.isAdmin();
    	$scope.isLocal     = authUsers.isLocal();
    	mainInfo.get(function(data){
        Variables = data.variables[0]; 
        $scope.Variables = data.variables[0]; 
        //console.log(Variables);
      });

	  	$scope.openRegister = function (product) {
		//$log.info(size);
		  var modalInstance = $modal.open({
	            templateUrl: 'myModalRegisterPremium.html',
	            controller: 'registerPremiumCtrl',
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
    	
    	
    }])    

    .value('version', '1.0.0');
;'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
        $scope.ngCart = ngCart;
        $scope.isLoggedIn  = authUsers.isLoggedIn();
    	$scope.isAdmin     = authUsers.isAdmin();
    	$scope.isLocal     = authUsers.isLocal();
    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/addtocart.html';
                    //return "cart/addToCartViewNg"; 
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/cart.html';
                   // return "cart/cartViewNg"; 
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/summary.html';
                    //return "cart/summaryViewNg"; 
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }])

    .directive('ngcartCheckout', [function(){
        return {
            restrict : 'E',
            controller : ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', '$modal', function($rootScope, $scope, ngCart, fulfilmentProvider, $modal) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    
                    fulfilmentProvider.checkout().success(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        });
                };
            }]),
            scope: {
                service:'@',
                settings:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl === 'undefined' ) {
                    return 'views/ngCart/checkout.html';
                   // return "cart/checkoutViewNg"; 
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);
;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function($injector){

        this._obj = {
            service : undefined,
            settings : undefined
        };

        this.setService = function(service){
            this._obj.service = service;
        };

        this.setSettings = function(settings){
            this._obj.settings = settings;
        };

        this.checkout = function(){
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
              return provider.checkout(this._obj.settings);

        };

    }])


.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart){

        this.checkout = function(){

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart:ngCart.toObject()
            });

            return deferred.promise;

        };

 }])

.service('ngCart.fulfilment.http', ['$http', 'ngCart', function($http, ngCart){

        this.checkout = function(settings){
            return $http.post(settings.url,
                { data: ngCart.toObject(), options: settings.options});
        };      
        
 }])
 
 .service('ngCart.fulfilment.sale', ['$http', 'ngCart', 'Flash', function($http, ngCart, Flash){

        this.checkout = function(settings){
        	
        	return $http.post(settings.url,
                    { data: ngCart.toObject()}).success(function(data){
                    	Flash.create('success', data.message);
                    	ngCart.empty();
                    	}).error(function(error){
                    		Flash.create('danger', error.message);
                    	} );
            
        };       
        
 }])

  .service('ngCart.fulfilment.save', ['$http',  'ngCart', 'Flash', '$modal', '$timeout',
      function($http, ngCart, Flash, $modal){
	  	  
	   this.checkout = function (settings) {
                          //console.log(settings);
                         
			var modal = $modal.open({
		            //templateUrl: 'myModalRegisterPremium.html',
                            templateUrl: 'views/ngcart/save.html',
		            //controller: 'registerPremiumCtrl',
		            
		            controller :  [
		                           '$scope', '$modalInstance', 'focus' , function($scope, $modalInstance, focus) {		                        	                                                      
		                           $scope.Variables = Variables;
				                   focus('codigo_value');
				                   $scope.error=false;
				                   
		                        	$http({
                                                    method: 'GET',
                                                    url: Variables.ApiUrl + '/users/client_type_premium/'
                                                    //data: { applicationId: 3 }
                                                }).success(function (result) {
                                                $scope.tipoRes = result;
                                            });
			                        			                      
			                        
			                   	$http({
                                                    method: 'GET',
                                                    url: Variables.ApiUrl + '/users/client_zone_premium/'
                                                   // data: { zone: '' }
                                                     }).success(function (result) {
                                                     $scope.zoneRes = result;
			                   		    
			                   		 });
		                        	   
		                        	   
                                                    $scope.focusIn = function (){
                                                     $scope.error=false;
                                                    }; 

		                        	   $scope.focusOut = function(val) {
		                        		   var focusInputElem = document.getElementById('codigo_value');
		                        		   //console.log((user));
		                        		   if(!validarRIF(focusInputElem.value)) {
		                        				$scope.error = true; 
		                        				focusInputElem.focus();
		                        				return;
		                        			}else{		                        				
		                        				$scope.error = false; 
		                        				$scope.$broadcast('angucomplete-alt:changeInput', 'codigo', focusInputElem.value);
		                        				$http.get(Variables.ApiUrl + '/users/nombre_rif/?rif='+focusInputElem.value ) .success(function(data){
		                        				//$http.get('http://contribuyente.seniat.gob.ve/getContribuyente/getrif?rif='+focusInputElem.value ) .success(function(data){
		                        				//console.log(data);
		                        					if(val === undefined){
		                        					$scope.error = true; 	
		                        					$scope.user = {
				 		                        			   originalObject : {
				 		                        				   nombre: data.nombre,
				 		                        				   custom: true
				 		                        			   }				 		                        		        				 		                        		        
				 		                        		      };
				 		                        	$scope.error = false; 
		                        					focus('phone');
                                                                                }
                                                                                
			                        			});
			                        			
		                        			}
		                        		   
		                        		    };
		                        	   
		                        	 
		                        	   
		                               //$scope.data = data;
		                        	   $scope.registerPremium = function(user){
		                        		   
		                        		   var codigo = "";
		                        		   var codigo_nuevo = document.getElementById('codigo_value').value;
		                        			//console.log(user.originalObject.codigo);
		                        			if(user.originalObject.codigo === undefined)
		                        				codigo= codigo_nuevo;
		                        			else
		                        				codigo= user.originalObject.codigo;
		                        			
		                        			//if(nombre === undefined || nombre === '')
		                        				//nombre= user.originalObject.nombre;
		                        			
		                        			// guarda usuario nuevo o actualiza
		                        			
		                        		$http.post(Variables.ApiUrl + '/users/client_premium/',
		                                            { name:user.originalObject.nombre,user:codigo,type:user.originalObject.tipo, direction:user.originalObject.direccion, phone:user.originalObject.telefonos, zone:user.originalObject.zona})
		                        			.success(function(){
		                        					 	 
		                        					//Flash.create('success', data.message);
		                        					//guarda en espera
		                        					
		                        					$http.post(settings.url,
                                                                                { data: ngCart.toObject(), options: settings.options, codClient: codigo, name: user.originalObject.nombre, zone: user.originalObject.zona }).success(function(data){
				                                            	Flash.create('success', data.message);
				                                            	//$timeout( $modalInstance.dismiss() , 2000);
				                                            	$modalInstance.dismiss();
				                                            	ngCart.empty();				                                            	
				                                            	}).error(function(error){
				                                            		Flash.create('danger', error.message, 0);
				                                            	} );
		                        	    		
		                        	    	    }).error(function(error){
		                        	    	    	Flash.create('danger', error.message);
		                        	                //$location.path("/")
		                        	            });
		                        			 
		                        			
		                        			//guarda en espera por defecto
		                        			/*
		                        			return $http.post(settings.url,
		                                            { data: ngCart.toObject(), options: settings.options, codClient: 'V1', name: '', sector: '02' }).success(function(data){
		                                            	Flash.create('success', data.message);
		                                            	ngCart.empty();
		                                            	}).error(function(error){
		                                            		Flash.create('danger', error.message, 0);
		                                            	} );
		                                            	*/
		                        	   };
		                               $scope.closeModal = function() {
		                                   $modalInstance.dismiss();
		                               };
		                           }
		                       ],
		            
		            //windowClass: 'app-modal-window',
		            //backdrop: 'static',
		           size: 'md',
		            
	                resolve: {
	                    item: function () {
	                    	//console.log(ngCart.toObject());
	                        return settings;
	                    	//return $scope.client;
	                    }
	                }

		           });
			  			  

		     return modal;
		       
		  };
		  
	  
        this.checkout2 = function(settings){
        	
        	return $http.post(settings.url,
                    { data: ngCart.toObject(), options: settings.options}).success(function(data){
                    	Flash.create('success', data.message);
                    	ngCart.empty();
                    	}).error(function(error){
                    		Flash.create('danger', error.message, 0);
                    	} );
                    	
            
        } ;      
        
 }])

 .service('ngCart.fulfilment.exist', ['$http', 'ngCart', 'Flash', function($http, ngCart, Flash){

        this.checkout = function(settings){
        //var result ='';
        var cart = ngCart.getCart();
        	angular.forEach(cart.items, function (item, index) {
            	//item.setData({precio1:item.getPrice()});
        		//if(settings.item_id == item.getData().codigo){
        	 item.getData().existencia = item.getQuantity();
        		//item.getData().meses_modificacion =1;
            	//Flash.create('success', 'ngCart:change',0);
           
            
        	return $http.post(settings.url,
                    { data: ngCart.toObject(), options: settings.options}).success(function(data){
                    	//Flash.create('success', data.message, 1000);
                    	//result= data.message;
                    	//ngCart.item.setPrice(data.price);                                            
                    	}).error(function(error){
                    		//Flash.create('danger', error.message);
                    		//result= data.message;
                    	} );       
        	//}
        });
       Flash.create('success', 'Existencia actualizada...', 1000);
        	
        };       
        
 }])
 
 
 .service('ngCart.fulfilment.price', ['$http', 'ngCart', 'Flash', function($http, ngCart, Flash){

        this.checkout = function(settings){
        
        var cart = ngCart.getCart();
        	angular.forEach(cart.items, function (item, index) {
            	//item.setData({precio1:item.getPrice()});
        		if(settings.item_id === item.getData().codigo){
        		item.getData().precio1=item.getPrice();
        		item.getData().meses_modificacion =1;
            	//Flash.create('success', 'ngCart:change',0);
           
            
        	return $http.post(settings.url,
                    { item: item, options: settings.options}).success(function(data){
                    	Flash.create('success', data.message, 1000);
                    	//ngCart.item.setPrice(data.price);                                            
                    	}).error(function(error){
                    		Flash.create('danger', error.message);
                    	} );       
        	}
        });
        } ;      
        
 }])
 
 .service('ngCart.fulfilment.inquire', ['$http', 'ngCart', 'Flash', 'prompt', 'authUsers', '$location', 'mainInfo', function($http, ngCart, Flash, prompt, authUsers, $location, mainInfo){
	this.checkout = function(settings){
		prompt({
			    title: 'Solicitar presupuesto',
			    message: 'Esta seguro que desea solicitar el presupuesto?'
			  }).then(function(){
			    //he hit ok and not cancel
                           //console.log(ngCart);
                           if(!authUsers.isLoggedIn()) {$location.path('/login'); return;}
                           
                    $http.post(settings.url,
                    { data: ngCart.toObject(), options: settings.options }).success(function(data){
                    Flash.create('success', data.message,0);
                    //$timeout( $modalInstance.dismiss() , 2000);
                    //console.log(data);
                    //$modalInstance.dismiss();
                    ngCart.empty();	
                    
                    }).error(function(error){
                        //console.log(error);
                            Flash.create('danger', error.message, 0);
                    });
		//console.log('ok');
            });
	};

}])
 
.service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function($http, ngCart){


}]);
