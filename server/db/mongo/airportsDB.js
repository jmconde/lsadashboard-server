
const  { getJSON, setJSON } = require('../redis/redisClient');
const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';

async function getAirport(icao) {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const pilots = db.collection('airports');
        const airport = await pilots.findOne({ icao }, {});       
        return airport;
    } catch (err) {
        throw new Error('airport not found in db')
    } finally {
        await conn.close();
    }
}

async function getAllAirports() {
    let airports = await getJSON('all_mongo_airports');
    if (!airports) {
        const conn = await getMongoConnection();
        try {
            const db = conn.db(DB);
            const pilots = db.collection('airports');
            airports = await pilots.find({}).toArray();
            setJSON('all_mongo_airports', airports, { minutes: 60 * 24 });
        } catch (err) {
            console.error(err);
        } finally {
            await conn.close();
        }        
    }

    return airports;
}

async function insertAirport(icao, data) {
    const conn = await getMongoConnection();
    try {
        const lastUpdated = new Date().getTime();
        const db = conn.db(DB);
        const airports = db.collection('airports');

        const doc = {
            icao,
            lastUpdated,
            data
        };

        const result = await airports.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }
}

module.exports = { insertAirport, getAirport, getAllAirports }