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
		// alert('Challenging: '+this.name);
		var which = this;
		var challengerName = Session.get('credentials').username;

		Meteor.call('getIdFromToken', Session.get('credentials').token, function(err, challengerID){
			console.log('Challege');
			var challenge = {
				challenger: { uid: challengerID, name: challengerName },
				challengee: { uid: which.uid, name: which.name },
				timestamp: Date.now()
			};


			Challenges.insert(challenge);
			console.log(Challenges.find().fetch());
		});
	}
};

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
			
		});
	}
};