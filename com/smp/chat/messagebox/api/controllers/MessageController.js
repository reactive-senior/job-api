const client = require('../models/MessageModel');


exports.getMessages = async function(req, res){
	var userId = req.params.userId;
	var myId = req.params.myId;
	var query=`SELECT * FROM public.ct_messages WHERE (sender_id = ${userId} AND receiver_id = ${myId}) OR (receiver_id = ${userId} AND sender_id = ${myId})`;
	var full_response = [];
	var messageResponse = await client.query(query);
	if(messageResponse.rows.length !== 0){
		for(var i = 0; i < messageResponse.rows.length; i++){
			var source = messageResponse.rows[i];
			var attId = messageResponse.rows[i]['attatchment'];
			var mquery=`SELECT "linkName", "orgName", "attId" FROM public.ct_attatchment WHERE "attId" = ${attId}`;
			var mres = await client.query(mquery);
			var single_response = {
				"subject": source['subject'],
				"body": source['body'],
				"messageId": source['messageId'],
				"sender_id": source['sender_id'],
				"receiver_id": source['receiver_id'],
				"sent_time": source['sent_time'],
				"attatchment": source['attatchment'],
				"attatchments": mres.rows
			}
			full_response.push(single_response);
		}
	}
	
	res.json(full_response);
}

exports.deleteMessage = function(req, res){
	var messageId = req.params.messageId;
	var query=`DELETE FROM public.ct_messages WHERE "messageId" = ${messageId}`;
	client.query(query, (err, response)=>{
		if(response)
		{
			
			res.json(response.rows);
		}	
	});
}

exports.newMessage = function(req, res){
	var query=`INSERT INTO public.ct_messages(subject, body, attatchment, sender_id, receiver_id, sent_time) VALUES (\'${req.body.subject}\', \'${req.body.body}\', \'${req.body.attatchment}\', ${req.body.senderId}, ${req.body.receiverId}, \'${req.body.sent_time}\') RETURNING *`;
	client.query(query, (err, response)=>{
		if(response){
			
			res.json(response.rows);
		}
	});
}

exports.doUpload = function(req, res){
	var attId = 0;
	var query='SELECT * FROM public.ct_attatchment ORDER BY id desc limit 1';
	client.query(query, (err, response)=>{
		var attatchments = [];
		if(response.rows.length !== 0){
			attId = response.rows[0].attId + 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.ct_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		} else {
			attId = 1;
			for(var i = 0; i < req.files.length; i++)
			{
				query = `INSERT INTO public.ct_attatchment("linkName", "orgName", "attId") VALUES (\'${req.files[i].location}\', \'${req.files[i].originalname}\', \'${attId}\')`;
				attatchments.push({"linkName": req.files[i].location, "orgName": req.files[i].originalname});
				client.query(query);
			}
			
			res.json({"attId": attId, "attatchments": attatchments});
		}
	});
}