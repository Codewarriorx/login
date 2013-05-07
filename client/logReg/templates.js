/* 			Templates			*/
Deps.autorun(function () {
	Template.main.loggedIn = function(){
		// check if logged in
		console.log('template update');
		if(Session.get('credentials')){
			console.log('yay');
			Template.hello.userName = Session.get('credentials').username;
			return true;
		}
		else{
			console.log('nay');
			return false;
		}
	};
});

Template.challenges.challenges = function(){
	return Challenges.find();
};

Template.regForm.pwFeedback = function(){
	if(Session.get('error').passwordMatch){
		return 'Passwords do not match or are empty';
	}
	return '';
};

Template.regForm.usernameFeedback = function(){
	if(Session.get('error').usernameExists){
		return 'Username already exists';
	}
	return '';
};

Template.regForm.regFeedback = function(){
	if(Session.get('error').fieldsAreBlank){
		return 'Fields are not complete';
	}
	return '';
};

Template.loginForm.loginFeedback = function(){
	if(Session.get('error').badCredentials){
		return 'Incorrect credentials';
	}
	return '';
};

Template.chat.mainMessages = function(){
	return MainChat.find({});
};

Template.main.inGame = function(){
	// Games.find({ 'challenger.uid':  })

	return false;

};