var express = require('express');
var router = express.Router();
const userHandler = require("../models/handleUsers"); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {       // display register route
    res.render('login', {                       // display register form view
        title: 'nodeAuthDemo User Login'        // input data to view
    });
});
router.post('/login', async function(req, res) {// new user post route
  let rc = await userHandler.verifyUser(req); // verify credentials
  console.log(rc);
  if (rc) {
      res.render('index', { //user is there
        subtitle: 'Home',
          loggedin: true,
          who: "Hello " + req.session.user
      });
  } else { //user not there
      res.render('login', {
        subtitle: 'User Login',
          loggedin: false,
          wrong:  'email or password is incorrect' 
      });
  }
});

module.exports = router;
