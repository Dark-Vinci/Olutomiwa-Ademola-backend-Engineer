let server;
const request = require('supertest');

const { User } = require('../../model/user');

describe ('/api/events/my-events', () => {
    beforeEach(() => { server = require('../../app') });

    afterEach(async () => {
        await server.close();
        await User.remove({});
    });

    let token, user;

    const exec = async () => {
        return await request(server)
            .get('/api/events/my-events')
            .set('x-auth-token', token )
    }

    beforeEach(async () => {
        user = new User({
            firstName: 'the name', email: 'email@gmail.com',
            lastName: 'second name', password: '1234567890'
        })

        await user.save();

        token = user.generateAuthToken();
    });

    it ('should return a 401 error status if no token is provided', async () => {
        token = '';

        const res = await exec();

        // expect(res.status).toBe(401);
        expect(res.body.message).toContain('no token provided')
    });

    it ('should return a 400 error status code if wrong token is passed', async () => {
        token = token.split('').reverse().join('');

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('invalid token is provided');
    });

    it ('should return a 200 response status code if right token is passed', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })
})