const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017/?maxPoolSize=20';

let conn; 
const client = new MongoClient(uri);

module.exports = {
    getMongoConnection: async() => {
        return await client.connect();
    },
    getMongoDatabase: (client, db) => {
        const DB = db || process.env.DATABASE || 'lsa_leaderboard';
        return client.db(DB);
    }
};