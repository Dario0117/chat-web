const request = require('supertest');
const faker = require('faker');
const app = require('../../src/index');

faker.locale = 'es_MX';

describe('Router: User', () => {
    let user_global;
    beforeAll(() => {
        user_global = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            name: faker.name.findName(),
            token: '',
        };
    });
    it('should create a user', (done) => {
        request(app)
            .post('/register')
            .send(user_global)
            .expect(201, done);
    });
    it('should get JWT with correct credentials', (done) => {
        request(app)
            .post('/login')
            .send({
                username: user_global.username,
                password: user_global.password,
            })
            .expect(200)
            .then((res) => {
                let { body } = res;
                expect(body.token).toBeTruthy();
                expect(body.user.password).toBeFalsy();
                expect(body.user.id).toBeFalsy();
                expect(body.user.name).toBe(user_global.name);
                expect(body.user.username).toBe(user_global.username);
                expect(body.user.email).toBe(user_global.email);
                user_global.token = 'bearer ' + body.token;
                done();
            })
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
            .set('Authorization', user_global.token)
            .then((res) => {
                expect(res.status).toBe(200);
                let { body } = res;
                expect(body.length).toBeTruthy();
                for(let user of body){
                    expect(user.password).toBeFalsy();
                    expect(user.id).toBeTruthy();
                    expect(user.name).toBeTruthy();
                    expect(user.username).toBeTruthy();
                    expect(user.email).toBeTruthy();
                }
                done();
            })
    });
    it('should find a user sending a string', (done) => {
        let user_local = {...user_global};
        user_local = 'this string has the qs.'
        request(app)
            .post('/register')
            .send(user_local)
            .then(() => {
                let qs = '.';
                request(app)
                    .get(`/users?q=${qs}`)
                    .set('Authorization', user_global.token)
                    .expect(200)
                    .then((res) => {
                        let { body } = res;
                        // At least exists the created a few lines back
                        expect(body.length).toBeGreaterThan(0);
                        for(let user of body){
                            let concat = user.username + user.name;
                            expect(concat.indexOf(qs)).toBeGreaterThan(-1);
                        }
                        done();
                    });
            });
    });
    it('should allow any user update his profile pic', (done) => {
        request(app)
            .patch('/profile')
            .set('Authorization', user_global.token)
            .attach('profile_pic', 'test/routes/new_pic.png')
            .expect(200, done);
    });
});