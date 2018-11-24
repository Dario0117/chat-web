const request = require('supertest');
const faker = require('faker');
const app = require('../../src/index');
const {
    fetchMessages,
    storeMessage,
} = require('../../src/models/message.model');

faker.locale = 'es_MX';

describe('Model: Message', () => {
    let user_global_1;
    let user_global_2;
    let user_global_3;
    let conversation_global;
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

        conversation_global = await request(app)
            .post('/rooms')
            .set('Authorization', user_global_1.token)
            .send({
                message: "test message",
                receivers: [user_global_2.id, user_global_3.id],
                name: "Messasges test",
            });
        done();
    });
    it('should store messages on a specific conversation', async (done) => {
        let stored1 = await storeMessage(
            'This is a new message from 1', 
            conversation_global.body.id,
            user_global_1.id,
        );
        expect(stored1.id).toBeTruthy();
        let stored2 = await storeMessage(
            'This is a new message from 2', 
            conversation_global.body.id,
            user_global_2.id,
        );
        expect(stored2.id).toBeTruthy();
        done();
    });
    it('should fetch all messages from a specific conversation', async (done) => {
        let stored = await storeMessage(
            'This is a new message from 1 again', 
            conversation_global.body.id,
            user_global_1.id,
        );
        expect(stored.id).toBeTruthy();
        
        let res = await fetchMessages(conversation_global.body.id, user_global_1.id)
        expect(res.length).toBeTruthy();
        expect(res.find(m => m.id === stored.id)).toBeTruthy();
        done();
    });
});