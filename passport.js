const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { connect } = require('./src/models/conn.js');
const User = require("./src/models/User");

async function initialize(passport, getUserByUsername, getUserByID) {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await getUserByUsername(username);
            console.log("TEST ", user);

            if(!user) {
                return done(null, false, { message: 'No user found' });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if(isPasswordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch(error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
    
}

module.exports = initialize;
