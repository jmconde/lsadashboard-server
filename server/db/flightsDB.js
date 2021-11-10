const { getClient, getDB } = require('./db');
const moment = require('moment');

async function getLastFlightByPilot(pilotId) {
    const client = await getClient();
    try {
        const db = getDB(client);
        const flights = db.collection('flights');
        const cursor = await flights.find({ pilotId }).sort({ lastUpdated: -1 }).limit(1).toArray();
        const latest = cursor.length ? cursor[0] : undefined;
        return latest;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

}

async function inserPilotFlight(flight) {
    const client = await getClient();
    try {
        const db = getDB(client);
        const flights = db.collection('flights');

        const result = await flights.insertOne(flight);

        console.log(`A flight was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    getLastFlightByPilot,
    inserPilotFlight
};