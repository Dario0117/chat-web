const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { getUserByID } = require('./models/user.model');
require('dotenv').config();

module.exports = () => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        getUserByID(jwt_payload.id)
            .then((result) => {
                return done(null, result);
            })
            .catch(() => {
                return done(null, false);
            });
    }));
};