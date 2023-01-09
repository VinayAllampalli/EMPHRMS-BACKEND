const express = require('express');
const router = express.Router();
const {userRegister} = require('../controllers/Register');
const {CheckedIn} = require('../controllers/checkInOut');
const {login} = require('../controllers/login');
const {getAttedanceFromTo,getAttedance}=require('../controllers/attendance');
const {CompCreation,GetCompany} = require('../controllers/companyCreation');
const {DOB,DOJ}=require('../controllers/occasions');
const {taskCreation,taskstatusUpdate,gettasks}=require('../controllers/taskCreation');


router.post('/register',userRegister);
router.post('/logData/:value/:EmpCode',CheckedIn);
router.post('/login',login);
router.get('/getAttedanceFromTo/:EmpCode',getAttedanceFromTo);
router.get('/getattendance/:EmpCode',getAttedance);
router.post('/Company',CompCreation);
router.get('/getCompany/:Id',GetCompany);
router.get('/DOB/:compId',DOB);
router.get('/DOJ/:compId',DOJ);
router.post('/task/:compId',taskCreation);
router.put('/updatetask/:taskId',taskstatusUpdate);
router.get('/gettask/:EmpCode',gettasks);

module.exports=router;