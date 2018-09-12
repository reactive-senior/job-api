const client = require('../models/UserModel');

exports.getVendors = function(req, res){
	var query='SELECT * FROM party WHERE "type" = \'001\'';
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response) {
			
			res.json(response.rows);
		}
	});
}

exports.getBuyers = function(req, res){
	var query='SELECT * FROM party WHERE "type" = \'002\'';
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json(response.rows);
		}
	});
}