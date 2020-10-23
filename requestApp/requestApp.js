/*
* Request App JS
* Version 1.0
*/

var app = new Vue({

  	el: '#app',

  	data: {
    	requestID: '',
  	},

  	methods: {
  		request: function() {
  			//create unique id
  			var id = Math.random().toString(36).substr(2, 6);
  			this.requestID = id;

  			//get form data

  			//send to firebase
  			/*database.ref('requests/' + id).set({
			    firstName : "Jakob Au",
			    //lastName : this.lastName,
			    //phone : this.phone,
			    //products : this.products,
			    //amount : this.paymentTotal,
			    //paymentType : this.paymentMethod,
			    //paymentTitle : this.paymentTitle,
			    timestamp : Date.now(),
			    //orderVerified : false
			});*/

			console.log("request created in firebase", Date.now());
			
			//submit notice
			document.getElementById('submit-page').style.display = 'block';
			document.getElementById('request-form').style.display = 'none';

  		},

	  	makeRequestPage: function() {
	  		document.getElementById('menu').style.display = 'none';
			document.getElementById('make-request').style.display = 'block';
			document.getElementById('submit-page').style.display = 'none';
			document.getElementById('request-form').style.display = 'block';
	  	},

	  	menu: function() {
	  		document.getElementById('menu').style.display = 'block';
			document.getElementById('make-request').style.display = 'none';
			document.getElementById('submit-page').style.display = 'none';
	  	}
  	}
});