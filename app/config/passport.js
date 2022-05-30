const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')


function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
        //login
        //check if email exist
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'User not registered' })
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {

                return done(null, user, { message: 'Logged in successfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })


    }))
    passport.serializeUser((user, done) => {
        done(null, user._id) //userid is stored which confirms user is logged in or not
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
module.exports = init