let server;
const request = require('supertest');

const { Event } = require('../../../model/event');
const { User } = require('../../../model/user');

describe('/api/events/get-by-id/:id', () => {
    beforeEach(() => { server = require('../../../app')});

    afterEach(async () => {
        await server.close();
        await Event.remove({});
        await User.remove({});
    });

    let id, token, fakeId, event;

    const exec = async () => {
        return await request(server)
            .get(`/api/events/get-by-id/${ id }`)
            .set('x-auth-token', token)
    }

    beforeEach(async () => {
        event = new Event({
            name: 'the name', description: 'the event description',
            paid: true, price: 100, expiresIn: '2020'
        });

        const user = new User({
            firstName: 'firstName', lastName: 'lastName', 
            email: 'firstName', password: '1234567890'
        });

        await event.save();
        await user.save();

        user.events.push(event.id);

        await user.save();

        id = event.id;
        token = user.generateAuthToken();

        // fake event id;
        fakeId = id.split('').reverse().join('');
    });

    it ('should return a 404 response if id is not a valid object id', async () => {
        id = 1;
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it ('should return a 404 response if a valid but fake object id is passed', async () => {
        id = fakeId;
        const res = await exec();

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('event not found');
    });

    it ('should return the object if id is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('description');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('price');
    });
})