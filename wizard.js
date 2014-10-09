/*
* Wizard.JS Jquery Plugin
* Author: Gabriele M. Nunez (thecoconutcoder.com) (http://github.com/GabrieleNunez)
* For example usage see https://github.com/GabrieleNunez/WizardJS
* Summary: Wizard.JS makes interfaceing and making customizable and flexible Wizard Dialogs a breeze!
* Events:
*    - wizard.error 
*			- function(errors){
*				...your error handling code here
*			}
*	 - wizard.requestSuccess
*	 		- function(data){
*				...on successful ajax request code here
*	 		}
*	 - wizard.requestError
*	 		- function(data){
*				....on failed ajax request code here
*	 		}
*
* Optional Callbacks:
*     - validate
*			- function(pageIndex){
*				....your validation code here
*			}
*	  - serialize
*	  		- function(wizard){
*	  			....a serialized array of values ready to be sent through ajax
*	  		}
*
*/

$.__wizardErrors = [];

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
$.wizardError = function(error){
	$.__wizardErrors.push(error);
}
$.wizardErrorRange = function(errors){
	$.__wizardErrors.concat(errors);
}
$.wizardErrorCount = function(){
	return $.__wizardErrors.length;
}

$.wizardHasErrors = function(){
	//force a true or false
	return $.__wizardErrors.length ? true : false;
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
	console.log(index);
	//check to see if an index was found
	
	if(index !== false){
		$(finishButton).hide();
		$(prevButton).show();
		$(nextButton).show();

		//now see if we are on the last page
		if((index === (pageCount - 1))){
			//show finish button
			$(nextButton).hide();
			$(prevButton).show();
			$(finishButton).show();
		}
		//and see if we are on the first page
		else if(index === 0){
			$(prevButton).hide();
		}
		
		var result  = null;

		//see if we are going back
		//if we are we skip validation
		//clear errors
		while($.__wizardErrors.length > 0){
			$.__wizardErrors.pop();
		}
		if(goingBack){
			result = true;
		}else{
			result = validateCall(index);
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

			var errors = $.__wizardErrors;
			
			index--;
			console.log(index);
			if(index === 0){
				$(prevButton).hide();
			}
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

	//get our options and set as needed
	var options = options;
	if(options == undefined || options == null){
		options = $.wizardDefault();
	}
	

	//get our callbacks and set defaults if needed
	var callbacks = callbacks;
	if(callbacks == undefined || callbacks == null){
		callbacks = {
			validate: function(){ return true;},
			serialize: function(e){
				return $(e).serialize();
			}
		}
	}
	if(callbacks.validate == undefined)
		callbacks.validate = function(){};
	if(callbacks.serialize == undefined)
		callbacks.serialize = function(e){ return $(e).serialize(); };


	var wizard = options.wizard;

	//initial button showing
	$(wizard + " .controls .finish-button").hide();
	$(wizard + " .controls .next-button").show();
	$(wizard + " .controls .prev-button").hide();

	
	//hook into the finish button click
	$(wizard + " .controls .finish-button").on("click",function(e){
		e.preventDefault();
		$.ajax({
				url: options.url,
				method: options.method,
				dataType: options.dataType,
				data: callbacks.serialize(options.wizard),
				success: function(data){
					$(wizard).trigger("wizard.requestSuccess",data);
				},
				error: function(data){
					$(wizard).trigger("wizard.requestError",data);
				}
			});
		return false;
	});
	//hook into the next button
	$(wizard + " .controls .next-button").on("click",function(e){
		e.preventDefault();
		var currentIndex = $.__wizardCurrentPageIndex(wizard);
		$.__wizardStep(options.wizard,callbacks.validate,++currentIndex);
		return false;
	});

	//hook into the prev button
	$(wizard + " .controls .prev-button").on("click",function(e){
		e.preventDefault();
		var currentIndex = $.__wizardCurrentPageIndex(wizard);
		$.__wizardStep(options.wizard,callbacks.validate,--currentIndex);
		return false;
	});
}