const { MongoClient } = require('mongodb');
const moment = require('moment');
const axios = require('axios');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

const getClient = async() => {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('connection stablished');
    return client;
};

const getDB = (client) => {
    const DB = 'lsa_leaderboard'; //'' 'lsa_leaderboard';
    return client.db(DB)
};


const doyourthing = async() => {
    let client;
    try {
        client = await getClient();
        const db = getDB(client);

        const pilots = db.collection('pilots');
        const cursor = await pilots.find({lastUpdatedDate: { $lt: moment().startOf('week').toDate() }}).sort({ lastUpdated: -1 }).limit(1).toArray();
        const lastUpdated = cursor[0]?.lastUpdatedDate;

        console.log(lastUpdated);
    } finally {
        (await client).close();
    }
}

//doyourthing()

async function  req() {
    const url = `https://crew.latinstreamingalliance.com/api/acars`;
    const response = await axios.get(url);
    return response.data;
}

async function show() {
    const r = await req();
    console.log(r);
}

show();
