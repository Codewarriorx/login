/* 			Templates			*/
Template.main.loggedIn = function(){
	// check if already logged in and set session
	if(typeof localStorage.username != 'undefined'){
		Session.set('userName', localStorage.username);
	}

	// check if logged in
	if(typeof Session.get('userName') != 'undefined'){
		Template.hello.userName = Session.get('userName');
		return true;
	}
	else{
		return false;
	}
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

Template.loginForm.loginFeedback = function(){
	if(Session.get('error').badCredentials){
		return 'Incorrect credentials';
	}
	return '';
};