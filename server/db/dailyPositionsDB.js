const clientGen = require('./db');
const moment = require('moment');

async function getLastDailyPositions() {
    const client = clientGen();
    try {
        await client.connect();
        const db = client.db('lab');
        const dailyPositions = db.collection('dailyPositions');
        const cursor = await dailyPositions.find({}).sort({ lastUpdated: -1 }).limit(1).toArray();
        const latest = cursor[0];
        return latest;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

}

async function insertDailyPositions(positions, date = undefined) {
    const client = clientGen();
    try {
        await client.connect();
        const db = client.db('lab');
        const dailyPositions = db.collection('dailyPositions');
        const today = moment(date).utc().startOf('day');
        const doc = {
            positions,
            lastUpdated: today.toDate()
        };

        const result = await dailyPositions.insertOne(doc);

        console.log(`Some dailyPositions was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    getLastDailyPositions,
    insertDailyPositions
};