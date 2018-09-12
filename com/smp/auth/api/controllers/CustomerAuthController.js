const client = require('../models/CustomerAuthModel');

const md5 = require('md5');

exports.doSignUp = function(req, res){
	var md5_pass = md5(req.body.password);
	var query=`INSERT INTO public.party(type, password, username)
								VALUES (\'002\', \'${md5_pass}\', \'${req.body.username}\') RETURNING *`;
	client.query(query, (err, response)=>{
		if(err){
			console.log(err);
			
			res.json({"response_code": 500});
		}
		if(response){
			
			res.json({"response_code": 200, "userData": {partyId:response.rows[0].partyId, username:response.rows[0].username, type:response.rows[0].type}});
		}
	});
}

exports.doLogIn = function(req, res){
	var md5_pass = md5(req.body.password);
	var query = `SELECT * FROM public.party WHERE username=\'${req.body.username}\' AND password=\'${md5_pass}\' AND type=\'002\'`;
	client.query(query, (err, response)=>{
		if(err){
			console.log(err);
			
			res.json({"response_code": 500});
		}
		if(response.rows.length !== 0){
			req.session.loggedIn = true;
			
			res.json({"response_code": 200, "userData": {partyId:response.rows[0].partyId, username:response.rows[0].username, type:response.rows[0].type}});
		} else {
			
			res.json({"response_code": 500});
		}
	});
}

exports.doLogOut = function(req, res){
	delete req.session;
	
	res.json({"response_code": 200});
}