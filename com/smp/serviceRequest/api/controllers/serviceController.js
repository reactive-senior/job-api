const client = require('../models/serviceModel');
const uuidv4 = require('uuid/v4');

exports.saveServiceRequest = function(req, res){
	var servicerequestkey = uuidv4();
	var customerId = req.body['customerID'];
	var servicetitle = req.body['serviceTitle'];
	var categories = req.body['categories'];
	var startdate = req.body['startDate'];
	var enddate = '9999-12-31';
	var state = 'OPEN';
	var zipcode = req.body['zipcode'];
	var categoriesString = '';
	categories.every((currentValue, index) => {categoriesString += currentValue; if(index != categories.length - 1) categoriesString += ' | '; return true;});


	var query = `INSERT INTO public.servicerequest(servicerequestkey, "customerId", servicetitle, category, status, zipcode, startdate, enddate)
		VALUES (\'${servicerequestkey}\', \'${customerId}\', \'${servicetitle}\', \'${categoriesString}\', \'${state}\', \'${zipcode}\', \'${startdate}\', \'${enddate}\')`;
	client.query(query, (err, response)=>{
		if(err) {
			console.log(err);
			
			res.json({"response_code": 500});
		}
		if(response){
			
			res.json({"response_code": 200, "servicerequestkey": servicerequestkey});
		}
	});
}

exports.getServiceRequest = function(req, res){
	var servicerequestkey = req.body.servicerequestkey;
	var query = `SELECT servicetitle, category, status, zipcode, startdate
					FROM public.servicerequest WHERE servicerequestkey = \'${servicerequestkey}\'`;

	client.query(query, (err, response)=>{
		if(response.rows.length != 0){
			
			res.json({"response_code": 200, "service_info": response.rows[0]});
		} else
		{
			
			res.json({"response_code": 500});
		}
		
	});
}

exports.getServiceByCustomerId = function(req, res){
	var customerId = req.body.customerId;
	var query = `SELECT servicerequestkey, "customerId", servicetitle, requestdescription, category, "addressId", status, totalcost, notes, zipcode, startdate, enddate, attatchment
						FROM public.servicerequest WHERE "customerId" = \'${customerId}\';`;
	client.query(query, (err, response)=>{
		if(response.rows.length != 0){
			res.json({"response_code": 200, "serviceRequest": response.rows});
		} else
		{
			res.json({"response_code": 500});
		}	
	});
}

exports.doUpload = function(req, res){
	var attId = 0;
	var query='SELECT * FROM public.customer_attatchment ORDER BY id desc limit 1';
	client.query(query, (err, response)=>{
		if(err){
			console.log(err);
			
			res.json({"response_code":500});
		}
		var attatchments = [];
		if(response.rows.length !== 0){
			attId = response.rows[0].attId + 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.customer_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		} else {
			attId = 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.customer_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		}
	});
}

exports.updateServiceInfo = function(req, res){
	var servicerequestkey = req.body.servicerequestkey;
	var update_info = req.body.update_info;
	var query = `UPDATE public.servicerequest
						SET requestdescription=\'${update_info.requestdescription}\', "addressId"=\'${update_info.addressId}\', attatchment=\'${update_info.attatchment}\'
						WHERE servicerequestkey = \'${servicerequestkey}\';`;

	client.query(query, (err, response)=>{
		if(err){
			
			console.log(err);
			res.json({"response_code":500});
		}
		if(response){
			
			res.json({"response_code":200});
		}
	});
}