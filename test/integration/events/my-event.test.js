let server;

const request = require('supertest');

const { Event } = require('../../../model/event');
const { User } = require('../../../model/user');

describe ('/api/events/my-events', () => {
    beforeEach(() => { server = require('../../../app') });

    afterEach(async () => {
        await server.close();
        await Event.remove({});
        await User.remove({});
    });

    let token, event1, event2, user;

    const exec = async () => {
        return await request(server)
            .get('/api/events/my-events')
            .set('x-auth-token', token)
    }

    beforeEach( async () => {
        event1 = new Event({
            name: 'abcdef', description: 'abcdefghijklmn',
            paid: true, price: 100, expiresIn: 2020
        });

        event2 = new Event({
            name: 'abcdef', description: 'abcdefghijklmn',
            paid: true, price: 100, expiresIn: 2020
        });

        user = new User({
            firstName: 'the name', email: 'email@gmail.com',
            lastName: 'the name', password: '1234567890'
        })

        user.events.push(event1.id);
        user.events.push(event2.id);

        token = user.generateAuthToken();

        await event1.save();
        await event2.save();
        await user.save();
    });

    it ('should return a 401 error status if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
        expect(res.body.message).toContain('no token provided')
    });

    it ('should return the list of events in the user db if right token is passed', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.message).toContain('success');
    })
})