/* eslint-disable no-undef */
const express = require('express');
const data = require('./data/geo.js');
const cors = require('cors');
const weather = require('./data/darksky.js');
const app = express();
app.use(cors());
let lat;
let lng;

app.get('/location', (req, res) => {
    const location = req.query.serach;
    console.log('using location...', location);
    const cityData = data.results[0];
    lat = cityData.geometry.location.lat;
    lng = cityData.geometry.location.lng;
    res.json({
        formatted_query : cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude:cityData.geometry.location.lng,
    });
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