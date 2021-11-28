const express = require('express');
const orderedPilots = require('./data/pilots');
const path = require('path');
const apiRouter = require('./router/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const  { ApolloServer } = require('apollo-server-express');
const { createServer } = require("http");
const { readFileSync } = require("fs");

const typeDefs = readFileSync('./server/graphql/typeDefs.graphql', 'utf-8');
const resolvers = require('./graphql/resolvers');

const PORT = 3100;
//1419332340d1ac0b8c7921d2e38d763532b3d93e7f81382fd87356ac74347004877a5126bae6ef9de3a85f49b90e2426

async function start() {
    const app = express();
    
    app.use(cors());
    app.use(express.static('assets'));
    app.use(bodyParser.json());
    
    app.use(function (req, res, next) {
        console.log('Time:', Date.now(), req.path);
        next();
    })

    app.use('/api', apiRouter);
    
    app.get('/pilots', async (req, res) => {
        res.redirect('http://gairacalabs.xyz:8080');
    })
    
    app.use('/graphql', bodyParser.json());

    const server = createServer(app);
    
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    server.listen(PORT, () => {
        console.log(`Apollo Server listening at port ${PORT}`)
    });
    return server;
}

module.exports = { start };