const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const moment = require('moment');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';

async function getLastFlightByPilot(pilotId) {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const flights = db.collection('flights');
        const cursor = await flights.find({ pilotId }).sort({ date: -1 }).limit(1).toArray();
        const latest = cursor.length ? cursor[0] : undefined;
        return latest;
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }

}

async function inserPilotFlight(flight) {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const flights = db.collection('flights');

        const result = await flights.insertOne(flight);

        console.log(`A flight was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }
}

module.exports = {
    getLastFlightByPilot,
    inserPilotFlight
};