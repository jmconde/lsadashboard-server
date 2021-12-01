const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';

async function getIvaoFlight(id) {
  const conn = await getMongoConnection();
  try {
      const db = conn.db(DB);
      const collection = db.collection('ivao_tracking');
      const f = await collection.findOne({ id }, {});       
      return f;
  } catch (err) {
      throw new Error('airport not found in db')
  } finally {
      await conn.close();
  }
}

async function insertIvaoFlight(data) {
  let conn;
  try {
    conn = await getMongoConnection();
      
      const db = conn.db(DB);
      const collection = db.collection('ivao_tracking');
      const query = { id: data.id };
      const update = { $set: data };
      const options = { upsert: true };
      await collection.updateOne(query, update, options);;

  } catch (err) {
      console.error(err);
  } finally {
      await conn.close();
  }
}

module.exports = {
  getIvaoFlight,
  insertIvaoFlight,
}