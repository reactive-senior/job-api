const client = require('../models/profileModel');

exports.getVendorProfile = async function(req, res){
	var partyId = req.params.partyId;
	var query=`SELECT "firstName", "lastName", "companyName", "preferredName", "regNo", "vatRegNo", insurance, qualifications, categories, "attatchment"
								FROM public.vendor WHERE "partyId" = \'${partyId}\'`;
	var profileResponse = await client.query(query);
	if(profileResponse.rows.length != 0)
	{
		var attId = profileResponse.rows[0]['attatchment'];
		var attQuery = `SELECT "linkName", "orgName", "attId" FROM public.vendor_attatchment WHERE "attId" = ${attId}`;
		var attResponse = await client.query(attQuery);
		var finalResponse = {
			firstName: profileResponse.rows[0]['firstName'],
			lastName: profileResponse.rows[0]['lastName'],
			companyName: profileResponse.rows[0]['companyName'],
			preferredName: profileResponse.rows[0]['preferredName'],
			regNo: profileResponse.rows[0]['regNo'],
			vatRegNo: profileResponse.rows[0]['vatRegNo'],
			insurance: profileResponse.rows[0]['insurance'],
			qualifications: profileResponse.rows[0]['qualifications'],
			categories: profileResponse.rows[0]['categories'],
			attatchment: attResponse.rows
		}
		
		res.json(finalResponse);
	} else {
		var finalResponse = {
			firstName: '',
			lastName: '',
			companyName: '',
			preferredName: '',
			regNo: '',
			vatRegNo: '',
			insurance: '',
			qualifications: '',
			categories: '',
			attatchment: []
		}
		
		res.json(finalResponse);
	}
}

exports.postVendorProfile = async function(req, res){
	var partyId = req.params.partyId;
	var vendorProfile = req.body.vendorData;
	var query_select=`SELECT "firstName", "lastName", "companyName", "preferredName", "regNo", "vatRegNo", insurance, qualifications, categories, "attatchment"
								FROM public.vendor WHERE "partyId" = \'${partyId}\'`;
	var response_select = await client.query(query_select);
	if(response_select.rows.length != 0){
		var query=`UPDATE public.vendor
					SET "firstName"=\'${vendorProfile.firstName}\', "lastName"=\'${vendorProfile.lastName}\', 
						"companyName"=\'${vendorProfile.companyData.companyName}\', 
						"preferredName"=\'${vendorProfile.companyData.preferredName}\', 
						"regNo"=\'${vendorProfile.companyData.regNumber}\', 
						"vatRegNo"=\'${vendorProfile.companyData.vatRegNumber}\', 
						insurance=\'${vendorProfile.companyData.insurance}\', 
						qualifications=\'${vendorProfile.companyData.qualifications}\', 
						categories=\'${vendorProfile.companyData.categories}\', "attatchment"=\'${vendorProfile.attatchment}\'
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
		var query = `INSERT INTO public.vendor(
						"partyId", "firstName", "lastName", "companyName", "preferredName", "regNo", "vatRegNo", insurance, qualifications, categories, "attatchment")
						VALUES (
							\'${partyId}\', \'${vendorProfile.firstName}\', \'${vendorProfile.lastName}\', \'${vendorProfile.companyData.companyName}\', 
							\'${vendorProfile.companyData.preferredName}\', \'${vendorProfile.companyData.regNumber}\', \'${vendorProfile.companyData.vatRegNumber}\',
							 \'${vendorProfile.companyData.insurance}\', \'${vendorProfile.companyData.qualifications}\', \'${vendorProfile.companyData.categories}\', \'${vendorProfile.attatchment}\')`;

		client.query(query, (err, response)=>{
			console.log(err);
			if(err){
				
				res.json({'messageCode': 400});
			}
			if(response){
				
				res.json({'messageCode': 200});
			}
		});
	}
}

exports.doUpload = function(req, res){
	var attId = 0;
	var query='SELECT * FROM public.vendor_attatchment ORDER BY id desc limit 1';
	client.query(query, (err, response)=>{
		var attatchments = [];
		if(response.rows.length !== 0){
			attId = response.rows[0].attId + 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.vendor_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		} else {
			attId = 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.vendor_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		}
	});
}