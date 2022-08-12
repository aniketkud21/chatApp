const express = require('express')
const { default: mongoose } = require('mongoose')
const passport = require('passport')
const router = express.Router()
const utils = require('../lib/utils')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const messageController = require('../controllers/messageController')

// router.get('/', passport.authenticate('jwt',{session:false}), (req,res)=>{
//     res.sendFile('socket.html',{root:'./static'});
//     // res.sendFile('../static/index.html');
// })

router.get('/login',(req,res)=>{
    res.sendFile('login.html', {root:'./static'});
})

router.post('/login',(req,res,next)=>{
    User.findOne({username:req.body.username})
    .then((user)=>{
        if(!user){
            return res.status(401).json({success:false, message:'Cant find user'})
        }
        else{
            const isValid = utils.validPassword(req.body.password, user.hash)

            if(isValid){
                const tokenObject = utils.issueJWT(user)
                res.cookie('jwt', tokenObject.token, {
                    httpOnly:true
                })
                res.status(200).json({success:true, user:user, token:tokenObject.token, expiresIn:tokenObject.expires})
            }
            else{
                res.status(401).json({success:false, message:"Invalid Password"})
            }
        } 
    })
    .catch((err)=>{
        next(err);
    })
})

router.post('/register',(req,res,next)=>{
    User.findOne({username:req.body.username})
    .then((user)=>{
        if(user){
            return res.json({success:false, message:'User already exist'})
        }
        else{
            utils.genSalt()
            .then((salt)=>{
                utils.genPassword(req.body.password, salt)
                .then((hashedPassword)=>{
                    const newuser = new User({
                        username:req.body.username,
                        hash:hashedPassword
                    })

                    try {
                        newuser.save()
                        .then((user) =>{
                            res.json({success:true, user:user})
                        })
                    } catch (error) {
                        res.json({success:true, user:user})
                    }
                })
            })
        }
    })
    .catch((err)=>{
        return res.json({success:false, message:'error'})
    })
})

router.get('/protected', passport.authenticate('jwt',{session:false}), (req,res)=>{
    res.sendFile('socket.html',{root:'./static'});
    //return res.json({success:true, message:"Authorized User"})
})

router.get('/user', passport.authenticate('jwt',{session:false}), (req,res)=>{
    const decodedjwt = jwt.decode(req.cookies['jwt'],{complete:true})
    res.json({user_id:decodedjwt.payload.sub})
})

router.get('/messages', (req,res)=>{
    messageController.getMessages()
    .then((messages)=>{
        console.log(messages)
        res.json({message:messages})
    })
    .catch(err=>{
        console.log(err);
    })
})
 

module.exports=router