/*
* Host App
* Version 1.0
*/

var app = new Vue({
	el: '#app',

	data: {
		//user info
		email: null,
		userId: null,
		userName: null,
		userLocation: null,

		//request data
		filteredRequests: [], //all requests
		toReviewRequests: [],
		toPrintRequests: [],
		toLocationRequests: [],
		doneRequests: [],
		numTotal: 0,
		numtoReview: 0,
		numtoPrint: 0,
		numtoLocation: 0,
		numDone: 0,
	},

	methods: {
		login: function() {

			//sign in
			firebase.auth().signInWithEmailAndPassword(email.value, password.value)
			.catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;

			  console.log(errorCode);
			  console.log(errorMessage);
			  // ...
			});

		},

		logout: function() {

			firebase.auth().signOut();

		},

		// When request data changes, automatic update page
		changeData: function(snapshot) {

			var vm = this;

			// get user location
			databaseUser.orderByChild('timestamp').once('value').then(function(snapshot) {

				snapshot.forEach(function(childSnapshot) {

				    if(childSnapshot.key == vm.userId) {

				    	vm.userLocation = childSnapshot.val().location;
				    	vm.userName = childSnapshot.val().name;
				    	console.log("get user location success");

				    } 
				});

				//error
				if(vm.userLocation == null) {
					console.log("get user location failure");
				}
			})
			// then filter requests with user location
			.then(function() {
				//reset variables
				vm.filteredRequests = [];
				vm.toReviewRequests = [];
				vm.toPrintRequests = [];
				vm.toLocationRequests = [];
				vm.doneRequests = [];

				vm.numTotal = 0;
				vm.numtoReview = 0;
				vm.numtoPrint = 0;
				vm.numtoLocation = 0;
				vm.numDone = 0;

				//if admin login
				if(vm.userLocation == "All") {
					snapshot.forEach(function(childSnapshot) {
				    	//add to all requests
				    	vm.filteredRequests.push(childSnapshot.val());
				    	vm.numTotal += 1;

				    	//add to different requests
				    	if(childSnapshot.val().status == "toReview") {
				    		vm.toReviewRequests.push(childSnapshot.val());
				    		vm.numtoReview += 1;
				    	} else if(childSnapshot.val().status == "toPrint") {
				    		vm.toPrintRequests.push(childSnapshot.val());
				    		vm.numtoPrint += 1;
				    	} else if(childSnapshot.val().status == "toLocation") {
				    		vm.toLocationRequests.push(childSnapshot.val());
				    		vm.numtoLocation += 1;
				    	} else if(childSnapshot.val().status == "done") {
				    		vm.doneRequests.push(childSnapshot.val());
				    		vm.numDone += 1;
				    	}

					});
				} else { //if host login
					snapshot.forEach(function(childSnapshot) {
						//if correct location
					    if(childSnapshot.val().pickupLocation == vm.userLocation) {

					    	//add to all requests
					    	vm.filteredRequests.push(childSnapshot.val());
					    	vm.numTotal += 1;

					    	//add to different requests
					    	if(childSnapshot.val().status == "toReview") {
					    		vm.toReviewRequests.push(childSnapshot.val());
					    		vm.numtoReview += 1;
					    	} else if(childSnapshot.val().status == "toPrint") {
					    		vm.toPrintRequests.push(childSnapshot.val());
					    		vm.numtoPrint += 1;
					    	} else if(childSnapshot.val().status == "toLocation") {
					    		vm.toLocationRequests.push(childSnapshot.val());
					    		vm.numtoLocation += 1;
					    	} else if(childSnapshot.val().status == "done") {
					    		vm.doneRequests.push(childSnapshot.val());
					    		vm.numDone += 1;
					    	}
					    }
					});
				}
			})
			// then update DOM
			.then(function() {
				vm.updateDashboard();
			});
		},

		// get user location
		getUserLocation: function() {

			var vm = this;

			// read once from firebase
			databaseUser.once('value').then(function(snapshot) {

				vm.userLocation = null;
				vm.userName = null;

				snapshot.forEach(function(childSnapshot) {

				    if(childSnapshot.key == vm.userId) {

				    	vm.userLocation = childSnapshot.val().location;
				    	vm.userName = childSnapshot.val().name;

				    } 
				});

				//error
				if(vm.userLocation == null) {
					console.log("get user location failure");
				}

				if(vm.userName == null) {
					console.log("get user name failure");
				}
			});
		},

		updateDashboard: function() {
			console.log("updateDashboard")
		},

		downloadFile: function(fileName, requestID) {
			console.log(requestID + "#" + fileName);

			databaseStorageRef.child(requestID + "#" + fileName).getDownloadURL().then(function(url) {
			  // `url` is the download URL for 'images/stars.jpg'
			  console.log("trying to download file");

			  // This can be downloaded directly:
			  var xhr = new XMLHttpRequest();
			  xhr.responseType = 'blob';
			  xhr.onload = function(event) {
			    //Create an `a` tag (since it has an `href` and a `download` attribute) 
		        var a = document.createElement('a');
		        a.href = window.URL.createObjectURL(xhr.response);
		        a.download = fileName;
		        a.style.display = 'none';
		        document.body.appendChild(a);
		        a.click();                            //Simulates a click event
		        var blob = xhr.response;
			  };
			  xhr.open('GET', url);
			  xhr.send();

			  console.log("success");

			}).catch(function(error) {
			  console.log(error);
			});
		},

		timeConverter: function(UNIX_timestamp) {
			var a = new Date(UNIX_timestamp);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			//var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
			var time = date + ' ' + month + ' ' + year;
			return time;
		},

		changeStatus: function(requestStatus, requestID) {
			var vm = this;

			if(requestStatus == "toReview") {
				console.log("toReview");

				vm.toReviewRequests.forEach(function(request, index) {
					//find request
					if(request.id == requestID) {
						//update local lists
						request.status = "toPrint";
						vm.toPrintRequests.push(request);
						vm.toReviewRequests.splice(index, 1);
						//update database
						database.ref("requests/"+requestID).update({status: "toPrint"});
					}
				});
			} else if(requestStatus == "toPrint") {
				console.log("toPrint");
				
				vm.toPrintRequests.forEach(function(request, index) {
					//find request
					if(request.id == requestID) {
						//update local lists
						request.status = "toLocation";
						vm.toLocationRequests.push(request);
						vm.toPrintRequests.splice(index, 1);
						//update database
						database.ref("requests/"+requestID).update({status: "toLocation"});
					}
				});
			} else if(requestStatus == "toLocation") {
				console.log("toLocation");

				vm.toLocationRequests.forEach(function(request, index) {
					//find request
					if(request.id == requestID) {
						//update local lists
						request.status = "done";
						vm.doneRequests.push(request);
						vm.toLocationRequests.splice(index, 1);
						//update database
						database.ref("requests/"+requestID).update({status: "done"});
					}
				});
			} else {
				console.log("done or error");
			} 
		}
	},

	beforeCreate: function () {

		var vm = this;

		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

		  	vm.userId = user.uid;

		    // User is signed in.
		    console.log("signed in");
		    document.getElementById('login').style.display = 'none';
			document.getElementById('dashboard').style.display = 'block';

		  } else {

		  	vm.userId = null;

		    // User is signed out.
		    console.log("signed out");
		    document.getElementById('login').style.display = 'block';
			document.getElementById('dashboard').style.display = 'none';

		  }
		});

		databaseRef.on("value", function(snapshot) {
		  	vm.changeData(snapshot);
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
	},

	filters: {
	    sortedItems: function() {
	        this.items.sort( ( a, b) => {
	            return new Date(a.date) - new Date(b.date);
	        });
	        return this.items;
	    }
	}

});
