const express = require('express');
const orderedPilots = require('./pilots');
const port = 3100;
//1419332340d1ac0b8c7921d2e38d763532b3d93e7f81382fd87356ac74347004877a5126bae6ef9de3a85f49b90e2426

function start() {
    const app = express();
    app.use(express.static('assets'));

    app.get('/', (req, res) => {
        res.send('Hello world II!!')
    });

    app.get('/pilots', async(req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(await orderedPilots()));
    });

    app.listen(port, () => {
        console.log(`Server listening at port ${port}`)
    });
    return app;
}

module.exports = { start };