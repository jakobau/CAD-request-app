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
		filteredRequests: [],
		acceptedRequests: [],
		pendingRequests: [],
		completedRequests: [],
		numTotal: null,
		numAccepted: null,
		numPending: null,
		numCompleted: null,
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
				snapshot.forEach(function(childSnapshot) {

					console.log(childSnapshot.val());

				    if(childSnapshot.val().pickupLocation == vm.userLocation) {

				    	vm.filteredRequests.push(childSnapshot.val());
				    	vm.numTotal += 1;

				    }
				});
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
			    var blob = xhr.response;
			  };
			  xhr.open('GET', url);
			  xhr.send();

			  console.log("success");

			}).catch(function(error) {
			  console.log(error);
			});
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
	}

});
