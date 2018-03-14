var InstanceCreationForm = (function(){

	var cacheSelectors = {
		instanceForm: $('#instanceForm'),
		errorMessage: $('#errorMessage'),
		validationFields: $('#instanceForm').find('input[type="text"], input[type="number"], input[type="email"]')
	};

	var submitFlag = true, errorMessage = '';

	function log(fname, msg){
		errorMessage += '<li><b>' + fname + '</b> ' + msg + '.</li>';
	}

	function showHideErrorMsg(){
		if(errorMessage.length > 10) {
			cacheSelectors.errorMessage.html(errorMessage).show();
		} else {
			cacheSelectors.errorMessage.html('').hide();
		}
	}

	function chechEmailAvaibility(emailId, errmsgFlag) {
		$.ajax({
	      type: "POST",
	      url: "http://54.169.92.81:8080/client/email/checkAvailability",
				dataType : 'json',
	      data: JSON.stringify({"value":emailId}),
	      success: function(data) {
	          //console.log(data);
						if(!data.successful) {
							if(errmsgFlag){
								log(emailId, 'is already registered with us');
								showHideErrorMsg();
							}
						}
	      },
				contentType: 'application/json'
		});
	}

	function validateInput(el, errmsgFlag) {
		var $this = $(el);
		var $parent = $this.parent();
		var inputValue = $this.val();
		var regexname = /^[a-zA-Z ]{2,30}$/,
			regexmobileno = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
			regexemail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

		$this.val($.trim(inputValue)); /* Triming input fields value */

		if($this.attr('required') && (inputValue == null || $this.val() == '')) { /* Required validation for all fields which has required attribute */

			submitFlag = false;

			$parent.addClass('has-error');

			if(errmsgFlag) {
				log($.trim($parent.find('label').text()), 'is required')
			}

		} else if($this.attr('data-type') == 'name' && !regexname.test(inputValue)) { /* Check for valid name */

			submitFlag = false;

			$parent.addClass('has-error');

			if(errmsgFlag) {
				log($.trim($parent.find('label').text()), 'is not valid')
			}

		} else if($this.attr('data-type') == 'mobileno' && !regexmobileno.test(inputValue)){ /* Check for valid mobile number */

			submitFlag = false;

			$parent.addClass('has-error');

			if(errmsgFlag) {
				log($.trim($parent.find('label').text()), 'is not valid')
			}

		} else if($this.attr('data-type') == 'email' && !regexemail.test(inputValue)){ /* Check for valid email */

			submitFlag = false;

			$parent.addClass('has-error');

			if(errmsgFlag) {
				log($.trim($parent.find('label').text()), 'is not valid')
			}

		} else if($parent.hasClass('has-error')) { /* Removing error from field which is/are valid */

			$parent.removeClass('has-error');

		}

		if($this.attr('data-type') == 'email' && regexemail.test(inputValue)){
			chechEmailAvaibility(inputValue, errmsgFlag);
		}

	}

	function submitForm() {
		console.log('Form submitted');
	}

	$(document).ready(function(){

		cacheSelectors.validationFields.on('blur', function(){
			validateInput($(this));
		});

	});

	return {
		validate : function(){

			errorMessage = '', submitFlag = true;

			cacheSelectors.validationFields.each(function(i, v){
				var $this = $(this);
				//var $parent = $this.parent();

				$this.val($.trim($this.val()));

				validateInput($this, true);

				/*if(inputValue == null || inputValue == '') {

					$parent.addClass('has-error');

					//errorMessage += '<li class="' + $this.attr("id") + '"><b>' + $.trim($parent.find('label').text()) + '</b> is required.</li>';
					//log($.trim($parent.find('label').text()), 'is required')

				} else if($parent.hasClass('has-error')) {
					$parent.removeClass('has-error');
				}*/

			});

			/*if(errorMessage.length > 10) {
				cacheSelectors.errorMessage.html(errorMessage).show();
			} else {
				cacheSelectors.errorMessage.html('').hide();
			}*/
			showHideErrorMsg();

			console.log(submitFlag);

			if(submitFlag) {
				submitForm();
			}

			return false;
		}
	}

})();

$(document).ready(function(){

	$('#instanceForm').submit(function(){
		return InstanceCreationForm.validate();
	});

});
