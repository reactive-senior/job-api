const search_endpoint = require('../models/elasticSearchModel');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
   hosts: [ search_endpoint ]
});

const getKeywordsArray = function(keywordsString){
    var keywords = keywordsString.toLowerCase().replace(/[^a-zA-Z0-9]+/g, " ").split(" ");
    if(keywords[keywords.length-1] == '')
        keywords.splice(keywords.length-1, 1);
    return keywords;
}

exports.updateCategories = function(req, res){

    var categories = req.body.categories;
    var keywords = getKeywordsArray(req.body.keywords);

    client.ping({
        requestTimeout: 30000,
    }, function(error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
            res.json({response_code: 404});
        } else {
            console.log('Update function:Connected to the elasticsearch!');
            
            categories.every(async function(currentCategory){
                var response = await client.search({
                    index: 'categories',
                    type: 'keywords',
                    q: `category: ${currentCategory}`
                });
                if(response.hits.total != 0 && response){
                    var updateId = response.hits.hits[0]._id;
                    var prev_keywords = response.hits.hits[0]._source.keywords;
                    var new_keywords = [...prev_keywords];
                    keywords.every((keyword) => {
                        if(!prev_keywords.includes(keyword))
                            new_keywords.push(keyword);
                        return true;
                    });
                    var response_update = await client.update({
                        index: 'categories',
                        type: 'keywords',
                        id: updateId,
                        body: {
                            doc: {
                                category: currentCategory,
                                keywords: new_keywords
                            }
                        }
                    });
                } else if(response.hits.total == 0){

                    var response_new = await client.index({
                        index: 'categories',
                        type: 'keywords',
                        body: {
                            "category": currentCategory,
                            "keywords": keywords
                        }
                    });
                }
                return true;
            });
        }
    });
    res.json({response_code: 200});
}

exports.getCategories = function(req, res){
    var search_string = req.body.search_string;

    client.ping({
        requestTimeout: 30000,
    }, function(error) {
        if (error) {
            console.log(error);
            console.error('elasticsearch cluster is down!');
            res.json({categories: []});
        } else {
            console.log('Getfunction:Connected to the elasticsearch!');
            var categories = [];

            var search_keywords = getKeywordsArray(search_string);
            client.search({
                index: 'categories',
                type: 'keywords',
                body: {
                    query: {
                        "terms": {
                            "keywords": search_keywords
                        }
                    } 
                }
            }).then(function(resp) {
                resp.hits.hits.every((currentHit, index) => {
                    categories.push(currentHit._source.category);
                    if(index >= 1)
                        return false;
                    return true;
                })
                res.json({categories: categories});
            }, function(err) {
                console.trace(err.message);
            });
        }
    });

}




// client.index({
            //     index: 'categories',
            //     type: 'keywords',
            //     body: {
            //         "category": "work",
            //         "keywords": ["labor", "hard", "clean", "change", "cash", "budget", "help", "carry", "buy", "hire", "work", "remote", "assist", "friend", "relationship"] 
            //     }
            //     body: {
            //         "category": "love",
            //         "keywords": ["emotional", "blind", "pain", "happy", "happiness", "die", "angel", "life", "relationship"] 
            //     }
            //     body: {
            //         "category": "god",
            //         "keywords": ["immortal", "angel", "blind", "pray", "happy", "forgive", "never", "forever", "limitness"] 
            //     }
            // }, function(err, resp, status) {
            //     if(err)
            //         console.log(err);
            //     else
            //         console.log(resp);
            //     res.json({categories: ['not dummy', 'serious']});
            // });


                        // client.indices.delete({
            //     index: 'categories',
            //     ignore: [404]
            //   }).then(function (body) {
            //     // since we told the client to ignore 404 errors, the
            //     // promise is resolved even if the index does not exist
            //     console.log('index was deleted or never existed');
            //   }, function (error) {
            //     // oh no!
            //   });