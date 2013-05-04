Users = new Meteor.Collection('users');
LoggedIn = new Meteor.Collection('loggedIn');
MainChat = new Meteor.Collection('mainMessages');
Challenges = new Meteor.Collection('challenges');

if(Meteor.isServer && MainChat.find().count() == 0){
	MainChat.insert({ username: 'Dan', message: 'hello', timestamp: '1366945305275' });
	MainChat.insert({ username: 'Bob', message: 'hi', timestamp: '1366945394241' });
}

if(Meteor.isServer && Users.find().count() == 0){
	Users.insert({ username: 'mike', password: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3' });
}

Meteor.setInterval(function(){ // this cleans out logged in users every 2 minutes for now
	console.log('Checking for inactive users');
	var users = LoggedIn.find({}).fetch();

	_.each(users, function(user){
		var time = Meteor.call('getTimeFromToken', user.token);
		var diff = Date.now() - time;
		var seconds = diff / 1000;

		if(seconds > 100){ // have they been inactive for 10 minutes?
			LoggedIn.remove(user._id);
		}
	});
}, 60000);

Meteor.methods({
	checkLogin: function(credentials){
		console.log('function: checkLogin');
		
		credentials = JSON.parse(credentials);
		var record = LoggedIn.find({token: credentials.token});

		if(record.count() > 0){
			return true;
		}
		else{
			return false;
		}
	},
	login: function(credentials){
		console.log('function: login');
		if(Meteor.call('isUser', credentials)){ // was the credentials valid?
			var cursor = Users.find({username: credentials.username});
			data = cursor.fetch();

			var encryptedPw = CryptoJS.SHA1(credentials.password);
			if(data[0].password == encryptedPw){ // does the password match the one in the db?
				console.log('Logging in user ' + credentials.username);
				var token;
				Meteor.call('genToken', credentials.username, data[0]._id, function(e, result){
					token = result;
				});

				LoggedIn.insert({ name: credentials.username, token: token });
				return token;
			}
			else{
				return false;
			}
		}
		else{ // credentials are incorrect
			throw new Meteor.Error(413, "Incorrect Credentials");
			return false;
		}
	},
	logout: function(credentials){
		console.log('function: logout');
		credentials = JSON.parse(credentials);
		if(Meteor.call('isUser', credentials)){ // was the credentials valid?
			LoggedIn.remove({token: credentials.token});
		}
	},
	registerUser: function(details){ // details.username/password/password2
		console.log('function: registerUser');
		if(details.username == '' || details.password == '' || details.password2 == ''){
			throw new Meteor.Error(401, "Please fill all fields");
		}
		else if(details.password != details.password2){
			throw new Meteor.Error(402, "Passwords do not match");
		}
		else{
			// passed all intial tests, check if username is unique
			var cursor = Users.find({username: details.username});
			if(cursor.count() > 0){
				throw new Meteor.Error(403, "Username is not unique, try a different name");
			}
			else{ // its all good! register
				var encryptedPw = CryptoJS.SHA1(details.password);
				Users.insert({username: details.username, password: encryptedPw.toString()});
				console.log('Registering user ' + details.username);
				
				return true;
			}
		}
	},
	isUser: function(credentials){
		console.log('function: isUser');
		if(credentials.username == "" || credentials.password == ""){
			return false;
		}
		else{
			var cursor = Users.find({username: credentials.username});
			if(cursor.count() > 0){
				return true;
			}
			return false;
		}
	},
	getIP: function(client){
		console.log(client);
		clientIP = get_http_remote_ip(this);
		console.log(clientIP);
	},
	genToken: function(string, id){
		var chars = string.split('');
		var convertedString = '';
		var time = Date.now();
		_.each(chars, function(aChar){
			Meteor.call('decToHex', aChar.charCodeAt(), function(e, result){
				convertedString += result;
			});
		});
		var firstBit = convertedString + id + time.toString(18);
		var checksum = CryptoJS.SHA1(firstBit);
		return checksum + firstBit;
	},
	checkToken: function(token){
		var checksum = token.substr(0, 40);
		var firstBit = token.substr(40, token.length);

		if(checksum == CryptoJS.SHA1(firstBit)){ // does the checksum
			console.log('checksum matches');
			return true;
		}
		else{
			return false;
		}
	},
	getTimeFromToken: function(token){
		var firstBit = token.substr(40, token.length);
		var timestamp = firstBit.substr(firstBit.length-10, 10);
		var time = parseInt(timestamp, 18).toString();
		console.log(time);
		return time;
	},
	getIdFromToken: function(token){
		var firstBit = token.substr(40, token.length);
		var id = firstBit.substr(firstBit.length-27, 17);
		return id;
	},
	decToHex: function(dec){
		return dec.toString(16);
	},
	hexToDec: function(hex){
		return parseInt(hex,16);
	}
});

Meteor.publish('loggedIn', function(){
	var records = LoggedIn.find({}, {fields: {name:1}});
	return records;
});

Meteor.publish('mainMessages', function(){
	var records = MainChat.find({});
	return records;
});

Meteor.publish('challenges', function(){
	var records = Challenges.find({});
	return records;
});