let server;

const request = require('supertest');
const mongoose = require('mongoose');

const { User } = require('../../../model/user');
const { Event } = require('../../../model/event');

describe('/API/EVENTS/REMOVE-EVENT/:ID', () => {
    beforeEach(() => { server = require('../../../app') });

    afterEach(async () => {
        await server.close();
        await Event.remove({});
        await User.remove({});
    });

    let eventId, user, userToken, event;

    const exec = async () => {
        return await request(server)
            .delete(`/api/events/remove-event/${ eventId }`)
            .set('x-auth-token', userToken)
    }

    beforeEach(async () => {
        user = new User({ 
            firstName: 'aaaaa', lastName: 'bbbbb', 
            email: "abcdef@gamil.com", password: '1234567890'
        });

        event = new Event({
            name: 'abcdef', description: 'abcdefghijklmn',
            paid: true, price: 100, expiresIn: '2020'
        });

        user.events.push(event.id);
        eventId = event.id;

        await event.save();
        await user.save();

        userToken = user.generateAuthToken();
    });

    it ('should return a 404 response status if invalid eventId is passed', async () => {
        eventId = 'a';

        const res = await exec();

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('not a valid object id');
    });

    it ('should return a 404 response if the event id is not in users event list', async () => {
        eventId = mongoose.Types.ObjectId().toHexString();

        const res = await exec();

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('event not found in db')
    });

    it ('should return a 400 response status if wrong userToken is passed', async () => {
        userToken = userToken.split('').reverse().join('');

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('invalid token is provided')
    });

    it ('should delete and return the event object in the body of the response if right parameters are passed', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('success');
        expect(res.body.data).toHaveProperty('description');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('price');
    })
})