const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const DB = process.env.DATABASE || 'lsa_leaderboard';

async function getAirport(icao) {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const pilots = db.collection('airports');
        const airport = await pilots.findOne({ icao }, {});       
        return airport;
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }
}

async function getAllAirports() {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const pilots = db.collection('airports');
        const airport = await pilots.find({}).toArray();       
        return airport;
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }
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