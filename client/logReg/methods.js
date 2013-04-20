/* 			Methods			*/
Meteor.methods({
	setError: function(error, value){
		// set error and add to the error object
		var errors = Session.get('error');
		errors[error] = value;
		Session.set('error', errors);
	},
	setSessions: function(token, username){
		var credentials = {
			username: username,
			token: token
		};

		Session.set('credentials', credentials);
		localStorage.credentials = JSON.stringify(credentials);
	}
});