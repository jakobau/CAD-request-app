/*
* Host App
* Version 1.0
*/

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    // User is signed in.
    console.log("signed in");
    document.getElementById('login').style.display = 'none';
	document.getElementById('dashboard').style.display = 'block';

  } else {

    // User is signed out.
    console.log("signed out");
    document.getElementById('login').style.display = 'block';
	document.getElementById('dashboard').style.display = 'none';

  }
});

var app = new Vue({
	el: '#app',

	data: {
		email: null,
	},

	methods: {
		login: function() {

			firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
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
		}
	}

});
