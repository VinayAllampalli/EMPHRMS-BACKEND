const client = require('../connections/db');
const uuid = require('uuid');
const DateFormat = require('../utils/date');

exports.earnings = async(req,res)=>{
    console.log("earnings Api is  triggred");
    try{
        const UUID = uuid.v4();
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)

        let EarningsTable = `create table if not exists employeesEarnings(
            id varchar(100) not null,
            empCode varchar(10) not null,
            companyId varchar(50) not null,
            totalCtcPerMonth int not null,
            basic int not null,
            convencyAllowance int not null,
            HRA int not null,
            medicalAllowance int not null,
            dearnessAllowance int not null,
            educationAllowance int not null,
            splAllowance int not null,
            pfEmployee int ,
            pfEmployer int ,
            insurance int ,
            gratuity int ,
            esi int ,
            createdOn date not null 
            )`
            await client.query(EarningsTable,(err)=>{
                console.log(err)
            })
            let employeeCode = `select * from employeesEarnings where empCode = '${req.body.EmpCode}'`
            await client.query(employeeCode,async (err,result)=>{
                if(err){
                    console.log(err)
                    res.status(400).json({ success: false, message: "Somethimg Went wrong " })
                }
                else if(result.rowCount>0){
                    return res.status(200).json({ sucess: false, message: "Employee is already exits" })
                }
                else{
                    console.log(req.body.EmpCode)
                    let InsertData = `insert into employeesEarnings(id,EmpCode,companyId,totalCtcPerMonth,basic,convencyAllowance,HRA,medicalAllowance,dearnessAllowance,
                        educationAllowance,splAllowance,pfEmployee,pfEmployer,insurance,gratuity,esi,createdOn) 
                        values('${UUID}','${req.body.EmpCode}','${req.params.compId}','${req.body.totalCtcPerMonth}','${req.body.basic}',
                        '${req.body.convencyAllowance}','${req.body.HRA}','${req.body.medicalAllowance}','${req.body.dearnessAllowance}','${req.body.educationAllowance}',
                        '${req.body.splAllowance}','${req.body.pfEmployee}','${req.body.pfEmployer}','${req.body.insurance}','${req.body.gratuity}','${req.body.esi}','${date}')`
                    await client.query(InsertData,(err)=>{
                        if(err){
                        console.log(err);
                        res.status(400).json({ success: false, message: "Somethimg Went wrong " })
                        }
                        else{
                            return res.status(200).json({ sucess: true, message: "Data insert Successfully" })
                        }
                    })
                }
            })
    }
    catch(err){
        console.log(err)
        res.status(400).json({ success: false, message:"Internal Error" })
    }
}

