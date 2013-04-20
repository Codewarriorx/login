Users = new Meteor.Collection('users');
LoggedIn = new Meteor.Collection('loggedIn');

if(Meteor.isServer && Users.find().count() == 0){
	Users.insert({ username: 'mike', password: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3' });
}

Meteor.methods({
	registerUser: function(credentials){
		if(credentials.username == ""){
			throw new Meteor.Error(413, "Missing username!");
		}
		if(credentials.password == ""){
			throw new Meteor.Error(413, "Missing password!");
		}

		var encryptedPw = CryptoJS.SHA1(credentials.password);
		Users.insert({username: credentials.username, password: encryptedPw.toString()});
		console.log('Registering user ' + credentials.username);
		
		return true;
	},
	isUser: function(credentials){
		if(credentials.username == ""){
			throw new Meteor.Error(413, "Missing username!");
		}
		if(credentials.password == ""){
			throw new Meteor.Error(413, "Missing password!");
		}
		
		var cursor = Users.find({username: credentials.username});
		if(cursor.count() > 0){
			data = cursor.fetch();
			
			// if(data[0].password == encryptedPw){
			// 	console.log('Logging in user ' + credentials.username);
				return true;
			// }
		}
		return false;
	},
	login: function(credentials){
		Meteor.call('isUser', credentials, function(e, result){
			if(result){
				var encryptedPw = CryptoJS.SHA1(credentials.password);
				var cursor = Users.find({username: credentials.username});
				if(cursor.count() > 0){
					data = cursor.fetch();
					
					if(data[0].password == encryptedPw){
						console.log('Logging in user ' + credentials.username);
						var token;
						Meteor.call('genToken', credentials.username, function(e, result){
							token = result;
						});
						return token;
					}
					else{
						return false;
					}
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		});
	},
	getIP: function(client){
		console.log(client);
		clientIP = get_http_remote_ip(this);
		console.log(clientIP);
	},
	genToken: function(string){
		var chars = string.split('');
		var convertedString = '';
		var date = new Date();
		var time = date.getTime();
		_.each(chars, function(aChar){
			Meteor.call('decToHex', aChar.charCodeAt(), function(e, result){
				convertedString += result;
			});
		});
		var firstBit = convertedString + time.toString(18);
		var checksum = CryptoJS.SHA1(firstBit);
		return checksum + firstBit;
	},
	checkToken: function(token){
		var checksum = token.substr(0, 40);
		var firstBit = token.substr(40, token.length);

		if(checksum == CryptoJS.SHA1(firstBit)){ // does the checksum
			return true;
		}
		else{
			return false;
		}
	},
	decToHex: function(dec){
		return dec.toString(16);
	},
	hexToDec: function(hex){
		return parseInt(hex,16);
	}
});

/*Meteor.publish('test_subscription', function() {
  var client = get_http_remote_ip(this);
    console.log('Client', client);
});*/