/* 			Methods			*/
Meteor.methods({
	setError: function(error, value){
		// set error and add to the error object
		var errors = Session.get('error');
		errors[error] = value;
		Session.set('error', errors);
	},
	setSessions: function(token, username){
		console.log('function: setSessions');
		var credentials = {
			username: username,
			token: token
		};

		Session.set('credentials', credentials);
		localStorage.setItem('credentials', JSON.stringify(credentials));
		console.log('sessions set');
	},
	clearRegErrors: function(){
		Meteor.call('setError', 'fieldsAreBlank', false);
        Meteor.call('setError', 'passwordMatch', false);
        Meteor.call('setError', 'usernameExists', false);
	}
});

loggedLocal = function(){
	console.log('function: loggedLocal');
	if(typeof localStorage.credentials != 'undefined'){
		Meteor.call('checkLogin', localStorage.credentials, function(err, result){
			if(result){
				var credentials = JSON.parse(localStorage.credentials);
				Meteor.call('setSessions', credentials.token, credentials.username);

				Template.hello.userName = Session.get('credentials').username;

				Template.main.loggedIn = true;
			}
			else{
				logoutLocal();
			}
		});
	}
};

logoutLocal = function(){
	console.log('function: logoutLocal');
	// logout on server
	Meteor.call('logout', localStorage.credentials);

	delete localStorage.credentials;
	Session.set('credentials', undefined);
	console.log('Logged out');
	Deps.flush();
};