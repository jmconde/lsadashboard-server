const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

module.exports = {
    getClient: async() => {
        const client = new MongoClient(uri);
        await client.connect();
        return client;
    },
    getDB: (client) => {
        const DB = process.env.DATABASE || 'lsa_leaderboard';
        return client.db(DB)
    }
};