// require('dotenv').config();

// // const { MongoClient } = require('mongodb');
// // const axios = require('axios');
// // const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

// const moment = require('moment');
// const { getAirport } = require("./server/data/airports");
// const { listIvaoFlight } = require('./server/db/mongo/ivaoTrackerDB');
// const { getMongoConnection } = require('./server/db/mongoDBPool');
// const {  getMetricsGroupedByPilotByPireps, getMetricsTotalByPireps } = require('./server/db/mysql/pirepsDB');





// // const getClient = async() => {
// //     const client = new MongoClient(uri);
// //     await client.connect();
// //     console.log('connection stablished');
// //     return client;
// // };

// // const getDB = (client) => {
// //     const DB = 'lsa_leaderboard'; //'' 'lsa_leaderboard';
// //     return client.db(DB)
// // };


// const doyourthing = async() => {
//     let conn;
//     try {
//         conn = await getMongoConnection();
//         const db = conn.db('lsa_leaderboard');

//         const ivaoFlightsCol = db.collection('ivao_not_in_airline');
//         const startDate = moment().startOf('month').toDate()
//         console.log(startDate);
//         // const cursor = await ivaoFlightsCol.find({ 'lastTrack.timestamp': { $gt: startDate, $lte: new Date() } }).sort({ lastUpdatedDate: 1 }).toArray();
//         const cursor = await ivaoFlightsCol.aggregate([
//             { 
//                 $addFields: {
//                     date: {
//                         $dateFromString: {
//                             "dateString": "$lastTrack.timestamp"
//                         }
//                     }
//                 }
//             }, {
//                 $match: {
//                     date:  { $gt: startDate, $lte: new Date() }
//                 }
//             }, {
//                 $sort: { date: 1 }
//             }
//         ]).toArray();
//         // { 'lastTrack.timestamp': { $gt: startDate, $lte: new Date() } }).sort({ lastUpdatedDate: 1 }).toArray();
//         console.log(cursor);
        

//         // console.log(startDate);
//         // console.log(new Date());

        
//         // const cursor = await pilots.aggregate([
//         //     { $sort: { lastUpdatedDate: 1} },
//         //     { $match: { lastUpdatedDate: { $gt: startDate, $lte: new Date() } } },
//         //     { $addFields: { 
//         //         year : { $multiply: [ { $year: '$lastUpdatedDate' }, 100000000] },
//         //         month : { $multiply: [ { $month: '$lastUpdatedDate' }, 1000000] },
//         //         day : { $multiply: [ { $dayOfMonth: '$lastUpdatedDate' }, 10000] },
//         //         hour:{ $multiply: [ {$hour: '$lastUpdatedDate'}, 100 ] },
//         //         minute:{ $minute: '$lastUpdatedDate' }
//         //     }},
//         //     { $addFields: { 
//         //         ref: { $sum: ['$year', '$month', '$day', '$hour', '$minute']} 
//         //     }},
//         //     { $unwind: '$leaderboard' },
//         //     { $group: { _id: '$ref' , totalFlights: { $sum: '$leaderboard.flights' } } },
//         //     { $project: {
//         //         _id: 0,
//         //         totalFlights: 1,
//         //         date: { $toDate : { 
//         //             $concat: [
//         //                 { $substr: [ { $toString: "$_id" }, 0 , 4] },
//         //                 "-",
//         //                 { $substr: [ { $toString: "$_id" }, 4 , 2] },
//         //                 "-",
//         //                 { $substr: [ { $toString: "$_id" }, 6 , 2] },
//         //                 "T",
//         //                 { $substr: [ { $toString: "$_id" }, 8 , 2] },
//         //                 ":",
//         //                 { $substr: [ { $toString: "$_id" }, 10 , 2] },
//         //                 ":00Z"
//         //             ] 
//         //             }
//         //         }
//         //     } },
//         //     // { $addFields: { 
//         //     //     onlyday: { $toInt:  { $substr: ['$_id', 0, 8] } }
//         //     // }},
//         //     // { $group: { _id: '$onlyday' , totalFlights: { $max: '$totalFlights' } } },
//         //     { $sort: { date: 1} },
//         // ]).toArray();
//         // console.log(cursor[0], cursor[cursor.length - 1]);
//         // const mapdata = cursor.reduce((acc, d) => {
//         //     const day = moment(d.lastUpdatedDate).date();
//         //     const fday = acc[day];
//         //     const sum = d.leaderboard.reduce((acc, val) => {
//         //         const f = Number(val.flights) || 0;
//         //         return acc += f;
//         //     }, 0);

//         //     if (!fday || sum > fday) {
//         //         acc[day] = sum;
//         //     }
//         //     return acc;
//         // }, {});
//         // console.log(Object.keys(mapdata).map(key => ({ day: key, flights: mapdata[key] })).sort((a, b) => a.flights - b.flights));

//         // console.log(cursor.length);
//         // cursor.forEach(async (c) => {
//         //     client = await getMongoConnection();
//         //     const db = getMongoDatabase(client);

//         //     const pilots = db.collection('pilots');
//         //     console.log(c.date);
//         //     const filter = { _id: c._id };
//         //     const options = { upsert: true };
//         //     const updateDoc = {
//         //         $set: {
//         //             lastUpdatedDate: new Date(c.lastUpdated)
//         //         },
//         //     };
//         //     await pilots.updateOne(filter, updateDoc, options);
//         // //     await pilots.updateOne
//         // });

//         // const cursor = await pilots.find({lastUpdatedDate: { $lt: moment().startOf('week').toDate() }}).sort({ lastUpdated: -1 }).limit(1).toArray();
//         // const lastUpdated = cursor[0]?.lastUpdatedDate;

//         // console.log(lastUpdated);
//     } finally {
//         (await conn).close();
//     }
// }

// // doyourthing()

var Memcached = require('memcached');
// var memcached = new Memcached('localhost:11211', {});
var memcached = new Memcached('lsaapi.gairacalabs.com:3333', {});

try {
  memcached.set('testvalue', 'asasasasas', 10000, function (err) {
    console.log('value set');
    

    memcached.get('testvalue', (err, data) => {
      console.log(data);
    })
  });
} catch (err) {
  console.log(err);
}

// var { Client } = require('memjs');
// var memcached = Client.create('lsaapi.gairacalabs.com:3333', {
//   username: 'arhuako',
//   password: 'H3l4d0d3k0l4!'
// });
// memcached.set('test', 'value', { expires: 12 })
// memcached.get('test').then(({ value }) => {
//   console.log(value.toString());
// });
