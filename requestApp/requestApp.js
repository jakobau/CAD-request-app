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
  			console.log("checkform");
	      	/*if (this.emailAddress && this.name && this.location && this.tool && this.docpicker && this.comment) {
	        	return true;
	      	}*/

		  	if (this.emailAddress && this.name) {
	        	return true;
	      	}
	      	this.errors = [];

	      	if (!this.emailAddress) {
	      	  this.errors.push('Name required.');
	      	}
	      	if (!this.name) {
	        	this.errors.push('Age required.');
	      	}

			e.preventDefault();

			console.log("request");
			//create unique id
  			var id = Math.random().toString(36).substr(2, 6);
  			this.requestID = id;

  			//get form data
  			this.emailAddress = emailAddress.value;
  			this.requesterName = requesterName.value;
  			this.pickupLocation = pickupLocation.value;
  			this.tool = tool.value;
  			this.comment = comment.value;
  			this.timestamp = Date.now();

  			//send to firebase
  			database.ref('requests/' + this.requestID).set({
			    name : this.requesterName,
			    email : this.emailAddress,
			    pickupLocation : this.pickupLocation,
			    tool : this.tool,
			    fileName : this.docpicker.name,
			    comment : this.comment,
			    timestamp : this.timestamp
			});

			//create reference and upload file
			var tempFileName = this.requestID + "#" + this.docpicker.name
			var storage = databaseStorage.ref(tempFileName);
      		var upload = storage.put(this.docpicker);
      		console.log(tempFileName);

			console.log("request created in firebase", Date.now());
			
			//submit notice
			document.getElementById('request-form-div').style.display = 'none';
			document.getElementById('submit-page').style.display = 'block';
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
	  	}
  	}
});