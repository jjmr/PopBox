var dataSrv = require('../src/DataSrv.js');
var redis_module = require('../src/node_modules/redis');
var config = require('../src/config.js');
var rc = redis_module.createClient(redis_module.DEFAULT_PORT, config.redis_server); //will be a list of servers
var provisionH = {
    "payload":"MESSAGEH",
    "priority":"H",
    "callback":"http://foo.bar",
    "qeue":[
        {"id":"1234J"},
        {"id":"4QT9J"}
    ],
    "expirationDate": Math.round((new Date()).getTime() / 1000)+10000,
    "expirationDelay": 260
};
var provisionL = {
    "payload":"MESSAGEL",
    "priority":"L",
    "callback":"http://foo.bar",
    "qeue":[
        {"id":"1234J"},
        {"id":"4QT9J"}
    ],
    "expirationDate": Math.round((new Date()).getTime() / 1000)+10000,
    "expirationDelay": 260
};
/*
dataSrv.push_transaction(provisionH, function (err, transaction_id) {
    'use strict';
    console.dir("ERRH: " + err);
    console.dir("TIDH: " + transaction_id);
    if (provisionH.expirationDate){
    console.log("TIME TIMESTAMP: "+ provisionH.expirationDate);
    }
    else{
        console.log("TIME DELAY SECONDS: "+ provisionH.expirationDelay);
    }
    //check REDIS

});
dataSrv.push_transaction(provisionL, function (err, transaction_id) {
    'use strict';
    console.dir("ERRL: " + err);
    console.dir("TIDL: " + transaction_id);
    if (provisionL.expirationDate){
        console.log("TIME TIMESTAMP: "+ provisionL.expirationDate);
    }
    else{
        console.log("TIME DELAY SECONDS: "+ provisionL.expirationDelay);
    }
    //check REDIS

});
*/
dataSrv.pop_notification({'id':'4QT9J'},5,function (err, transaction_id) {
    'use strict';
    console.dir("ERR: " + err);
    console.dir("CLEAN: " + transaction_id);
});



