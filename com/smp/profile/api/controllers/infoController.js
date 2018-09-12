const client = require('../models/profileModel');

exports.getAddressInfo = function(req, res){
	var partyId = req.params.partyId;
	var query=`SELECT "addressId", "Address1", "Address2", city, state, country, "postalCode", type
									FROM public.address WHERE "partyId" = \'${partyId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json(response.rows);
		}
	});
}

exports.getPhoneInfo = function(req, res){
	var partyId = req.params.partyId;
	var query=`SELECT id, "phoneNo", "countryCode", type, preference
									FROM public.phone WHERE "partyId" = \'${partyId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json(response.rows);
		}
	});
}

exports.getEmailInfo = function(req, res){
	var partyId = req.params.partyId;
	var query=`SELECT id, "emailId", type, preference
									FROM public.email WHERE "partyId" = \'${partyId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json(response.rows);
		}
	});
}

exports.postAddressInfo = function(req, res){
	var partyId = req.params.partyId;
	var addressInfo = req.body.addressInfo;
	var query = `INSERT INTO public.address(
					"partyId", "Address1", "Address2", city, state, country, "postalCode", type)
					VALUES (\'${partyId}\', \'${addressInfo.Address1}\', \'${addressInfo.Address2}\', \'${addressInfo.city}\', \'${addressInfo.state}\', \'${addressInfo.country}\', \'${addressInfo.postalCode}\', \'${addressInfo.type}\') RETURNING *`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'addressId': response.rows[0]['addressId']});
		}
	});
}

exports.postPhoneInfo = function(req, res){
	var partyId = req.params.partyId;
	var phoneInfo = req.body.phoneInfo;
	var query = `INSERT INTO public.phone(
					"partyId", "phoneNo", "countryCode", type, preference)
					VALUES (\'${partyId}\', \'${phoneInfo.phoneNo}\', \'${phoneInfo.countryCode}\', \'${phoneInfo.type}\', \'${phoneInfo.preference}\') RETURNING *`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'id': response.rows[0]['id']});
		}
	});
}

exports.postEmailInfo = function(req, res){
	var partyId = req.params.partyId;
	var emailInfo = req.body.emailInfo;
	var query = `INSERT INTO public.email(
					"partyId", "emailId", type, preference)
					VALUES (\'${partyId}\', \'${emailInfo.emailId}\', \'${emailInfo.type}\', \'${emailInfo.preference}\') RETURNING *`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'id': response.rows[0]['id']});
		}
	});
}

exports.deleteAddressInfo = function(req, res){
	var addressId = req.params.addressId;
	var query = `DELETE FROM public.address
						WHERE "addressId" = \'${addressId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'messageCode': 200});
		}
	});
}

exports.deletePhoneInfo = function(req, res){
	var id = req.params.id;
	var query = `DELETE FROM public.phone
						WHERE "id" = \'${id}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'messageCode': 200});
		}
	});
}

exports.deleteEmailInfo = function(req, res){
	var id = req.params.id;
	var query = `DELETE FROM public.email
						WHERE "id" = \'${id}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'messageCode': 200});
		}
	});
}

exports.updateAddressInfo = function(req, res){
	var addressInfo = req.body.addressInfo;
	var query = `UPDATE public.address
					SET "Address1"=\'${addressInfo.Address1}\', "Address2"=\'${addressInfo.Address2}\', city=\'${addressInfo.city}\', state=\'${addressInfo.state}\', country=\'${addressInfo.country}\', "postalCode"=\'${addressInfo.postalCode}\', type=\'${addressInfo.type}\'
					WHERE "addressId" = \'${addressInfo.addressId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json({'messageCode': 200});
		}
	});
}