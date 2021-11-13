const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

const getClient = async() => {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('connection stablished');
    return client;
};

const getDB = (client) => {
    const DB = 'lab'; //'' 'lsa_leaderboard';
    return client.db(DB)
};


const doyourthing = async() => {
    let client;
    try {
        client = await getClient();
        const db = getDB(client);

        const pilots = db.collection('pilots');
        const cursor = await pilots.find({}).sort({ lastUpdated: -1 }).limit(2).toArray();
        const latest = cursor[0].leaderboard;
        console.log(latest);
        for (let index = 0; index < latest.length; index++) {
            const item = latest[index];
            console.log(item.location);
        }
    } finally {
        (await client).close();
    }
}

doyourthing();