let server;
const request = require('supertest');

const { User } = require('../../model/user');

describe('login', () => {
    beforeEach( () => { server = require('../../app') });

    afterEach( async () => {
        await server.close();
        await User.remove({});
    });

    let emailTest, passwordTest;

    const exec = async () => {
        return await request(server)
            .post('/api/login')
            .send({ email: emailTest, password: passwordTest})
    }

    beforeEach( async () => {
        await request(server)
            .post('/api/register')
            .send({
                firstName: 'tomiwa',
                lastName: 'tomiwa',
                email: 'johnDoe@gmail.com',
                password: '1234567890'
            });

        emailTest = 'johnDoe@gmail.com';
        passwordTest = '1234567890';
    });

    it ('it should return a 400 if invalid email is passed', async () => {
        emailTest = 'abcdefghijk';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('it should return a 400 if email is not a valid email', async () => {
        emailTest = 'email';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('it should return a 400 if password is too short', async () => {
        passwordTest = 'aaa';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('it should return a 400 if password is too long', async () => {
        passwordTest = new Array(52).join('a');

        const res = await exec();

        expect(res.status).toBe(400)
    });

    it ('it should 400 if wrong email is passed', async () => {
        emailTest = 'johnatan@gmail.com'

        const res = await exec();

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('invalid email or password');
    });

    it ('it should 400 if wrong password is passed', async () => {
        passwordTest = '0987654321'

        const res = await exec();

        expect(res.status).toBe(404)
    });

    it ('a 200 response if email and password are valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('success')
    });
})