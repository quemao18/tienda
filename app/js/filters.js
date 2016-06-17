/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global app */

app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    };
});


app.filter('ucwords', function() {
	  return function(input, scope) {
	    if (input!=null)
	    	 return input.replace(/\w\S*/g, function(txt) {
                 return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
             });
	  };
});

app.filter('roundPrice', function() {
	  return function(input) {
	    if (input!==null){
	    	input=parseInt(input);
	    	if(input % 10 === 0) return input; 
	    	 	return input + (10 - (input % 10)); 
	    }	    			 
	  };
});

app.filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>');
      return $sce.trustAsHtml(text);
    };
});

app.filter('startFrom', function() {
	return function(input, start) {
	if(input) {
	start = +start; //parse to int
	return input.slice(start);
	}
	return [];
	};
	});

app.filter('trim', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});

app.filter('replaceString', function(){
	
	  return function(input, search, replace) {
		 // alert(input);
		  if (input)
			  return input.replace(search, replace);
		  }
	});

app.filter('getNameSubGroup2', function($http){
	
	  return function(subgroup) {
		 console.log(subgroup);
		  //if (subgroup){
			  $http({
				method:'GET', 
			        url: 'api/products/subgroup_name/',
			        params: {subgroup: subgroup}
			    
			    }).success(function(data){
			    	console.log(data.nombre);
			    	return data.nombre;
			    		
			    });
			  
		  	//}
		  }
	});