	;
	(function(root, factory) {
		//amd
		if (typeof define === 'function' && define.amd) {
			define(['$','dialog'], factory);
		} else {
			root.Index = factory($,Dialog);
		}
	})(this, function($,dailog) {
	    return {
	        init : function(){
	            $('#clickme').click(function(){
	            	$.alert('hello world.');
	            })
	        }
	    }
	});