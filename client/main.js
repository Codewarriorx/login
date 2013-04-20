Users = new Meteor.Collection('users');
// LoggedIn = new Meteor.Collection('loggedIn');

Session.set('error', {});

Template.hello.events = {
	'click #logout': function(e, tpl){
		e.preventDefault();

		console.log('logout');

		delete localStorage.username;
		Session.set('userName', undefined);
	}
}
