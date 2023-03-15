const client = require('../connections/db');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');


exports.CheckingForProbition = async (req, res) => {
    try {
        let employee = `select empcode,probitiondate from employees  where probitionstatus = 'Inprogress'`
        await client.query(employee, async (err, result) => {
            for (let i = 0; i < result.rows.length; i++) {
                const today = new Date();
                let data = result.rows[i]
                console.log(data.probitiondate)
                if (today >= data.probitiondate) {
                    let updateProbitionStatus = `UPDATE employees
                    SET probitionstatus = 'Completed'`
                    await client.query(updateProbitionStatus, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: true, message: "Something Went wrong " });
                        }
                        else {
                            // res({ success: true, message: "Update SUccessFully" });  
                            console.log("ok")
                        }
                    })
                }
                else {
                    console.log("No data to update")
                }

            }
        })

    }
    catch (err) {
        console.log(err)
    }
}


exports.leavesGeneration = async (req, res) => {
    console.log("leavesGeneration Api is triggered");
    try {
        const leavesTable = `create table if not exists leaves(EmpCode VARCHAR(100) primary key not null,CasualLeaves decimal ,SickLeave decimal)`
        await client.query(leavesTable)

        const checkProbition = `select empcode,probitiondate from employees where probitionstatus = 'Completed'`
        const resultArray = [];

        await client.query(checkProbition, async (err, result) => {
            if (err) {
                console.log(err);
                //   res.status(400).json({ success: false, message: "Something Went wrong " });
            } else {
                console.log(result.rows);

                for (let i = 0; i < result.rows.length; i++) {
                    const { empcode, probitiondate } = result.rows[i];
                    const probationEndDate = probitiondate;
                    console.log(probationEndDate);
                    const today = new Date();
                    if (today >= probationEndDate) {
                        console.log(empcode);
                        const queryLeaves = `INSERT INTO leaves (empCode, casualleaves, sickleave) 
              VALUES ('${empcode}', 1, 0.5)
              ON CONFLICT (empCode) DO UPDATE SET 
              casualleaves = leaves.casualleaves + 1,
              sickleave = leaves.sickleave + 0.5`

                        try {
                            const res = await client.query(queryLeaves);
                            // console.log(res.rows);
                            resultArray.push(res.rows);

                        } catch (error) {
                            console.log(error);
                            // res.status(400).json({ success: false, message: "Something Went wrong " });
                        }
                    }
                }
                //   res.status(200).json({ success: true, message: "Data get successfully", result: resultArray });
            }
        });setInterval(async () => {
            console.log("Checking if today is the first day of the month");
            const today = new Date();
            if (today.getDate() === 1) { // Check if it's the first day of the month
              console.log("Today is the first day of the month, triggering leavesGeneration function");
              await leavesGeneration();
            } else {
              console.log("Today is not the first day of the month");
            }
          }, 24 * 60 * 60 * 1000);


    } catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.getLeaves = async (req, res) => {
    console.log("Get leaves api is triggred")
    try {
        const code = req.params.EmpCode
        const leavesData = `select * from leaves where empcode='${code}'`
        await client.query(leavesData, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Something went Wrong" });
            }
            else {
                res.json({ sucess: true, result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.UpdateLeaveStatus = async (req,res)=>{
    console.log('Update leave status api is triggred')
    try{
        let data = req.body.action
        
        console.log("-->",data)
        if(data=='Approve'){
            let UpdataStatusApproved = `UPDATE leavesapplied SET status = 'Approved' where leaveid='${req.params.leaveid}'`
            await client.query(UpdataStatusApproved,(err,result)=>{
                if (err) {
                    console.log(err)
                    res.status(400).json({ success: false, message: "Something Went wrong " });
                }
                else {
                    return res.status(200).json({ success: true, message: "Update Successfully" });
                }
            })
        }
        else if(data=='Reject'){
            let UpdataStatusReject = `UPDATE leavesapplied SET status='Reject' where leaveid='${req.params.leaveid}'`
            await client.query(UpdataStatusReject,(err,result)=>{
                if (err) {
                    console.log(err)
                    res.status(400).json({ success: false, message: "Something Went wrong " });
                }
                else {
                    return res.status(200).json({ success: true, message: "Rejected" });
                }
            })
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.ApplyForLeaves = async (req, res) => {
    console.log("Apply for leaves api is triggred")
    try {
        let appliedLeavesTable = `create table if not exists leavesapplied(leaveId Varchar(100) not null,EmpCode VARCHAR(100) not null,reportingmangerid varchar not null,typeOfleave varchar not null, totalDays decimal not null,fromDate date not null,toDate date not null, note varchar(100), status text not null)`
        await client.query(appliedLeavesTable, (err) => {
            console.log(err)
        })
        let getleave = `select * from leaves where empcode = '${req.params.EmpCode}'`
        await client.query(getleave, async (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                let records = result.rows
                for (let i = 0; i < records.length; i++) {
                    let totalCL = records[i].casualleaves
                    let totalSL = records[i].sickleave
                    console.log(totalCL, totalSL)
                    console.log(req.body)
                    let objstartDate = moment(req.body.startDate).format('DD/MMM/YYYY');
                    let objendDate = moment(req.body.endDate).format('DD/MMM/YYYY');
                    let getReportingManagerID = `select reportingmangerid from employees where empcode = '${req.params.EmpCode}'`
                    let RM = await client.query(getReportingManagerID)
                    let reportingManagerID = RM.rows[0].reportingmangerid;
                    let leaveIdString = 'L' + uuidv4().slice(0, 5);
                    if (req.body.typeofleave == 'CasualLeave' && req.body.totalDays <= totalCL) {
                        let subCasualLeave = `UPDATE leaves SET casualleaves = casualleaves - ${req.body.totalDays} WHERE empcode = '${req.params.EmpCode}'`
                        await client.query(subCasualLeave, async (err) => {
                            if (err) {
                                console.log(err)
                                res.status(400).json({ success: false, message: "Something Went wrong " });
                            }
                            else if( req.body.totalDays > totalCL){
                                res.status(200).json({ success: true, message: "You have less leaves..." });
                            }
                            else {
                               
                                let updatetable = `INSERT INTO leavesapplied (leaveId,empCode,reportingmangerid, typeOfleave, totalDays,fromDate,toDate,note,status) 
                                values('${leaveIdString}','${req.params.EmpCode}','${reportingManagerID}','${req.body.typeofleave}',${req.body.totalDays},'${objstartDate}','${objendDate}','${req.body.note}','Pending')`
                                await client.query(updatetable)
                                res.status(200).json({ success: true, message: "Leave applied Sucessfully" });
                            }
                        })


                    }
                    else if (req.body.typeofleave == 'SickLeave' && req.body.totalDays <= totalSL) {
                        let subSickLeave = `UPDATE leaves SET sickleave = sickleave - ${req.body.totalDays} WHERE empcode = '${req.params.EmpCode}'`
                        await client.query(subSickLeave, async (err) => {
                            if (err) {
                                console.log(err)
                                res.status(400).json({ success: false, message: "Something Went wrong " });
                            }
                            else if(req.body.totalDays > totalSL){
                                res.status(200).json({ success: true, message: "You have less leaves..." });
                            }
                            else {
                                let updatetable = `INSERT INTO leavesapplied (leaveId,empCode, reportingmangerid,typeOfleave, totalDays,fromDate,toDate,note,status) 
                                values('${leaveIdString}','${req.params.EmpCode}','${reportingManagerID}','${req.body.typeofleave}',${req.body.totalDays},'${objstartDate}','${objendDate}','${req.body.note}','Pending')`
                                await client.query(updatetable)
                                res.status(200).json({ success: true, message: "Leave applied Sucessfully" });
                            }
                            
                        })
                    }
                    else if (req.body.typeofleave == 'PaidLeave') {
                        let updatetable = `INSERT INTO leavesapplied (leaveId,empCode, reportingmangerid,typeOfleave, totalDays,fromDate,toDate,note,status) 
                        values('${leaveIdString}','${req.params.EmpCode}','${reportingManagerID}','${req.body.typeofleave}',${req.body.totalDays},'${objstartDate}','${objendDate}','${req.body.note}','Pending')`
                        await client.query(updatetable)
                        res.status(200).json({ success: true, message: "Leave applied Sucessfully" });
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.sendleavesForApproval = async (req, res) => {
    console.log('Approval for leaves api is triggered')
    try {
        let getData = `select * from leavesapplied where reportingmangerid='${req.params.reportingmangerid}' and status = 'Pending' `
        await client.query(getData, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Something Went wrong " });
            }
            else {
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}


exports.getAllmyleaves = async(req,res)=>{
    console.log('Get All my leaves api is  triggered')
    try{
        let allMyleaves = `select * from leavesapplied where empcode = '${req.params.EmpCode}'`
        await client.query(allMyleaves,(err,result)=>{
            if(err){
                console.log(err)
                res.status(400).json({ success: false, message: "Something Went wrong " }); 
            }
            else{
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });   
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

