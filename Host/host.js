/*
* Host App
* Version 1.0
*/

var app = new Vue({
	el: '#app',

	data: {
	},

	methods: {
		dashboardPage: function() {
			document.getElementById('login').style.display = 'none';
			document.getElementById('dashboard').style.display = 'block';
		},

		loginPage: function() {
			document.getElementById('login').style.display = 'block';
			document.getElementById('dashboard').style.display = 'none';
		}
	}

});
