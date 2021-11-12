let server;

const request = require('supertest');
const mongoose = require('mongoose');

const { User } = require('../../../model/user');
const { Event } = require('../../../model/event');

describe('/api/events/edit/:id', () => {
    beforeEach(() => { server = require('../../../app') });

    afterEach(async () => {
        await server.close();
        await User.remove({});
        await Event.remove({});
    });

    let eventId, user, event, 
        token, name, description,   
        paid, price, expiresIn, newEvent;

    const exec = async () => { 
        return await request(server)
            .put(`/api/events/edit-event/${ eventId }`)
            .set('x-auth-token', token)
            .send({ name, description, paid, price, expiresIn})   
    }

    beforeEach(async () => {
        name = 'ghujklmn'
        description = 'abcdefghijklmn';
        paid = true; 
        price = 200; 
        expiresIn = '2021';

        user = new User({
            firstName: 'the name', email: 'email@gmail.com',
            lastName: 'last name', password: '1234567890'
        });

        event = new Event({
            name: 'abcdef', description: 'abcdefghijklmn',
            paid: true, price: 100, expiresIn: '2020'
        });

        user.events.push(event.id);
        eventId = event.id;

        await user.save();
        await event.save();

        token = user.generateAuthToken();
    });

    it ('should return a 401 response status if no authentication token is passed', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it ('should return a 404 response status if the id is not stored in the user data', async () => {
        eventId = mongoose.Types.ObjectId().toHexString();

        const res = await exec();

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('file not in collection');
    });

    it ('should return a 400 response status if name of event length is less than 2', async () => {
        name = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it ('should return a 400 response status if name of length more than 30', async () => {
        name = new Array(32).join('a');

        const res = await exec();

        expect(res.status).toBe(400)
    })

    it ('should return a 400 response status if description length is less than 5', async () => {
        description = 'aaaa';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it ('should return a 400 response status if name length is more than 1000', async () => {
        description = new Array(1005).join('a');

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return a 400 response status if paid is not a boolean', async () => {
        paid = 'falsey';

        const res = await exec();

        expect(res.status).toBe(400)
    });

    it ('should return a 400 response status if price is not a number', async () => {
        price = 'price';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should update the event object if all paramaters are right', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('paid');  
        expect(res.body.data).toHaveProperty('description');
        expect(res.body.data).toHaveProperty('price');
        expect(res.body.message).toContain('success');
    })
})