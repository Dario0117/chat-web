const request = require('supertest');
const faker = require('faker');
const app = require('../../src/index');

faker.locale = 'es_MX';

describe('Model: Room', () => {
    let user_global_1;
    let user_global_2;
    let user_global_3;
    beforeAll(async (done) => {
        user_global_1 = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            name: faker.name.findName(),
            id: '',
            token: '',
        };
        let b_1 = await request(app)
            .post('/register')
            .send(user_global_1);
        user_global_1.id = b_1.body.id;
        let res_1 = await request(app)
            .post('/login')
            .send({
                username: user_global_1.username,
                password: user_global_1.password,
            });
        user_global_1.token = 'bearer ' + res_1.body.token;

        user_global_2 = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            name: faker.name.findName(),
            id: '',
            token: '',
        };
        let b_2 = await request(app)
            .post('/register')
            .send(user_global_2);
        user_global_2.id = b_2.body.id;
        let res_2 = await request(app)
            .post('/login')
            .send({
                username: user_global_2.username,
                password: user_global_2.password,
            });
        user_global_2.token = 'bearer ' + res_2.body.token;

        user_global_3 = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            name: faker.name.findName(),
            id: '',
            token: '',
        };
        let b_3 = await request(app)
            .post('/register')
            .send(user_global_3);
        user_global_3.id = b_3.body.id;
        let res_3 = await request(app)
            .post('/login')
            .send({
                username: user_global_3.username,
                password: user_global_3.password,
            });
        user_global_3.token = 'bearer ' + res_3.body.token;
        done();
    });
    it('should create a conversation with 2 users (private message)', (done) => {
        request(app)
            .post('/rooms')
            .set('Authorization', user_global_1.token)
            .send({
                message: "test message",
                receivers: [user_global_2.id],
            })
            .expect(201, done);
    });
});