const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../../model/user');

describe ('verification of authentication token', () => {
    it ('should generate a valid jwt', () => {
        const payload = { _id: mongoose.Types.ObjectId().toHexString() };
        const token = new User(payload).generateAuthToken();

        const decoded = jwt.verify(token, config.get('jwtPass'));

        expect(decoded).toMatchObject(payload)
    })
})