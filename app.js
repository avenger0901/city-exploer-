const express = require('express');
const data = require('./data/geo.js');
const weather = require('./data/darksky.js');
const app = express();
const request = require('superagent');
app.get('/location', (req, res) => {
    const cityData = data.results[0];
    res.json({
        formatted_query : cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude:cityData.geometry.location.lng,
    });
});
app.get('*', (request, response) => {
    response.json({
        onNo: '404'
    });
});

app.listen(3000, () => {console.log('running....');});