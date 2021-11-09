const { getLastDailyPositions, insertDailyPositions } = require("./dailyPositionsDB");
const { getClient, getDB } = require('./db');
const { ObjectId } = require('mongodb');
const { getPilotsData } = require("../data/pilotsScraper");
const { insertLeaderboard } = require("./pilotsDB");
const moment = require('moment');


async function test() {
    try {
        const result = await getLastDailyPositions();
        console.log('result :>> ', result);
    } catch (err) {
        console.error(err);
    }
}

async function get() {
    const client = await getClient();
    try {
        const db = getDB(client);
        const pilots = db.collection('pilots');
        const p = await pilots.findOne({ _id: ObjectId('618830b93c3eb30102567451') });
        console.log('p :>> ', p.leaderboard.map(d => d.userId));
        insertDailyPositions(p.leaderboard.map(d => d.userId))
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function updateLeaderboard() {
    const client = await getClient();
    try {
        const db = getDB(client);
        const pilots = db.collection('pilots');

        const filter = { _id: latest._id };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                lastUpdated: new Date().getTime()
            },
        };
        const result = await pilots.updateOne(filter, updateDoc, options);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    } catch (err) {
        console.error(err);

    } finally {
        await client.close();
    }
}

(async function() {
    const data = await getLastDailyPositions();
    console.log('data :>> ', data);
})()

// get()