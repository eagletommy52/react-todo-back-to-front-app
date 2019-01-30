const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


module.exports = {
  register: params => {
    return new Promise((resolve, reject)=> {
      if(!validator.isEmail(params.email)){
        let errors = {};
            errors.email = "Email not valid.";
            errors.status = 400;
            console.log(errors)
            return reject(errors);
      }
      User.findOne({email: params.email})
        .then(user => {
          if(user) {
            let errors = {};
            errors.email = "Email already exists.";
            errors.status = 400;
            console.log(errors)
            return reject(errors);
          } else {
            const newUser = new User({
              email: params.email,
              password: params.password
            });
            bcrypt.genSalt(15, (err, salt)=>{
              if(err){
                throw err;
              } else {
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                  newUser.password = hash;
                  newUser
                  .save()
                  .then(user => resolve(user))
                  .catch(err=> reject(err));
                } )
              }
            })
        }
      })
    })
  },
  login: params => {
    const {email, password} = params;
    console.log('Hello:' + email + '  ' + password)
    return new Promise ((res, rej)=>{
      User.findOne({email})
        .then(user=>{
          if(!user){
            let errors = {}
            errors.email = "Username and password not correct";
            errors.status = "400";
            rej(errors);
          } else {
            bcrypt
              .compare(password, user.password)
              .then(isMatch=>{
                if(isMatch) {
                  const payload = {
                    id: user._id,
                    email: user.email,
                  }
                  jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: 3600}, 
                    (err, token) => {
                    if (err) {
                        rej(err);
                    } else {
                        let success = {};
                        success.confirmation = true;
                        success.token = "Bearer " + token;
                        res(success);
                    }
                })
                } else {
                  let errors = {};
                  errors.password = "Password incorrect";
                  errors.status = 400;
                  rej(errors)
              }
              })
          }

        })
    })
  }
}