
$.wizardDefault = function(){
	return {
				alwaysOnTop : true,
				postForm : true,
				url : null,
				dataType : "json",
				method: "POST",
				wizard : ".wizard",
		   };
}
$.__wizardGetContainer = function(wizard){
	return $(wizard);
}
$.__wizardPageCount = function(wizard){
	return $(wizard + " .page").length;
}
$.__wizardCurrentPage = function(wizard){
	var currentStep = $(wizard + " .page.active");
	return currentStep;
}
$.__wizardCurrentPageIndex = function(wizard){
	var pageIndex = false;
	$(wizard + " .page").each(function(index,item){
		if($(item).hasClass("active")){
			pageIndex =  index;
			return false;
		}
	});
	return pageIndex;
}
$.__wizardStep = function(wizard,validateCall,pageIndex){
	
	var pageCount = $.__wizardPageCount(wizard);
	var currentStep = $.__wizardCurrentPage(wizard);
	var index = pageIndex;
	var goingBack = index < $.__wizardCurrentPageIndex(wizard);
	var finishButton =  $(wizard + " .controls .finish-button");
	var prevButton = $(wizard + " .controls .prev-button");
	var nextButton = $(wizard + " .controls .next-button");
	var nextStep = null;

	//check to see if an index was found
	
	if(index !== false){
		$(finishButton).hide();
		$(prevButton).show();
		$(nextButton).show();

		if((index === (pageCount - 1))){
			//show finish button
			$(nextButton).hide();
			$(prevButton).show();
			$(finishButton).show();
		}
		if(index === 0){
			$(prevButton).hide();
		}
		
		var result  = null;

		if(goingBack){
			result = true;
		}else{
			result = validateCall(currentStep);
		}
		if(result === true){

			$(wizard + " .page.active .errors").remove();
			$(currentStep).removeClass("hasErrors");
			$(currentStep).removeClass("active");
			nextStep  = $(wizard + " .page").get(index);
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
	if(options == undefined || options == null){
		options = $.wizardDefault();
	}
	var callbacks = callbacks;
	if(callbacks == undefined || callbacks == null){
		callbacks = {
			validate: function(){},

		}
	}
	var wizard = options.wizard;

	$(wizard + " .controls .finish-button").hide();
	$(wizard + " .controls .next-button").show();
	$(wizard + " .controls .prev-button").hide();

	var pages = $(wizard + " .page");

	//hook into the finish button click
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

	$(wizard + " .controls .next-button").on("click",function(e){
		e.preventDefault();
		var currentIndex = $.__wizardCurrentPageIndex(wizard);
		$.__wizardStep(options.wizard,callbacks.validate,++currentIndex);
		return false;
	});
	$(wizard + " .controls .prev-button").on("click",function(e){
		e.preventDefault();
		var currentIndex = $.__wizardCurrentPageIndex(wizard);
		$.__wizardStep(options.wizard,callbacks.validate,--currentIndex);
		return false;
	});
}