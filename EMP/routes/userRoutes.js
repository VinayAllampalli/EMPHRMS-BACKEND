const express = require('express');
const router = express.Router();
const {userRegister} = require('../controllers/Register');
const {CheckedIn} = require('../controllers/checkInOut');
const {login} = require('../controllers/login')


router.post('/register',userRegister);
router.post('/logData/:value/:EmpCode',CheckedIn);
router.post('/login',login)

module.exports=router;