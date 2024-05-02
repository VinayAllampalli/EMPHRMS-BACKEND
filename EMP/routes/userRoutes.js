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
const {taskCreation,taskstatusUpdate,getalltaskAssign,getTaskDataAndOverallStatusForYear,createProject,getallProjects,updateTask,deleteTask}=require('../controllers/taskCreation');
const {imageUpload,getImage,getEmpDataWithImage,MasterholidayImageUpload} = require('../controllers/imageUpload');
const {postFeed,getFeed} = require('../controllers/postFeed');
const {earnings} = require('../controllers/earnings');
const {getLeaves,ApplyForLeaves,UpdateLeaveStatus,sendleavesForApproval,getAllmyleaves,leavesGeneration} = require('../controllers/leaves');
const {xml} = require('../controllers/readingxmlfile');
const {forgotPassword,forgotPasswordGenratedOtp} = require('../controllers/forgotPassword');
const {orgTree,dbTables} = require('../controllers/organizationTree');
const {busyConnection} = require('../controllers/busy');
const {chatBot} = require('../controllers/chatbot');
const {locking} = require('../controllers/locking');
const {nodecorn} = require('../controllers/nodecorn');
const cron = require('node-cron');
const { authenticateToken } = require('../middleware/auth');


const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/pdf": "pdf"
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

// login,signup,forgotPasscode endpoints
router.post('/register',userRegister);
router.post('/login',login);
router.post("/adminLogin",adminLogin);
router.put('/updatePassword/:email/:value',forgotPassword);
router.post('/sendOtp',forgotPasswordGenratedOtp);

// check-In/Out and Attedance endpoints
router.post('/logData/:value/:EmpCode',CheckedIn);
router.get('/checkIn/:EmpCode',IN);
router.get('/getAttedanceFromTo/:task',getAttedanceFromTo);
router.get('/getattendance/:EmpCode/:date',getAttedance);
router.get('/getEveryDayAttedance/:EmpCode',getEveryDayAttedance);
router.get('/getallemployeesAttendance/:compId',getAllEmployeesTodayAttedance);

// Company endpoints
router.post('/Company',CompCreation);
router.get('/getCompany/:CompId',GetCompany);

//Task endpoints

// for the below api i use both params and query parameters so in post man pass this url 
// http://localhost:3000/api/getTaskDataAndOverallStatusForYear/6078?CompanyId=cabc3f96-aa84-44a7-99d8-818a3a0b5128&Year=2023
router.get('/getTaskDataAndOverallStatusForYear/:EmpCode',getTaskDataAndOverallStatusForYear);
router.post('/createTask',uploadoptions.single("file"),taskCreation);
router.put('/updateTask',updateTask);
router.delete('/deleteTask',deleteTask);
router.get('/getalltaskAssign/:EmpCode/:companyId/:value',getalltaskAssign);
router.put('/updatetask/:taskId/:taskstatus',taskstatusUpdate);

// Leaves endpoints
router.post('/leavesgenerate',leavesGeneration);
router.get('/getLeaves/:EmpCode',getLeaves);
router.post('/appliedleaves/:EmpCode',ApplyForLeaves);
router.get('/sendleavesForApproval/:reportingmangerid',sendleavesForApproval);
router.put('/UpdateLeaveStatus/:leaveid',UpdateLeaveStatus);
router.get('/getmyleaves/:EmpCode',getAllmyleaves);

// holidays enpoints
router.put('/holidayImageUpload',uploadoptions.single("file"),MasterholidayImageUpload);
router.post('/holidays/:compId',holidays);
router.get('/allHolidays/:year/:compId',authenticateToken,getHolidays);
router.get('/getallMasterHolidays',getallMasterHolidays);
router.delete('/deleteHoliday/:compId/:id',deleteHoliday);

// employee endpoints
router.get('/getempByRID/:EmpCode',getEmployeesBasedOnReportingID);
router.get('/getemp/:EmpCode',getEmployeeData);
router.put('/imageUpload/:EmpCode',uploadoptions.single("file"),imageUpload);
router.get('/getImage/:EmpCode',getImage);
router.get('/getAllEmp/:compId',AllEmployees);
router.get('/getEmployeeDatawithImage',getEmpDataWithImage);
router.get('/empInfo/:EmpCode',empInfo);
router.delete('/deleteEmp/:EmpCode',deleteEmp);
// earnings
router.post('/earnings/:compId',earnings);
router.get('/getEarn/:EmpCode',getEarningsOfEmployee);
router.post('/employeePay',employeePay);

// project creation endpoints
router.post('/createProject',createProject);
/**
 * @swagger
 * /api/allProjects:
 *   get:
 *     summary: Get all projects for a company
 *     description: Retrieve all projects belonging to a specific company.
 *     parameters:
 *       - in: query
 *         name: CompanyId
 *         required: true
 *         description: ID of the company to get projects for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Something went wrong.
 *     tags:
 *       - Projects
 */
router.get('/allProjects',getallProjects);

// others endpoints
router.get('/DOB/:compId',DOB);
router.get('/DOJ/:compId',DOJ);
router.post('/PostFeed/:EmpCode',postFeed);
router.get('/getFeed/:compId',getFeed);
router.get('/dbtables',dbTables);
router.get('/orgList/:compId',orgTree);
router.post('/lock',locking)

// chatBot EndPoints
router.post('/replychatBot',chatBot);

// node corn EndPoints
cron.schedule('59 59 * * * *', () => {
    // You can call the function directly here if needed
    testing_nodecorn();
  });

// passport js for 3 parties logins for our application
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

// router.get('/BUSY',busyConnection)

module.exports=router;