const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

module.exports = function() {
    return new MongoClient(uri);
};