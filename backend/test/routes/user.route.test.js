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
    it('should not create a user', (done) => {
        request(app)
            .post('/register')
            .send(user_global)
            .expect(400, done);
    });
    it('should get all the users', (done) => {
        request(app)
            .get('/users')
            .then((res) => {
                expect(res.status).toBe(200);
                let { body } = res;
                expect(body.length).toBeTruthy();
                for(let user of body){
                    expect(user.password).toBeFalsy();
                    expect(user.id).toBeFalsy();
                    expect(user.name).toBeTruthy();
                    expect(user.username).toBeTruthy();
                    expect(user.email).toBeTruthy();
                    expect(user.profile_pic_url).toBeTruthy();
                }
                done();
            })
    })
});