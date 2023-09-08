const client = require('../connections/db')
const moment = require('moment')
exports.getAttedanceFromTo = async (req, res) => {
    console.log('Get Attedance Api is triggred');
    try {
        let data = req.body
        const Attedance = `select * from task where empcode='${req.params.EmpCode}' and log_date between '${data.fromDate}' and '${data.toDate}'`
        await client.query(Attedance, (err, result) => {
            if (err) {
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
            else {
                res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}

exports.getAttedance = async (req, res) => {
    console.log("Get Attendance api triggred");

    console.log(req.params)

    try {
        const dateObject = new Date(req.params.date);
        console.log(dateObject)
        const MONTH = dateObject.getMonth() + 1;
        const YEAR = dateObject.getFullYear();
        console.log(MONTH);
        console.log(YEAR)
        const Data = `SELECT * FROM logdata WHERE empcode = '${req.params.EmpCode}' and EXTRACT(MONTH FROM log_date) = '${MONTH}' and EXTRACT(YEAR FROM log_date) = '${YEAR}'`
        await client.query(Data, (err, result) => {
            if (err) {
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
            else {
                console.log("---->", result)
                res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}

exports.getEveryDayAttedance = async (req, res) => {
    try {
        console.log('Get Every Day Attedance api is triggred');
        let offset = 0;
        let limit = 2;
        await client.query(`SELECT * FROM logData WHERE empcode = '${req.params.EmpCode}'
      LIMIT $1
      OFFSET $2
    `, [limit, offset], (err, result) => {
            offset += limit
            if (err) {
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
            else {
                console.log("---->", result)
                res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.getAllEmployeesTodayAttedance = async (req, res) => {
    console.log("Get all employees today Attedance")
    try {
        let todayDate = moment(new Date()).format('YYYY-MM-DD');
        let allEmployees = `select count(*) from employees where companyid = '${req.params.compId}'`
        let data = await client.query(allEmployees)
        let todayPresentEmployees = `SELECT t1.*, t2.firstname 
        FROM logdata t1 
        JOIN employees t2 ON t1.empcode = t2.empcode
        WHERE t2.companyid = '${req.params.compId}' and t1.log_date = '${todayDate}'`
        let result = await client.query(todayPresentEmployees);
        const todayAbsentEmployees = `select t2.empcode,t2.firstname from employees t2 where t2.companyid = '${req.params.compId}' 
        and empcode not in (select t1.empcode from logdata t1 where t1.log_date = '${todayDate}');`
        let result1 = await client.query(todayAbsentEmployees)
        res.status(200).json({ 'totalemployees': data.rows, 'presentEmp': result.rows,'absentEmp':result1.rows})
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred." });
    }
}
