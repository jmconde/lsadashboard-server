const express = require('express');
const orderedPilots = require('./data/pilots');
const path = require('path');
const apiRouter = require('./router/api');
const bodyParser = require('body-parser');
var cors = require('cors');
const port = 3100;
//1419332340d1ac0b8c7921d2e38d763532b3d93e7f81382fd87356ac74347004877a5126bae6ef9de3a85f49b90e2426

function start() {
    const app = express();
    app.use(cors());
    app.use(express.static('assets'));
    // app.use('/beta', express.static('static'));
    app.use(bodyParser.json());
    
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(function (req, res, next) {
        console.log('Time:', Date.now(), req.path);
        next();
    })

    app.use('/api', apiRouter);

    // app.get('/', (req, res) => {
    //     res.render('index', {
    //       subject: 'Pug template engine',
    //       name: 'our template',
    //       link: 'https://google.com'
    //     });
    // });

    app.get('/dashboard', (req, res) => {
        res.render('dashboard');
    });

    app.get('/pilots', async (req, res) => {
        res.redirect('http://gairacalabs.xyz:8080');
    })

    app.listen(port, () => {
        console.log(`Server listening at port ${port}`)
    });
    return app;
}

module.exports = { start };