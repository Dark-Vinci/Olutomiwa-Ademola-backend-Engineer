let server;
const request = require('supertest');

const { User } = require('../../model/user');

describe('/api/register', () => {
    beforeEach(() => { server = require('../../app') });

    afterEach( async () => {
        await server.close();
        await User.remove({})
    });  

    let firstName, lastName,
        email, password;

    const exec = async () => {
        return await request(server)
            .post('/api/register')
            .send({
                firstName, lastName, 
                email, password
            });
    }

    beforeEach(() => {
        firstName = 'tomiwa';
        lastName = 'tomiwa';
        email = 'johnDoe@gmail.com';
        password = '1234567890';
    });

    it ('should return 400 if firstName is too short', async () => {
        firstName = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return 400 if lastName is too short', async () => {
        lastName = 'a';

        const res = await exec();

        expect(res.status).toBe(400);  
    });

    it ('should return 400 if firstName is too long', async () => {
        firstName = new Array(23).join('a')

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return 400 if lastname is too long', async () => {
        lastName = new Array(23).join('a')

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return 400 if invalid email is passed', async () => {
        email = 'abcdefgh'

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return 400 if password is too short', async () => {
        password = '090'

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return 400 if password is too long', async () => {
        password = new Array(53).join('a')

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it ('should return a 400 response status when a the email is used by another user', async () => {
        await User.collection.insert({ firstName, lastName, password, email });

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('a user already exist with same email');
    });

    it ('should return 200 with token when inputs are valid', async () => {
        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body.message).toContain('success');
    });
});