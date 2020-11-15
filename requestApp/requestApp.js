/*
* Request App JS
* Version 1.0
*/

var app = new Vue({

  	el: '#app',

  	data: {
    	requestID: '',
    	errors: [],
	    emailAddress: null,
	    requesterName: null,
	    pickupLocation: null,
	    tool: null,
	    docpicker: null,
	    comment: null,
	    timestamp: null,
  	},

  	methods: {

  		request: function(e) {
  			
  			var uploadBool = false;

  			//get form data
  			this.emailAddress = emailAddress.value;
  			this.requesterName = requesterName.value;
  			this.pickupLocation = pickupLocation.value;
  			this.tool = tool.value;
  			this.comment = comment.value;
  			this.timestamp = Date.now();

	      	if (this.emailAddress && this.requesterName && 
	      		this.pickupLocation && this.docpicker) {
	        	uploadBool = true;
	      	}

	      	this.errors = [];

	      	if (!this.emailAddress) {
	      	  	this.errors.push('Email required.');
	      	}
	      	if (!this.requesterName) {
	        	this.errors.push('Name required.');
	      	}
	      	if (!this.pickupLocation) {
	        	this.errors.push('Pick up location required.');
	      	}
	      	if (!this.docpicker) {
	        	this.errors.push('File required.');
	      	}

			e.preventDefault();

			if(uploadBool) {
				console.log("request");
				//create unique id
	  			var id = Math.random().toString(36).substr(2, 6);
	  			this.requestID = id;

	  			//send to firebase
	  			database.ref('requests/' + this.requestID).set({
				    name : this.requesterName,
				    email : this.emailAddress,
				    pickupLocation : this.pickupLocation,
				    tool : this.tool,
				    fileName : this.docpicker.name,
				    comment : this.comment,
				    timestamp : this.timestamp,
				    status : 'toReview',
				    id : this.requestID
				});

				//create reference and upload file
				var tempFileName = this.requestID + "#" + this.docpicker.name
				var storage = databaseStorage.ref(tempFileName);
	      		var upload = storage.put(this.docpicker);

				console.log("request created in firebase", Date.now());
				
				//submit notice
				document.getElementById('request-form-div').style.display = 'none';
				document.getElementById('submit-page').style.display = 'block';
			}
	    },

	    Images_onFileChanged: function(event) {
	    	this.docpicker = event.target.files[0];
	    },

	  	makeRequestPage: function() {
	  		document.getElementById('menu').style.display = 'none';
			document.getElementById('make-request').style.display = 'block';
			document.getElementById('submit-page').style.display = 'none';
			document.getElementById('request-form-div').style.display = 'block';
	  	},

	  	menu: function() {
	  		document.getElementById('menu').style.display = 'block';
			document.getElementById('make-request').style.display = 'none';
			document.getElementById('submit-page').style.display = 'none';
	  	},

	  	reloadPage: function() {
	  		location.reload(); 
	  	},

	  	reCaptchaSubmit: function() {
	  		console.log("reCaptcha");
	  		document.getElementById("submit-button").disabled = false;
	  	}
  	}
});