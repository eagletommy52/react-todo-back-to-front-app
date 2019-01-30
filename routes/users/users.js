var express = require('express');
var router = express.Router();
const userController = require('./controller/userController');
const validateLoginInput = require('../utils/validations/register');
const passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', (req, res)=>{
  let {errors, isValid} = validateLoginInput(req.body);
  
  if(!isValid) {
    return res.status(400).json(errors)
  } else {
      userController.login(req.body)
        .then(success=>{
          console.log('success!')
          res.json(success)
        })
        .catch(err=>{
          console.log('oh no that isn\'t a registered user!')
          userController.register(req.body)
          .then(user=>{
            userController.login(req.body)
            .then(success=>{
              console.log('success!')
              res.json(success)
            })
          })

        })
  }
})

router.get('/currentUser', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  console.log(req.user)
  res.json(req.user)
})

router.get('/test', (req,res,next)=>{
  res.json(['You hit me!'])
})


module.exports = router;
