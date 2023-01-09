const client = require('../connections/db');
const uuid = require('uuid');
const DateFormat = require('../utils/date');
exports.CompCreation = async (req, res) => {
    console.log("Company Creation api triggred");
    try {
        const UUID = uuid.v4()
        const data = req.body
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)
        let companyTable = `create TABLE if not exists company(companyId varchar(100) not null, companyName varchar(100) not null, companyMailId varchar(100) not null, companyPhoneNo varchar(100) not null, companyAddress varchar(100) not null, companyBranch varchar(100) not null,createdOn date not null)`
        await client.query(companyTable, (err) => {
            console.log("--->", err)
        })

        let Company = await client.query(`select * from company where companyName='${data.companyBranch}' and companyMailId='${data.companyMailId}'`)
        if (Company.rowCount > 0) {
            return res.status(200).json({ sucess: false, message: "Company Name / Company email is already exits ....!" })
        }
        else {
            const CompanyData = `insert into company(companyId,companyName,companyMailId,companyPhoneNo,companyAddress,companyBranch,createdOn)
                                 values('${UUID}','${data.companyName}','${data.companyMailId}','${data.companyPhoneNo}','${data.companyAddress}','${data.companyBranch}','${date}')`
            await client.query(CompanyData, (err, result) => {
                if (!err) {
                    return res.status(200).json({ success: true, message: "Company Registered Successfully" })
                }
                else {
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                    console.log("---->", err)
                }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" })
    }
}

exports.GetCompany = async (req, res) => {
    console.log("Get Company Api is Triggred");
    try {
        const CompanyId = `Select * from employees where EmpCode='${req.body.Id}'`
        await client.query(CompanyId, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong " })
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