/* 			Events			*/

Template.loginForm.events = {
	'submit': function(e, tpl){
		e.preventDefault();

		var login = {
			username: tpl.find('input[name="username"]').value,
			password: tpl.find('input[name="password"]').value
		};
		console.log('Hey: ');
		console.log(login);
		Meteor.call('login', login, function(e, result){
			console.log(result);
			if(result != false){
				Meteor.call('setSessions', result, login.username);
				Meteor.call('setError', 'badCredentials', false);
				console.log('good login');
			}
			else{
				// error
				if(err){
					alert('Could not login '+ err.reason);
				}
				Meteor.call('setError', 'badCredentials', true);
				console.log('bad login');
			}
			// return true;
		});
		// Meteor.call('login', login, function(e, result){});
		/*Meteor.call('logUserIn', login, function(err, result){
			if(err){
				alert('Could not login '+ err.reason);
			}

			if(!result){
				// problems were had
			}
		});



		/*Meteor.call('isUser', login, function(err, result){
			if(err){
				alert('Could not login '+ err.reason);
			}

			if(result){
				var token = '';

				Meteor.call('genToken', login.username, function(e, result){
					// create login token
					// token = result;
				});

				// log user in
				Session.set('userName', login.username);
				localStorage.username = login.username;

				Meteor.call('setError', 'badCredentials', false);
			}
			else{
				Meteor.call('setError', 'badCredentials', true);
			}
		});*/
	}
};

Template.regForm.events = {
	'submit': function(e, tpl){
		e.preventDefault();

		// get user input
		var username = tpl.find('input[name="username"]').value;
		var password = tpl.find('input[name="password"]').value.trim();
		var password2 = tpl.find('input[name="password2"]').value.trim();

		// get users ip address !!!!! this doesn't work
		// Meteor.call('getIP', Session.get('this'));

		// check username for duplicate
		var cursor = Users.find({username: username});
		if(cursor.count() > 0){ // does name exists, display error
			Meteor.call('setError', 'usernameExists', true);
		}
		else{
			Meteor.call('setError', 'usernameExists', false);

			if(password == password2 && (password != "" && password2 != "")){ // check password match and are not empty
				Meteor.call('setError', 'passwordMatch', false);

				// emter into the database since it passed both checks
				var reg = {
					username: username,
					password: password
				};

				Meteor.call('registerUser', reg, function(err, result){
					if(err){
						alert('Could not register '+ err.reason);
					}

					if(result){
						// log user in
						Session.set('userName', reg.username);
						localStorage.username = reg.username;
					}
				});
			}
			else{
				Meteor.call('setError', 'passwordMatch', true);
			}
		}
	}
};