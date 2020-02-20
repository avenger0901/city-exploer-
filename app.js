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
app.get('/yelp', async(req, res, next) => {
    try {
        const yelpStuff = await request
            .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lng}`)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
        const yelpObject = JSON.parse(yelpStuff.text);
        const yelpBusiness = yelpObject.businesses.map(business =>{
            return {
                name: business.name,
                price:business.price,
                rating:business.rating,
                url:business.url,
            };

        });
        res.json(
            yelpBusiness);
    } catch (err) {
        next(err);
    }
});
app.get('/events', async(req, res, next) => {
    try {
        const eventful = await request
            .get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${lat},${lng}&within=25`);
        const body = JSON.parse(eventful.text);
        console.log(body);
        const eventStuff = body.events.event.map(event => {
            return {
                link: event.url,
                name: event.title,
                date: event.start_time,
                summary: event.description,
            };
        });
        res.json(eventStuff);
    } catch (err) {
        next(err);
    }
});
app.get('/trails', async(req, res, next) => {
    try {
        const trailsData = await request
            .get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=10&key=${process.env.TRAILS_KEY}`);
        const body = JSON.parse(trailsData.text);
      
        const trails = body.trails.map(trail =>{
            return {
                name: trail.name,
                location: trail.location,
                length: trail.length,
                stars: trail.stars,
                star_votes: trail.starVotes,
                summary: trail.summary,
                trail_url: trail.url,
                conditions: trail.conditionStatus,
                condition_date: trail.conditionDate,
                condition_time: trail.conditionDate,
            };

        });
        res.json(
            trails);
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
