let server;
const request = require('supertest');

const { Event } = require('../../../model/event');

describe ('getting all the events in the db', () => {
    beforeEach(() => {
        server = require('../../../app');
    });

    afterEach( async () => {
        await server.close();
        await Event.remove({});
    });

    beforeEach(async () => {
        await Event.collection.insertMany([
            {
                name: 'abcdef', description: 'abcdefghijklmn',
                paid: true, price: 100, expiresIn: 2020
            },

            {
                name: 'abcdef', description: 'abcdefghijklmn',
                paid: true, price: 100, expiresIn: 2020
            }
        ])
    })

    const exec = async () => {
        return await request(server)
            .get('/api/events/events-in-db');
    }

    it ('should return a response of 200', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.message).toContain('success');
    });
});