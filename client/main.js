// Users = new Meteor.Collection('users');
LoggedIn = new Meteor.Collection('loggedIn');

// do intial check if user is logged in on the server
Meteor.startup(function(){
	console.log('startup');
	loggedLocal();
});

Session.set('error', {});

Template.hello.events = {
	'click #logout': function(e, tpl){
		e.preventDefault();

		console.log('logout');

		logoutLocal();
	}
};

Template.userList.users = function(){
	return LoggedIn.find({});
};

Meteor.setInterval(function(){ // this checks to see if user is logged in
	console.log('checking if logged in on the server');
	loggedLocal();
}, 60000);

loggedLocal = function(){
	if(typeof localStorage.credentials != 'undefined'){
		Meteor.call('checkLogin', localStorage.credentials, function(err, result){
			if(result){
				var credentials = JSON.parse(localStorage.credentials);
				Meteor.call('setSessions', credentials.token, credentials.username);

				Template.hello.userName = Session.get('credentials').username;

				Template.main.loggedIn = true;
			}
			else{
				console.log('clearing localstorage');
				Meteor.call('logOutLocal');
			}
		});
	}
}

logoutLocal = function(){
	// logout on server
	Meteor.call('logout', localStorage.credentials);

	delete localStorage.credentials;
	Session.set('credentials', undefined);
}