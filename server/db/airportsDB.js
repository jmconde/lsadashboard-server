async function getAirport(icao) {
    const client = require('./db')();
    try {
        await client.connect();
        const db = client.db('lab');
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
    const client = require('./db')();
    try {
        const lastUpdated = new Date().getTime();
        await client.connect();
        const db = client.db('lab');
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