const client = require('../connections/db');
const Password = require('../utils/password')
const DateFormat = require('../utils/date');
const Earnings = require('../utils/earnings');


exports.userRegister = async (req, res) => {
    console.log("User Registration api is Triggred");
    try {
        const createUsersTabel = `create table if not exists Employees 
        (firstName text not null, lastName text not null, EmpCode VARCHAR(100) primary key not null, email Varchar(100) not null, 
        phoneNo varchar(12) not null, department varchar(100) not null, DOB date not null, DOJ date not null, address varchar(100) not null, gender char(10) not null, password Varchar(100) not null, role varchar(20) ,
        ReportingManager Varchar(100), ReportingMangerID Varchar(10), CompanyId varchar(100),CompanymailId Varchar(100) not null,FatherName varchar(100) not null,AadharNumber varchar(20) not null,PanNumber varchar(20) not null,
        UanNumber varchar(20), bankAccNumber varchar(20) not null, bankName varchar(20), bankIfscCode varchar(10),createdOn date not null )`
        await client.query(createUsersTabel);
        const data = req.body;
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)
        const password = Password.passwordHash(req.body.password);
        const user = await client.query(`select * from Employees where EmpCode ='${data.Empcode}' and email='${data.email}' `);
        console.log("----->", user.rowCount);
        if (user.rowCount > 0) {
            return res.status(200).json({ sucess: true, message: "EmpCode / email is already exits ....!" })
        }
        else {
            const Register = `insert into Employees(firstName,lastName,EmpCode,email,phoneNo,department,DOB,DOJ,address,gender,password,role,ReportingManager,ReportingMangerID,CompanyId,CompanymailId,FatherName,AadharNumber,PanNumber,UanNumber,bankAccNumber,bankName,bankIfscCode,createdOn)
                               values ('${data.firstName}','${data.lastName}','${data.EmpCode}','${data.email}','${data.phoneNo}','${data.department}','${data.DOB}','${data.DOJ}','${data.address}','${data.gender}','${password}','${data.role}','${data.ReportingManager}','${data.ReportingMangerID}','${data.CompanyId}','${data.CompanymailId}','${data.FatherName}','${data.AadharNumber}','${data.PanNumber}','${data.UanNumber}','${data.bankAccNumber}','${data.bankName}','${data.bankIfscCode}','${date}')`
            await client.query(Register, (err, result) => {
                if (!err) {
                    return res.status(200).json({ success: true, message: "Registered Successfully" });
                }
                else {
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err });
                    console.log("---->", err);
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}


exports.getEmployeesBasedOnReportingID = async (req, res) => {
    console.log('get Employees based on Reporting Id ')
    try {
        data = req.params.EmpCode
        let emp = `select * from employees where reportingmangerid = '${data}'`
        await client.query(emp, (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.getEmployeeData = async (req, res) => {
    console.log('Employee Data Api is triggred');
    try {
        let employee = `select * from employees where empcode='${req.params.EmpCode}'`
        await client.query(employee, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                // console.log(result)
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.employeePay = async (req, res) => {
    console.log("employee pay api is triggred")
    try {
        let EmployeePay = `create table if not exists EmployeePay(EmpCode VARCHAR(100) primary key not null, CTC decimal not null,Basic decimal not null,ConveyanceAllowance decimal not null,
                            HRA decimal not null, MedicalAllowance decimal not null, DearnessAllowance decimal not null,specialAllowance decimal not null,
                            EductionAllowance decimal not null,PfEmployee decimal not null,PfEmployer decimal not null,gratuity decimal not null,insurance decimal not null)`

        await client.query(EmployeePay, async err => {
            if (err) {
                console.log(err)
            }
            let empcode = `select * from EmployeePay where EmpCode = '${req.body.EmpCode}'`
            await client.query(empcode, async (err, result) => {
                if (err) {
                    console.log("---.", err)
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                }
                // else if(result.rowCount > 0){
                //     return res.status(200).json({ sucess: true, message: "EmpCode is already exits ....!" })
                // }
                else {
                    let sal = req.body.CTC
                    let pfStatus = req.body.pfStatus;
                    let gratutityStatus = req.body.gratutityStatus;
                    let insuranceStatus = req.body.insuranceStatus;

                    let PfDecution = Earnings.PFdectuction(pfStatus, sal);
                    let PFemployee = PfDecution.pfEmployee;
                    let PFemployer = PfDecution.pfEmployer;

                    let GratuityDecuction = Earnings.Gratutity(gratutityStatus, sal);
                    let InsuranceDecution = Earnings.Insurance(insuranceStatus, sal);

                    let basic = (40 / 100) * sal;
                    let ca = (4 / 100) * sal;
                    let hra = (20 / 100) * sal;
                    let medical = (4 / 100) * sal;
                    let da = (10 / 100) * sal;
                    let Ea = (1 / 100) * sal;
                    let special = (21 / 100) * sal;

                    console.log(req.body)
                    let allDeduction = `insert into EmployeePay(EmpCode,CTC,Basic,ConveyanceAllowance,HRA,MedicalAllowance,DearnessAllowance,EductionAllowance,specialAllowance,PfEmployee,PfEmployer,gratuity,insurance)
                                         values(${req.body.EmpCode},${req.body.CTC},${basic},${ca},${hra},${medical},${da},${Ea},${special},${PFemployee},${PFemployer},${GratuityDecuction},${InsuranceDecution})`

                    await client.query(allDeduction, (err, result) => {
                        if (err) {
                            console.log(">>>>>>", err);
                            res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                        }
                        else {
                            return res.status(200).json({ success: true, message: "Registered Successfully" });
                        }
                    })
                }
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}


exports.getEarningsOfEmployee = async(req,res)=>{
    console.log('Get Earnings Api of Employee is triggred');
    let Data = `SELECT *FROM employeePay
    WHERE empcode = '${req.params.EmpCode}'`
    await client.query(Data,(err,result)=>{
        if(err){
            console.log(err)
            res.status(400).json({ success: false, message: "Somethimg Went wrong " })   
        }
        else {
            res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
        }
    })
}

