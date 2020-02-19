/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/darksky.js');
const app = express();
const request = require ('superagent');
app.use(cors());
let lat;
let lng;

app.get('/location', async(req, res, next) => {
    try {
        const location = req.query.serach;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_API_KEY}&q=${location}&format=json`;
   
        const cityData = await request.get(URL);
        const firstResult = cityData.body[0];
        lat = firstResult.lat;
        lng = firstResult.lng;
        res.json({
            formatted_query : firstResult.display_name,
            latitude: lat,
            longitude:lng,
        });
    } catch (err) {
        next(err);
    }
});
const getWeatherData = (lat, lng) => {
    
    return weather.daily.data.map(forecast =>{
        return {
            forcast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};
app.get('/weather', (req, res) => {
    const portlandWeather = getWeatherData(lat, lng);
    res.json(portlandWeather);
});

app.get('*', (request, response) => {
    response.json({
        onNo: '404'
    });
});
app.listen(3000, () => {console.log('running....');});
console.log('nnnnn', getWeatherData());