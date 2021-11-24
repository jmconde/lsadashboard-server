const { MongoClient } = require('mongodb');
const moment = require('moment');
const axios = require('axios');
const uri = 'mongodb://root:qwerty123@192.168.1.124:37017';

const getClient = async() => {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('connection stablished');
    return client;
};

const getDB = (client) => {
    const DB = 'lsa_leaderboard'; //'' 'lsa_leaderboard';
    return client.db(DB)
};


const doyourthing = async() => {
    let client;
    try {
        client = await getClient();
        const db = getDB(client);

        const pilots = db.collection('pilots');
        const startDate = moment().startOf('month').toDate()

        console.log(startDate);
        console.log(new Date());

        const cursor = await pilots.find({ lastUpdatedDate: { $gt: startDate, $lte: new Date() } }).sort({ lastUpdatedDate: 1 }).toArray();
        
        // const cursor = await pilots.aggregate([
        //     { $sort: { lastUpdatedDate: 1} },
        //     { $match: { lastUpdatedDate: { $gt: startDate, $lte: new Date() } } },
        //     { $addFields: { 
        //         year : { $multiply: [ { $year: '$lastUpdatedDate' }, 100000000] },
        //         month : { $multiply: [ { $month: '$lastUpdatedDate' }, 1000000] },
        //         day : { $multiply: [ { $dayOfMonth: '$lastUpdatedDate' }, 10000] },
        //         hour:{ $multiply: [ {$hour: '$lastUpdatedDate'}, 100 ] },
        //         minute:{ $minute: '$lastUpdatedDate' }
        //     }},
        //     { $addFields: { 
        //         ref: { $sum: ['$year', '$month', '$day', '$hour', '$minute']} 
        //     }},
        //     { $unwind: '$leaderboard' },
        //     { $group: { _id: '$ref' , totalFlights: { $sum: '$leaderboard.flights' } } },
        //     { $project: {
        //         _id: 0,
        //         totalFlights: 1,
        //         date: { $toDate : { 
        //             $concat: [
        //                 { $substr: [ { $toString: "$_id" }, 0 , 4] },
        //                 "-",
        //                 { $substr: [ { $toString: "$_id" }, 4 , 2] },
        //                 "-",
        //                 { $substr: [ { $toString: "$_id" }, 6 , 2] },
        //                 "T",
        //                 { $substr: [ { $toString: "$_id" }, 8 , 2] },
        //                 ":",
        //                 { $substr: [ { $toString: "$_id" }, 10 , 2] },
        //                 ":00Z"
        //             ] 
        //             }
        //         }
        //     } },
        //     // { $addFields: { 
        //     //     onlyday: { $toInt:  { $substr: ['$_id', 0, 8] } }
        //     // }},
        //     // { $group: { _id: '$onlyday' , totalFlights: { $max: '$totalFlights' } } },
        //     { $sort: { date: 1} },
        // ]).toArray();
        console.log(cursor[0], cursor[cursor.length - 1]);
        const mapdata = cursor.reduce((acc, d) => {
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
        console.log(Object.keys(mapdata).map(key => ({ day: key, flights: mapdata[key] })).sort((a, b) => a.flights - b.flights));

        // console.log(cursor.length);
        // cursor.forEach(async (c) => {
        //     client = await getClient();
        //     const db = getDB(client);

        //     const pilots = db.collection('pilots');
        //     console.log(c.date);
        //     const filter = { _id: c._id };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             lastUpdatedDate: new Date(c.lastUpdated)
        //         },
        //     };
        //     await pilots.updateOne(filter, updateDoc, options);
        // //     await pilots.updateOne
        // });

        // const cursor = await pilots.find({lastUpdatedDate: { $lt: moment().startOf('week').toDate() }}).sort({ lastUpdated: -1 }).limit(1).toArray();
        // const lastUpdated = cursor[0]?.lastUpdatedDate;

        // console.log(lastUpdated);
    } finally {
        (await client).close();
    }
}

doyourthing()

async function  req() {
    const url = `https://crew.latinstreamingalliance.com/api/acars`;
    const response = await axios.get(url);
    return response.data;
}

async function show() {
    const r = await req();
    console.log(r);
}

// show();

