const {Client} = require('pg');
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Vinay@1998",
    database: "EMPHRMS"
})

module.exports = client
 client.connect(function(err, connection) {
    // connected! (unless `err` is set)
    if(err){
        console.log('CONNECTION NOT ESTABLISHED',err);
    }
    else{
        console.log('CONNECTION IS ESTABLISHED');
    }
  });

  module.export=client