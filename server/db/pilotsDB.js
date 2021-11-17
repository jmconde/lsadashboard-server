const { getClient, getDB } = require('./db');

async function getLatests() {
    const client = await getClient();
    try {
        const db = getDB(client);
        const pilots = db.collection('pilots');
        const cursor = await pilots.find({}).sort({ lastUpdated: -1 }).limit(2).toArray();
        const latest = cursor[0];
        const previous = cursor[1];
        return { latest, previous };
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function insertLeaderboard(leaderboard) {
    const client = await getClient();
    try {
        const lastUpdatedDate = new Date();
        const lastUpdated = lastUpdatedDate.getTime();
        const db = getDB(client);
        const pilots = db.collection('pilots');

        const doc = {
            leaderboard,
            lastUpdated,
            lastUpdatedDate
        };

        const result = await pilots.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);
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

const getLastWeekLeaderboard = async () => {
    const client = await getClient();
    try {
        const db = getDB(client);
        const pilots = db.collection('pilots');

        const cursor = await pilots.find({lastUpdatedDate: { $lt: moment().startOf('week').toDate() }}).sort({ lastUpdated: -1 }).limit(1).toArray();
        const leaderboard = cursor[0]?.leaderboard;
        return leaderboard
    } catch (err) {
        console.error(err);

    } finally {
        await client.close();
    }
}

module.exports = {
    getLatests,
    getLastWeekLeaderboard,
    insertLeaderboard,
    updateLeaderboard
};