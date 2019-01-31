var express = require('express');
var router = express.Router();
const userController = require('./controller/userController');
const validateLoginInput = require('../utils/validations/register');
const passport = require('passport');

router.post('/login', (req, res)=>{
  let {errors, isValid} = validateLoginInput(req.body);
  
  if(!isValid) {
    return res.status(400).json(errors)
  } else {
      userController.loginOrRegister(req.body)
        .then(success=>{
          console.log('success!')
          res.json(success)
        })
        .catch(err=>{
          console.log(err)
          res.json(err)
        })
  }
})


module.exports = router;
