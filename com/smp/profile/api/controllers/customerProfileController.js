const client = require('../models/profileModel');

exports.getCustomerProfile = function(req, res){
	var partyId = req.params.partyId;
	var query=`SELECT "firstName", "lastName"
								FROM public.customer WHERE "partyId" = \'${partyId}\'`;
	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
		}
		if(response){
			
			res.json(response.rows[0]);
		}
	});
}

exports.postCustomerProfile = async function(req, res){
	var partyId = req.params.partyId;
	var customerProfile = req.body.customerData;
	var query_select=`SELECT "firstName", "lastName"
								FROM public.customer WHERE "partyId" = \'${partyId}\'`;
	var response_select = await client.query(query_select);
	if(response_select.rows.length != 0){
		var query=`UPDATE public.customer
					SET "firstName"=\'${customerProfile.firstName}\', "lastName"=\'${customerProfile.lastName}\',
					WHERE "partyId" = \'${partyId}\'`;
		client.query(query, (err, response)=>{
			if(err){
				
				res.json({'messageCode': 400});
			}
			if(response){
				
				res.json({'messageCode': 200});
			}
		});
	} else {
		var query = `INSERT INTO public.customer(
						"partyId", "firstName", "lastName")
						VALUES (
							\'${partyId}\', \'${customerProfile.firstName}\', \'${customerProfile.lastName}\')`;

		client.query(query, (err, response)=>{
			if(err){
				
				res.json({'messageCode': 400});
			}
			if(response){
				
				res.json({'messageCode': 200});
			}
		});
	}
}