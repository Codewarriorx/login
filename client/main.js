LoggedIn = new Meteor.Collection('loggedIn');
MainChat = new Meteor.Collection('mainMessages');
Challenges = new Meteor.Collection('challenges');

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

Template.chat.rendered = function(){
	$('#mainChat').scrollTop($('.innerChat').height());
};

Template.userList.users = function(){
	return LoggedIn.find({});
};

Meteor.autorun(function(){
	if(Session.get('credentials')){
		var token = Session.get('credentials').token;
		var name = Session.get('credentials').username;
		Meteor.subscribe('challenges', token, name);
	}
	Meteor.subscribe('loggedIn');
	Meteor.subscribe('mainMessages');
});

Meteor.setInterval(function(){ // this checks to see if user is logged in
	console.log('checking if logged in on the server');
	loggedLocal();
}, 60000);