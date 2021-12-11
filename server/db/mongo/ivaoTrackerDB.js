const { getMongoConnection, getMongoDatabase } = require('../mongoDBPool');
const DB = process.env.LSA_MONGO_DB || 'lsa_leaderboard';
const moment = require('moment');
const { splitUserName } = require('../../helpers/pilotHelper');

const IVAO_LANDED_STATES = ['Landed', 'On Blocks'];

async function getIvaoFlight(_id) {
  const conn = await getMongoConnection();
  try {
      const db = conn.db(DB);
      const collection = db.collection('ivao_tracking');
      const f = await collection.findOne({ id_ }, {});       
      return f;
  } catch (err) {
      throw new Error('airport not found in db')
  } finally {
      await conn.close();
  }
}


async function listIvaoFlight(start, end) {
  const conn = await getMongoConnection();
  try {
      const db = conn.db(DB);
      const pilots = db.collection('ivao_flight');
      const result = await pilots.find({ 
        updatedAt: { 
          $gte: moment(start).startOf('day').toDate(), 
          $lte: moment(end).startOf('day').toDate(),
        },
        lastIvaoState: {
          $in: IVAO_LANDED_STATES
        }
      }).toArray();
      return result;
  } catch (err) {
    throw new Error(err)
  } finally {
      await conn.close();
  }
}

async function insertIvaoTracking(data, notInAirline) {
  let conn;
  try {
    conn = await getMongoConnection();
      
    const db = conn.db(DB);
    const collection = db.collection(!notInAirline ? 'ivao_tracking' : 'ivao_not_in_airline');
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

// const splitUserName = (username) => {
//   const splitted = username.split(' ');
//   return `${splitted[0]} ${splitted[1].substring(0, 1)}`;
// };

async function insertIvaoFligth(ivaoTracking, activeUserFlight) {
  let conn;
  try {
    
    const { userId, callsign, lastTrack, flightPlan: { departureId, arrivalId } } = ivaoTracking;
    const { pirep_id, pilot_id, user_name, flight_number, state, status } = activeUserFlight;
    const _id = `${pirep_id}${userId}${callsign}${departureId}${arrivalId}`;
    const updatedAt = new Date();
    
    const data = { _id, updatedAt,
      ... { 
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

async function getIvaoFlightsByPireps(pireps) {
  let conn = await getMongoConnection();
  try {
      const db = conn.db(DB);
      const collection = db.collection('ivao_flight');
      const f = await collection.find({ pirep_id: { $in: pireps } }).toArray();       
      return f;
  } catch (err) {
      throw new Error('Error getting ivao flights by pireps');
  } finally {
      await conn.close();
  }
}

async function getIvaoFlightsNotInAirline(start, end) {
  let conn = await getMongoConnection();
  try {
    const db = conn.db('lsa_leaderboard');
    const ivaoFlightsCol = db.collection('ivao_not_in_airline');
    const startDate = moment().startOf('month').toDate();
    const cursor = await ivaoFlightsCol.aggregate([
      { 
          $addFields: {
              date: {
                  $dateFromString: {
                      "dateString": "$lastTrack.timestamp"
                  }
              }
          }
      }, {
          $match: {
              date:  { $gt: startDate, $lte: new Date() },
              'lastTrack.state': { $in: IVAO_LANDED_STATES }
          }
      }, {
          $sort: { date: 1 }
      }
    ]).toArray();

    return cursor;
  } catch(err) {
    throw new Error('Error getting ivao flights not in airline');
  } finally {
    await conn.close();
  }
}

module.exports = {
  getIvaoFlight,
  insertIvaoTracking,
  insertIvaoFligth,
  listIvaoFlight,
  getIvaoFlightsByPireps,
  getIvaoFlightsNotInAirline,
}