const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require("multer");
const {userRegister,getEmployeesBasedOnReportingID,getEmployeeData,employeePay,getEarningsOfEmployee,AllEmployees,deleteEmp,empInfo} = require('../controllers/Register');
const {CheckedIn,IN} = require('../controllers/checkInOut');
const {login,adminLogin} = require('../controllers/login');
const {getAttedanceFromTo,getAttedance,getEveryDayAttedance,getAllEmployeesTodayAttedance}=require('../controllers/attendance');
const {CompCreation,GetCompany} = require('../controllers/companyCreation');
const {DOB,DOJ,holidays,getHolidays,getallMasterHolidays,deleteHoliday}=require('../controllers/occasions');
const {taskCreation,taskstatusUpdate,gettasks,getalltaskAssign}=require('../controllers/taskCreation');
const {imageUpload,getImage,getEmpDataWithImage,MasterholidayImageUpload} = require('../controllers/imageUpload');
const {postFeed,getFeed} = require('../controllers/postFeed');
const {earnings} = require('../controllers/earnings');
const {getLeaves,ApplyForLeaves,UpdateLeaveStatus,sendleavesForApproval,getAllmyleaves,leavesGeneration} = require('../controllers/leaves');
const {xml} = require('../controllers/readingxmlfile');
const {forgotPassword,forgotPasswordGenratedOtp} = require('../controllers/forgotPassword');
const {orgTree,dbTables} = require('../controllers/organizationTree');


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
/**
 * @swagger
 * api/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the given details
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/register',userRegister);
router.post('/logData/:value/:EmpCode',CheckedIn);
router.get('/checkIn/:EmpCode',IN);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with employee code and password
 *     description: Login with employee code and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmpCode:
 *                 type: string
 *                 description: Employee code
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Login failed
 */
router.post('/login',login);
router.post("/adminLogin",adminLogin)

/**
 * @swagger
 * /getAttedanceFromTo/{EmpCode}:
 *   get:
 *     summary: Get attendance data of an employee for a specified time period.
 *     parameters:
 *       - in: path
 *         name: EmpCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee code of the employee whose attendance data is to be retrieved.
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *        
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/getAttedanceFromTo/:EmpCode',getAttedanceFromTo);
router.get('/getattendance/:EmpCode/:date',getAttedance);
router.get('/getEveryDayAttedance/:EmpCode',getEveryDayAttedance)
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
router.get('/getFeed/:compId',getFeed);
router.post('/earnings/:compId',earnings);
router.get('/getEarn/:EmpCode',getEarningsOfEmployee);
router.post('/employeePay',employeePay);
router.get('/getLeaves/:EmpCode',getLeaves);
router.post('/appliedleaves/:EmpCode',ApplyForLeaves);
router.get('/sendleavesForApproval/:reportingmangerid',sendleavesForApproval);
router.put('/UpdateLeaveStatus/:leaveid',UpdateLeaveStatus);
router.get('/getmyleaves/:EmpCode',getAllmyleaves);
router.get('/getAllEmp/:compId',AllEmployees);
router.get('/getEmployeeDatawithImage',getEmpDataWithImage);
router.get('/empInfo/:EmpCode',empInfo)
router.delete('/deleteEmp/:EmpCode',deleteEmp);
router.post('/sendOtp',forgotPasswordGenratedOtp);
router.put('/updatePassword/:email/:value',forgotPassword);
router.put('/holidayImageUpload',uploadoptions.single("file"),MasterholidayImageUpload);
router.post('/holidays/:compId',holidays);
router.get('/allHolidays/:year/:compId',getHolidays);
router.post('/leavesgenerate',leavesGeneration);
router.get('/getalltaskAssign/:EmpCode/:companyId',getalltaskAssign);
router.get('/dbtables',dbTables);
router.get('/getallemployeesAttendance/:compId',getAllEmployeesTodayAttedance);
router.get('/getallMasterHolidays',getallMasterHolidays);
router.delete('/deleteHoliday/:compId/:id',deleteHoliday);

// Define Google Sign-In routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/login' }),
  (req, res) => {
    // Redirect to your Angular frontend after successful authentication
    res.redirect('http://localhost:4200/header/dashboard');
  }
);

router.get('/orgList/:compId',orgTree)


module.exports=router;