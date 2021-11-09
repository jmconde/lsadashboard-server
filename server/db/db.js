const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

console.log('process.env.DATABASE :>> ', process.env.DATABASE);

module.exports = {
    getClient: async() => {
        const client = new MongoClient(uri);
        await client.connect();
        return client;
    },
    getDB: (client) => {
        const DB = process.env.DATABASE || 'lsa_leaderboard';
        console.log(`database: ${DB}`);
        return client.db(DB)
    }
};