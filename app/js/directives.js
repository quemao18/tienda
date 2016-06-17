app.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length);
                }
            });
        }
    };
}]);

  app.directive('myNavbar', [ function(){
        return {
            restrict: 'E',
                    replace: true,
                    transclude: false,
                   //scope: {Variables: Variables},
            controller : 'menuCtrl',
            //scope: {},
            transclude: true,
            templateUrl: 'views/navbar/navbar.html'
        };
    }]);


app.directive('formElement', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label : "@",
            model : "="
        },
        link: function(scope, element, attrs) {
            scope.disabled = attrs.hasOwnProperty('disabled');
            scope.required = attrs.hasOwnProperty('required');
            scope.pattern = attrs.pattern || '.*';
        },
        template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" >  {{label}}</label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
      };
        
});

app.directive('focus',
		function($timeout) {
		 return {
		 scope : {
		   trigger : '@focus'
		 },
		 link : function(scope, element) {
		  scope.$watch('trigger', function(value) {
		    if (value === "true") {
		      $timeout(function() {
		       element[0].focus();
		      });
		   }
		 });
		 }
		};
		}); 

app.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});

app.directive('focus_', function($timeout, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focus, function(newValue, oldValue) {
                if (newValue) { element[0].focus(); }
            });
            element.bind("blur", function(e) {
                $timeout(function() {
                    scope.$apply(attrs.focus + "=true"); 
                }, 0);
            });
            element.bind("focus", function(e) {
                $timeout(function() {
                    scope.$apply(attrs.focus + "=true");
                }, 0);
            });
        }
      };
    });


app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    } ;     
});

app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        elem.off(attr.eventFocus);
      });
    };
  });

app.directive('allowPattern', function () {

	 return {
	        restrict: "A",
	        compile: function(tElement, tAttrs) {
	            return function(scope, element, attrs) {
	        // I handle key events
	                element.bind("keypress", function(event) {
	                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
	                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
	          
	          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
	                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
	                    	event.preventDefault();
	                        return false;
	                    }
	          
	                });
	            };
	        }
	    };
	
});

app.directive('restrict', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, iElement, iAttrs, controller) {
            scope.$watch(iAttrs.ngModel, function(value) {
                if (!value) {
                    return;
                }
                $parse(iAttrs.ngModel).assign(scope, value.toLowerCase().replace(new RegExp(iAttrs.restrict, 'g'), '').replace(/\s+/g, '-'));
            });
        }
    }
});

app.directive('capitalize', function() {
	   return {
		     require: 'ngModel',
		     link: function(scope, element, attrs, modelCtrl) {
		        var capitalize = function(inputValue) {
		           if(inputValue == undefined) inputValue = '';
		           var capitalized = inputValue.toUpperCase();
		           if(capitalized !== inputValue) {
		              modelCtrl.$setViewValue(capitalized);
		              modelCtrl.$render();
		            }         
		            return capitalized;
		         }
		         modelCtrl.$parsers.push(capitalize);
		         capitalize(scope[attrs.ngModel]);  // capitalize initial value
		     }
		   };
		});

app.directive('animateOnChange', function($animate) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
              var c = 'change-up';
              $animate.addClass(elem,c, function() {
              $animate.removeClass(elem,c);
          });
        }
      });  
  }  
});

