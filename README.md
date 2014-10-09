 Wizard.JS Jquery Plugin
====
 Author: Gabriele M. Nunez    
 Website: http://thecoconutcoder.com    
 Github: http://github.com/GabrieleNunez    
 
====
 
##Summary  
*Wizard.JS* makes interfacing and making customizable and flexible *Wizard Dialogs* a breeze! *Wizard.JS* aimed to be an *efficient lightweight* solution to solve the interactive dialog problem
###Events:  
* wizard.error   
	```
	function(errors){
		...your error handling code here
	}
	````
* wizard.requestSuccess    
 	```
  function(data){
		...on successful ajax request code here
 	}
 	```
* wizard.requestError   
 	```
  function(data){
		....on failed ajax request code here
 	}
 	```

###Optional Callbacks:
 * validate    
	``` 
  function(pageIndex){
		....your validation code here
	}
 ```
 * serialize
		```
    function(wizard){
			....a serialized array of values ready to be sent through ajax
		}
		```
