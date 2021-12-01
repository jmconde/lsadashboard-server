const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const moment = require('moment');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';

async function getLatests() {
  const conn = await getMongoConnection();
  try {
    const db = conn.db(DB);
    const pilots = db.collection('pilots');
    const cursor = await pilots.find({}).sort({ lastUpdatedDate: -1 }).limit(2).toArray();
    const latest = cursor[0];
    const previous = cursor[1];
    return { latest, previous };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await conn.close();
  }
}

async function insertLeaderboard(leaderboard) {
  const conn = await getMongoConnection();
  try {
    const lastUpdatedDate = new Date();
    const lastUpdated = lastUpdatedDate.getTime();
    const db = conn.db(DB);
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
    await conn.close();
  }
}

async function updateLeaderboard() {
  const conn = await getMongoConnection();
  try {
    const db = conn.db(DB);
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
    await conn.close();
  }
}

const getLastWeekLeaderboard = async () => {
  const conn = await getMongoConnection();
  try {
    const db = conn.db(DB);
    const pilots = db.collection('pilots');

    const cursor = await pilots.find({ lastUpdatedDate: { $lt: moment().startOf('week').toDate() } }).sort({ lastUpdated: -1 }).limit(1).toArray();
    const leaderboard = cursor[0]?.leaderboard;
    return leaderboard
  } catch (err) {
    console.error(err);

  } finally {
    await conn.close();
  }
}

async function getDailyTotalFlights() {
  const conn = await getMongoConnection();
  try {
    const db = conn.db(DB);
    const pilots = db.collection('pilots');

    const startDate = moment().startOf('month').toDate();
    // const data = await pilots.aggregate([
    //   { $sort: { lastUpdatedDate: 1 } },
    //   { $match: { lastUpdatedDate: { $gt: startDate, $lte: new Date() } } },
    //   {
    //     $addFields: {
    //       year: { $multiply: [{ $year: '$lastUpdatedDate' }, 100000000] },
    //       month: { $multiply: [{ $month: '$lastUpdatedDate' }, 1000000] },
    //       day: { $multiply: [{ $dayOfMonth: '$lastUpdatedDate' }, 10000] },
    //       hour: { $multiply: [{ $hour: '$lastUpdatedDate' }, 100] },
    //       minute: { $minute: '$lastUpdatedDate' }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       ref: { $sum: ['$year', '$month', '$day', '$hour', '$minute'] }
    //     }
    //   },
    //   { $unwind: '$leaderboard' },
    //   { $group: { _id: '$ref', totalFlights: { $sum: '$leaderboard.flights' } } },
    //   { $project: {
    //       _id: 0,
    //       totalFlights: 1,
    //       date: { $toDate : { 
    //           $concat: [
    //               { $substr: [ { $toString: "$_id" }, 0 , 4] },
    //               "-",
    //               { $substr: [ { $toString: "$_id" }, 4 , 2] },
    //               "-",
    //               { $substr: [ { $toString: "$_id" }, 6 , 2] },
    //               "T",
    //               { $substr: [ { $toString: "$_id" }, 8 , 2] },
    //               ":",
    //               { $substr: [ { $toString: "$_id" }, 10 , 2] },
    //               ":00Z"
    //           ] 
    //           }
    //       }
    //   } },
    //   { $sort: { date: -1 } },
    // ]).toArray();

    const data = await pilots.find({ lastUpdatedDate: { $gt: startDate, $lte: new Date() } }).sort({ lastUpdatedDate: 1 }).toArray();

      const mapdata = data.reduce((acc, d) => {
        const day = moment(d.lastUpdatedDate).date();
        const fday = acc[day];
        const sum = d.leaderboard.reduce((acc, val) => {
            const f = Number(val.flights) || 0;
            return acc += f;
        }, 0);

        if (!fday || sum > fday) {
            acc[day] = sum;
        }
        return acc;
    }, {});
    return Object.keys(mapdata).map(key => ({ day: key, flights: mapdata[key] })).sort((a, b) => a.flights - b.flights)
  } catch (err) {
    console.error(err);

  } finally {
    await conn.close();
  }
}

module.exports = {
  getLatests,
  getLastWeekLeaderboard,
  insertLeaderboard,
  updateLeaderboard,
  getDailyTotalFlights
};