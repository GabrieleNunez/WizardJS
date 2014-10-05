(function($){
	$.wizardDefault = function(){
		return {
					alwaysOnTop : true,
					postForm : true,
					dataType : "json",
					method: "POST",
					wizard : ".wizard"
			   };
	}
	$.__wizardPageCount = function(wizard){
		return $(wizard + " .page").length;
	}
	$.__wizardCurrentPage = function(wizard){
		var currentStep = $(wizard + " .page.active");
		return currenStep;
	}
	$.__wizardGetCurrentPageIndex = function(wizard){
		$(wizard + " .page").each(function(index,item){
			if($(item).hasClass("active")){
				return index;
			}
		});
		return false;
	}
	$.__wizardStep = function(wizard,validateCall,pageIndex){
		var pageCount = $.__wizardPagCount(wizard);
		var currentStep = $.__wizardCurrenPage(wizard);
		var index = $.__wizadCurrentPageIndex(wizard);
		var nextStep = null;

		//check to see if an index was found
		
		if(index !== false)
			$(wizard + " .controls .finish-button").hide();
			$(wizard + " .controls .prev-button").show();
			$(wizard + " .controls .next-button").show();
			if((index === (pageCount - 1))){
				//show finish button
				$(wizard + " .controls .next-button").hide();
				$(wizard + " .controls .finish-button").show();
			}
			if(index === 0){
				$(wizard + " .controls .prev-button").hide();
			}
			var result = validateCall(currentStep);
			if(result === true){

				$(wizard + " .page.active .errors").remove();
				$currentStep).removeClass("hasErrors");
				$(currentStep).removeClass("active");
				
				nextStep = $(currentStep).next();

				$(nextStep).addClass("active");
				$(wizard).trigger("wizard.pageInit",nextStep);
			}
			else{

				var errors = result.errors;
				$(currentStep).addClass("hasErrors");

				console.log("Errors were found");
				console.log(errors);

				//trigger wizard.error on the wizard
				//passing errors on as a parameter
				$(wizard).trigger("wizard.error",errors);
			}
		} else{
			console.log("This step does not exist");
		}
	}
	$.wizard = function(callbacks,options){
		var options = options;
		var wizard = options.wizard;

		if(options == undefined || options == null){
			options = $.wizardDefault();
		}

		var pages = $(wizard + " .page");
		$(wizard + " .controls .finish-button").on("click",function(e){
			e.preventDefault();
			$.ajax({
					url: $(wizard).attr("action"),
					method: options.method,
					dataType: options.dataType,
					data: $(wizard).serialize(),
					success: function(data){
						$(wizard).trigger("wizard.requestSuccess",data);
					},
					error: function(data){
						$(wizard).trigger("wizard.requestError",data);
					}
				});
			return false;
		});

	}
})(jQuery);