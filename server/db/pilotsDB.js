async function getLatests() {
    const client = require('./db')();
    try {
        await client.connect();
        const db = client.db('lab');
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
    const client = require('./db')();
    try {
        const lastUpdatedDate = new Date();
        const lastUpdated = lastUpdatedDate.getTime();
        await client.connect();
        const db = client.db('lab');
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
    try {
        await client.connect();
        const db = client.db('lab');
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

module.exports = {
    getLatests,
    insertLeaderboard,
    updateLeaderboard
};