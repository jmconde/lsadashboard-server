const { MongoClient } = require('mongodb');
const {
    LSA_MONGO_HOST,
    LSA_MONGO_PORT,
    LSA_MONGO_USER,
    LSA_MONGO_PASS,
} = process.env;
const uri = `mongodb://${LSA_MONGO_USER}:${LSA_MONGO_PASS}@${LSA_MONGO_HOST}:${LSA_MONGO_PORT}/?maxPoolSize=20`;

let conn; 

module.exports = {
    getMongoConnection: async() => {
        const client = new MongoClient(uri);
        return await client.connect();
    },
    getMongoDatabase: (client, db) => {
        const DB = db || process.env.LSA_MONGO_DB || 'lsa_leaderboard';
        return client.db(DB);
    }
};