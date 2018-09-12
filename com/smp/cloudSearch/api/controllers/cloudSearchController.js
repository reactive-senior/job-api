const search_endpoint = require('../models/cloudSearchModel');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');

exports.getCategories = function(req, res){
	var searchString = req.body.search_string;
	var encodedQuery = encodeURIComponent(searchString);
	var query = search_endpoint + `search?q=${encodedQuery}&return=category`;

	// var cloudsearch = new AWS.CloudSearch({
	// 	apiVersion: '2013-01-01',
	// 	region: 'us-east-1',
	// 	accessKeyId: 'AKIAJIRFUZQRKSKXTW3Q',
	// 	secretAccessKey: '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'
	// });
	// console.log('getting info');
	// cloudsearch.describeDomains({DomainNames: ['smpinfo']}, (err, data)=>{
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		console.log(data);
	// 		res.json({response: data});
	// 	}
	// })

	// var csd = new AWS.CloudSearchDomain({
	// 	endpoint: search_endpoint,
	// 	apiVersion: '2013-01-01',
	// 	region: 'us-east-1'
	// });
	// var params = {
	// 	query: searchString,
	// 	queryParser: 'simple',
	// 	return: 'category',
	// }
	// csd.search(params, (err, data)=>{
	// 	if(err){
	// 		console.log(err);
	// 	} else if(response) {
	// 		console.log(response);
	// 		res.json({response: response});
	// 	}
	// })

	
	var categories = [];
	fetch(query)
    	.then(res => res.json())
		.then(json => {
			json.hits.hit.every(currentHit => {categories.push(currentHit.fields.category); return true;})
			res.json({"categories": categories});
		});
}