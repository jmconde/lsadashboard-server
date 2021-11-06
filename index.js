const express = require('express');
const app = express();
const port = 3100;
const orderedPilots = require('./server/pilots');

app.get('/', (req, res) => {
    res.send('Hello world II!!')
});

app.get('/pilots', async (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(await orderedPilots()));
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`)
});