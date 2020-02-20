/* eslint-disable no-undef */

const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('It should respond with an object of the correct shape',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location?search=portland/');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                formatted_query : expect.any(String),
                latitude: expect.any(String),
                longitude:expect.any(String),
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});
describe('/GET /weather', () => {
    test('It should respond with an object of the correct shape',
        async(done) => {
            const response = await request(app)
                .get('/weather/');
            expect(response.body[0]).toEqual({
                forcast: expect.any(String),
                time:expect.any(String),
            });
            expect(response.statusCode).toBe(200);
          
            done();
        });
});
describe('/GET /yelp', () => {
    test('It should respond with an object of the correct shape',
        async(done) => {
            const response = await request(app)
                .get('/yelp/');
            expect(response.body[0]).toEqual(
                {
                    name: expect.any(String),
                    price:expect.any(String),
                    rating: expect.any(Number),
                    url:expect.any(String),
                }
            );
            expect(response.statusCode).toBe(200);
          
            done();
        });
});