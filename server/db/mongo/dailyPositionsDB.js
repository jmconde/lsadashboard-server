const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const moment = require('moment');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';

async function getLastDailyPositions() {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
        const dailyPositions = db.collection('dailyPositions');
        const cursor = await dailyPositions.find({}).sort({ lastUpdated: -1 }).limit(1).toArray();
        const latest = cursor[0];
        return latest;
    } catch (err) {
        console.error(err);
    } finally {
        await conn.close();
    }

}

async function insertDailyPositions(positions, date = undefined) {
    const conn = await getMongoConnection();
    try {
        const db = conn.db(DB);
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
        await conn.close();
    }
}

module.exports = {
    getLastDailyPositions,
    insertDailyPositions
};