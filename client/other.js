/*Meteor.startup(function () {
	// Session.set('client', Meteor.this);
	// Meteor.call('getIP', Meteor.client);
	
	Meteor.call('genToken', 'mike', function(e, result){
		// create login token
		console.log(result);
		Meteor.call('checkToken', result, function(e, r){});
	});
});*/


// Meteor.subscribe('test_subscription');