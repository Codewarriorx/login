/* 			Methods			*/
Meteor.methods({
	setError: function(error, value){
		// set error and add to the error object
		var errors = Session.get('error');
		errors[error] = value;
		Session.set('error', errors);
	},
	logUserIn: function(credentials){
		
	},
	isLoggedIn: function(token){

	},
	setSessions: function(token, username){
		var credentials = {
			token: token,
			username: username
		};

		Session.set('credentials', credentials);
		localStorage.credentials = credentials;
	}
});