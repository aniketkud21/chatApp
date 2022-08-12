const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()
PRIVATE_KEY = process.env.PRIV_KEY

const genSalt = async ()=>{
    const salt = await bcrypt.genSalt(10)
    console.log(PRIVATE_KEY)
    return salt
}
const genPassword = async(password, salt)=>{
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}
const validPassword = async(password, toCheck)=>{
    const isValid = bcrypt.compare(toCheck, password)
    return isValid
}

// function genPassword(password){
//     const salt = bcrypt.genSalt(10)
//     const genhash = bcrypt.hash(password, salt)

//     return {
//         salt:salt,
//         hash:genhash
//     }
// }

// function validPassword(password,hash,salt){
//     const hashverify = bcrypt.hash(password,salt)
//     return hash == hashverify
// }

function issueJWT(user){
    const _id = user._id
    const expiresIn = '1d'

    const payload = {
        sub:_id,
        iat:Date.now()
    }
    //WHICH ALGO TO USE??
    
    const signedToken = jsonwebtoken.sign(payload,PRIVATE_KEY,{expiresIn:expiresIn})

    return {
        token : signedToken,
        expires :expiresIn
    }
}

module.exports.genSalt = genSalt
module.exports.genPassword = genPassword
module.exports.validPassword = validPassword
module.exports.issueJWT = issueJWT