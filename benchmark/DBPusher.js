var async = require('async');
var uuid = require('node-uuid');
var redisModule = require('redis');
var config = require('./config.js');

var pushTransaction = function(hostname, port, appPrefix, provision, callback) {
    'use strict';

    //handles a new transaction  (N ids involved)
    var priority = provision.priority + ':', //contains "H" || "L"
        queues = provision.queue,
        extTransactionId = uuid.v4(),
        transactionId = config.dbKeyTransPrefix + extTransactionId,
        dbTr = redisModule.createClient(port, hostname);



    if (!provision.expirationDate) {
        provision.expirationDate = Math.round(Date.now() / 1000) + config.defaultExpireDelay;
    }


    var meta = {};
    for (var p in provision) {

        if(provision.hasOwnProperty(p) && provision[p] !== null &&  provision[p] !== undefined && p !== 'queue') {
            meta[p] = provision[p];
        }

    }

    dbTr.hmset(transactionId + ':meta', meta, function onHmset(err) {
        if (err) {

            dbTr.end();
            callback(err, null);

        } else {

            async.forEach(queues, function(queue, asyncCallback) {

                var fullQueueId = config.db_key_queue_prefix + priority + appPrefix + queue.id;
                dbTr.rpush(fullQueueId, transactionId, function onLpushed(err) {

                    if (err) {
                        asyncCallback(err, null);
                    } else {
                        asyncCallback(null, null);
                    }

                });

                dbTr.hmset(transactionId + ':state', queue.id, 'Pending', function(err) {

                    if (err) {
                        asyncCallback(err, null);
                    } else {
                        asyncCallback(null, null);
                    }

                });

            }, function(err) {

                dbTr.end();

                if (err) {
                    callback(err, null);
                } else {
                    callback(null, extTransactionId);
                }

            });
        }
    });
};

exports.pushTransaction = pushTransaction;