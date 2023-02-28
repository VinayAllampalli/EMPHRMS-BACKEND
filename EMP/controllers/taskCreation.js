const client = require('../connections/db');
const DateFormat = require('../utils/date');
const moment = require('moment')
exports.taskCreation = async (req, res) => {
    console.log("Task Creation Api is triggred");
    try {
        // for this sequence query refer https://medium.com/knoldus/how-to-create-auto-incremented-alphanumeric-id-in-postgres-2851d903ce3e
        // Note : for this table we have to excecute this comment code first after that we can insert data or otherwise it won't work 
        // const taskTable = `CREATE SEQUENCE all_seq;
        // SELECT setval('all_seq',100);
        // CREATE TABLE if not exists ALLTASK(
        // taskId text CHECK (taskId ~ '^TS[0-9]+$') DEFAULT 'TS' || nextval('my_seq'),
        // userEmpCode varchar(50) not null, taskDescription text not null, startDate date not null, endDate date not null, assignedBy varchar(100) not null, assignedDate date not null, companyId varchar(100) not null, status text not null,assignedName varchar(100) )`

        // await client.query(taskTable);

        const data3 = req.body
        console.log('---->', data3)
        console.log(req.params)
        for(let j=0;j<data3.length;j++){
            let obj = data3[j]
            // console.log('obj',obj)
            let objstartDate = moment(data3[j].startDate).format('DD/MMM/YYYY');
            // console.log(objstartDate)
            let objendDate = moment(data3[j].endDate).format('DD/MMM/YYYY');
            // console.log(objendDate)
            const TimeStamp = Date.now();
            const dateObject = new Date(TimeStamp);
            const date1 = DateFormat.dateCreation(dateObject)
            const taskcreation = `insert into ALLTASK(userEmpCode,taskDescription,startDate,endDate,assignedBy,assignedDate,companyId,status,assignedName)
                               values('${obj.userEmpCode}','${obj.taskDescription}','${objstartDate}','${objendDate}','${req.params.Empcode}','${date1}','${req.params.compId}','${obj.status}',(SELECT firstname FROM employees WHERE EmpCode = '${req.params.Empcode}')) `

            await client.query(taskcreation, async (err) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "Somethimg Went wrong" });
                }
                else {
                    return res.status(200).json({ success: true, message: "Task created Successfully" });
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.taskstatusUpdate = async (req, res) => {
    console.log("Task Status Update triggred");
 console.log(req.body)
    try {
        let update = `update alltask set status='Done' where taskId='${req.params.taskId}'`
        await client.query(update, (err) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong " });
            }
            else {
                return res.status(200).json({ success: true, message: "Update Successfully" });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}
exports.gettasks = async (req, res) => {
    console.log("get Task based on userId/Empcode api triggred");
    try {
        console.log(req.params.EmpCode)
        let GetTask = `select * from alltask where (userempcode='${req.params.EmpCode}' and status='Todo' or status = 'Inprogress')`;
        await client.query(GetTask, (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong " });
            }
            else {
                return res.status(200).json({ success: true, message: "Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

