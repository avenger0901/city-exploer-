/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const request = require ('superagent');
app.use(cors());
let lat;
let lng;

app.get('/location', async(req, res, next) => {
    try {
        const location = req.query.search;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_API_KEY}&q=${location}&format=json`;
   
        const cityData = await request.get(URL);
        const firstResult = cityData.body[0];
        lat = firstResult.lat;
        lng = firstResult.lon;
        res.json({
            formatted_query : firstResult.display_name,
            latitude: lat,
            longitude:lng,
        });
    } catch (err) {
        next(err);
    }
});
const getWeatherData = async(lat, lng) => {
   
    const URL = `https://api.darksky.net/forecast/${process.env.DARK_API_KEY}/${lat},${lng}`;
    const weather = await request.get(URL);
    console.log(weather);

    return weather.body.daily.data.map(forecast =>{
        return {
            forcast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};
app.get('/weather', async(req, res, next) => {
    try {
        const portlandWeather = await getWeatherData(lat, lng);
        res.json(portlandWeather);
    } catch (err) {
        next(err);
    }
});

app.get('*', (request, response) => {
    response.json({
        onNo: '404'
    });
});
app.listen(3000, () => {console.log('running....');});
