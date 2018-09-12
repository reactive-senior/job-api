const connection_info = require('../../../../../connection.js');

const pg = require('pg');


var client = new pg.Client(connection_info);
client.connect();

module.exports = client;