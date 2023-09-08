const client = require('../connections/db');
const uuid = require('uuid');
const DateFormat = require('../utils/date');
const Password = require('../utils/password');
exports.CompCreation = async (req, res) => {
    console.log("Company Creation api triggred");
    try {

        const UUID = uuid.v4()
        const data = req.body
        console.log(data)
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)

        let Company = await client.query(`select * from company where companybranch='${data.companyBranch}' and companymailid='${data.companyMailId}'`);
        console.log("///", Company.rowCount)
        if (Company.rowCount > 0) {
            console.log(">>")
            return res.status(400).json({ sucess: false, message: "Company Name / Company email is already exits ....!" })
        }
        else {
            const password = Password.passwordHash(req.body.adminPassword);
            const CompanyData = `insert into company(companyId,companyName,companyMailId,companyPhoneNo,companyAddress,companyBranch,createdOn,adminname,adminphonenumber,adminemailid,adminpassword) 
                                 values('${UUID}','${data.companyName}','${data.companyMailId}','${data.companyPhoneNo}','${data.companyAddress}','${data.companyBranch}','${date}','${data.adminName}','${data.adminphnNo}','${data.adminMailId}','${password}')`
            await client.query(CompanyData, (err) => {
                if (!err) {
                    res.status(200).json({ success: true, message: "Company created Successfully" })
                }
                else {
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                    console.log(err)
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
    console.log(req.params.CompId)
    try {
        const CompanyId = `Select * from company where companyid='${req.params.CompId}'`
        await client.query(CompanyId, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong " })
            }
            else {
                // console.log(result)
                res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}