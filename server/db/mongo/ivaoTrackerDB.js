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

async function insertIvaoTracking(data) {
  let conn;
  try {
    conn = await getMongoConnection();
      
    const db = conn.db(DB);
    const collection = db.collection('ivao_tracking');
    const query = { id: data.id };
    const update = { $set: data };
    const options = { upsert: true };
    await collection.updateOne(query, update, options);

  } catch (err) {
      console.error(err);
  } finally {
      await conn.close();
  }
}

const splitUserName = (username) => {
  const splitted = username.split(' ');
  return `${splitted[0]} ${splitted[1].substring(0, 1)}`;
};

async function insertIvaoFligth(ivaoTracking, activeUserFlight) {
  let conn;
  try {
    
    const { userId, callsign, lastTrack, flightPlan: { departureId, arrivalId } } = ivaoTracking;
    const { pirep_id, pilot_id, user_name, flight_number, state, status } = activeUserFlight;
    const _id = `${userId}${callsign}${departureId}${arrivalId}`;
    
    const data = { _id, ... { 
      ivaoVid: userId, 
      departureId, 
      arrivalId, 
      callsign,
      lastIvaoState: lastTrack.state,
      lastIvaoLatitude: lastTrack.latitude,
      lastIvaoLongitude: lastTrack.longitude,
      ivaoOnGround: lastTrack.onGround,
      ivaoTime: lastTrack.time
     }, 
      ... {
        pirep_id,
        pilot_id,
        user_name: splitUserName(user_name),
        flight_number,
        state, 
        status
      }
    };

    const query = { _id: data._id };
    const update = { $set: data };
    const options = { upsert: true };

    conn = await getMongoConnection();      
    const db = conn.db(DB);
    const collection = db.collection('ivao_flight');
    await collection.updateOne(query, update, options);
  } catch (err) {
      console.error(err);
  } finally {
      await conn.close();
  }
}

module.exports = {
  getIvaoFlight,
  insertIvaoTracking,
  insertIvaoFligth,
}