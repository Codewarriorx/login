/* 			Events			*/

Template.loginForm.events = {
	'submit': function(e, tpl){
		e.preventDefault();

		var login = {
			username: tpl.find('input[name="username"]').value,
			password: tpl.find('input[name="password"]').value
		};

		Meteor.call('login', login, function(err, result){
			if(err){
				alert('Could not login '+ err.reason);
				Meteor.call('setError', 'badCredentials', true);
			}
			else{
				if(result != false){ // is there a token?
					Meteor.call('setError', 'badCredentials', false);
					Meteor.call('setSessions', result, login.username);
				}
				else{ // bad credentials
					console.log('failed');
					Meteor.call('setError', 'badCredentials', true);
				}
			}
		});
	}
};

Template.chat.events = {
	'submit': function(e, tpl){
		e.preventDefault();

		var message = tpl.find('#message').value;

		if(message != ""){
			MainChat.insert({username: Session.get('credentials').username, message: message, timestamp: Date.now()});
			tpl.find('#message').value = '';
		}
		else{
			alert('You cannot enter an empty message.');
		}
	}
};

Template.userList.events = {
	'click a': function(e, tpl){
		e.preventDefault();

		var which = this;
		var challengerName = Session.get('credentials').username;
		var uid = Session.get('credentials').uid;

		Meteor.call('createChallenge', which, challengerName, uid, function(err, result){
			if(!err && result){
				// it was good
				alert('Challenging: '+which.name);
			}
		});
	}
};

Template.challenges.events = {
	'click a': function(e, tpl){
		e.preventDefault();
		var which = this;

		if(confirm('Are you sure you want to accept this challenge?')){
			Meteor.call('createGame', which, function(err, result){
				if(!err && result){
					// it was good
					console.log('Game created successfully');
				}
			});
		}
	}
}

Template.regForm.events = {
	'submit': function(e, tpl){
		e.preventDefault();

		// reset any existing errors
		Meteor.call('clearRegErrors');

		// get user input
		var details = {
			username: tpl.find('input[name="username"]').value,
			password: tpl.find('input[name="password"]').value.trim(),
			password2: tpl.find('input[name="password2"]').value.trim()
		}

		// get users ip address !!!!! this doesn't work
		// Meteor.call('getIP', Session.get('this'));

		// try to register
		Meteor.call('registerUser', details, function(err, result){
			if(err){
				alert(err.reason);
				switch(err.error) {
					case 401:
						Meteor.call('setError', 'fieldsAreBlank', true);
				        break;
					case 402:
				        Meteor.call('setError', 'passwordMatch', true);
				        break;
		        	case 403:
		                Meteor.call('setError', 'usernameExists', true);
		                break;
				}
				// use error code to set reg form error message
			}
			else{ // registration was successful
				alert('You have been successfully registered! Please login.');
			}
		});
	}
};