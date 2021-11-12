let server;
const request = require('supertest');

const { Event } = require('../../../model/event');
const { User } = require('../../../model/user');

describe ('/api/events/create', () => {
    beforeEach(() => {
        server = require('../../../app');
    });

    afterEach( async () => {
        await server.close();
        await Event.remove({});
        await User.remove({});
    });

    let name, description, price,
        paid, expiresIn, user, userToken;

    const exec = async () => {
        return await request(server)
            .post('/api/events/create')
            .send({ name, expiresIn, price, paid, description })
            .set('x-auth-token', userToken);
    }



    beforeEach(async () => {
        name = 'event1';
        description = 'the description of the event';
        price = 200;
        paid = true;
        expiresIn = '2020';

        user = new User({ 
            firstName: 'aaaaa', lastName: 'bbbbb', 
            email: "abcdef@gamil.com", password: '1234567890'
        });
        
        await user.save();

        userToken = user.generateAuthToken();
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

    it ('should return a 401 response status if no token is provided', async () => {
        userToken = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it ('should return a 400 response status if invalid token is provided', async () => {
        userToken = 'invalidtoken';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it ('should return a 201 response status if all input ', async () => {
        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body.message).toContain('Success');
    })
})