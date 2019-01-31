const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


module.exports = {
  loginOrRegister: params => {
    const {email, password} = params;
    console.log('Hello:' + email + '  ' + password)
    return new Promise ((res, rej)=>{
      User.findOne({email})
        .then(user=>{
          if(!user){
            if(!validator.isEmail(email)){
              let errors = {};
                  errors.reason = "Email not valid.";
                  errors.error = true;
                  console.log(errors)
                  return reject(errors);
            }
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
                        .then(user => {
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
                        })
                        .catch(err=> rej(err));
                      } )
              }
            })
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
                  errors.reason = "Password incorrect";
                  errors.error = true;
                  rej(errors)
              }
              })
          }

        })
    })
  }
}