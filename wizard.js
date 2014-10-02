(function($){
	$.fn.wizard = function(options){
		var options = options;
		if(options == undefined || options == null){
			options = $.__wizardDefault();
		}		
		var pages = $(this).find(".page");
		//hide all pages if not already
		if(options.autoHide){
			$(pages).css("display","none");
		}
	}
	$.__wizardDefault = function(){
		return {
					alwaysOnTop : true,
					autoHide : true,
					postForm : true,
			   };
	}
})(jQuery);