const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
require('dotenv').config()

// const abc = ExtractJwt.fromAuthHeaderAsBearerToken()
// console.log(abc)

// const JWTExtractor = function(){
//     const abc = ExtractJwt.fromAuthHeaderAsBearerToken()
//     console.log(abc)
//     return abc
// }

const cookieExtractor = function(req,res){
    var token=null
    if(req && req.cookies) token = req.cookies['jwt']
    return token
}

const options = {
    jwtFromRequest : cookieExtractor,
    secretOrKey: process.env.PRIV_KEY,
}

module.exports = (passport)=>{
    passport.use(new JwtStrategy(options, (jwt_payload, done)=>{

        User.findOne({_id:jwt_payload.sub})
        .then((user) => {
            if(user){
                return done(null, user)
            }
            else return done(null,false)
        })
        .catch(err => {return done(err, null)}) 
    
    })
    )
}

