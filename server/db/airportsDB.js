const { getClient, getDB } = require('./db');

async function getAirport(icao) {
    const client = await getClient();
    try {
        const db = getDB(client);
        const pilots = db.collection('airports');
        const airport = await pilots.findOne({ icao }, {});

        return airport;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function insertAirport(icao, data) {
    const client = await getClient();
    try {
        const lastUpdated = new Date().getTime();
        const db = getDB(client);
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
        await client.close();
    }
}

module.exports = { insertAirport, getAirport }