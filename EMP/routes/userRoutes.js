const express = require('express');
const router = express.Router();
const multer = require("multer");
const {userRegister,getEmployeesBasedOnReportingID,getEmployeeData} = require('../controllers/Register');
const {CheckedIn} = require('../controllers/checkInOut');
const {login} = require('../controllers/login');
const {getAttedanceFromTo,getAttedance}=require('../controllers/attendance');
const {CompCreation,GetCompany} = require('../controllers/companyCreation');
const {DOB,DOJ}=require('../controllers/occasions');
const {taskCreation,taskstatusUpdate,gettasks}=require('../controllers/taskCreation');
const {imageUpload,getImage} = require('../controllers/imageUpload');
const {postFeed,getFeed} = require('../controllers/postFeed')

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/pdf": "pdf",
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("invalid image type");

        if (isValid) {
            uploadError = null;
        }
        cb(null,"public/uploads");
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        console.log(filename);

        cb(null, `${Date.now()}-${filename}`);
    },
});

const uploadoptions = multer({ storage: storage });
 
router.post('/register',userRegister);
router.post('/logData/:value/:EmpCode',CheckedIn);
router.post('/login',login);
router.get('/getAttedanceFromTo/:EmpCode',getAttedanceFromTo);
router.get('/getattendance/:EmpCode',getAttedance);
router.post('/Company',CompCreation);
router.get('/getCompany/:CompId',GetCompany);
router.get('/DOB/:compId',DOB);
router.get('/DOJ/:compId',DOJ);
router.post('/task/:compId/:Empcode',taskCreation);
router.put('/updatetask/:taskId',taskstatusUpdate);
router.get('/gettask/:EmpCode',gettasks);
router.get('/getempByRID/:EmpCode',getEmployeesBasedOnReportingID);
router.get('/getemp/:EmpCode',getEmployeeData);
router.put('/imageUpload/:EmpCode',uploadoptions.single("file"),imageUpload);
router.get('/getImage/:EmpCode',getImage);
router.post('/PostFeed/:EmpCode',postFeed);
router.get('/getFeed/:compId',getFeed)

module.exports=router;