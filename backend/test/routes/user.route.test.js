const request = require('supertest');
const faker = require('faker');
const app = require('../../src/index');

faker.locale = 'es_MX';

describe('Model: User', () => {
    let user_global = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.findName(),
        profile_pic_url: faker.image.imageUrl(),
        token: '',
    };
    it('should create a user', (done) => {
        request(app)
            .post('/register')
            .send(user_global)
            .expect(201, done);
    });
});