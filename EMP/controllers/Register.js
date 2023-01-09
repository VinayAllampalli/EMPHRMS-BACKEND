const client = require('../connections/db');
const Password = require('../utils/password')
const DateFormat = require('../utils/date');

exports.userRegister = async(req,res)=>{
    console.log("User Registration api is Triggred");
    try{
        const createUsersTabel = `create table if not exists Employees (firstName text not null, lastName text not null, EmpCode VARCHAR(100) primary key not null, email Varchar(100) not null, phoneNo varchar(12) not null, department varchar(100) not null, DOB date not null, DOJ date not null, address varchar(100) not null, gender char(10) not null, password Varchar(100) not null, role varchar(20) ,ReportingManager Varchar(100), ReportingMangerID Varchar(10), CompanyId varchar(100),FatherName varchar(100) not null,AadharNumber varchar(20) not null,PanNumber varchar(20) not null, UanNumber varchar(20), bankAccNumber varchar(20) not null, bankName varchar(20), bankIfscCode varchar(10),createdOn date not null )`
        await client.query(createUsersTabel);
        const data = req.body;
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)
        const password = Password.passwordHash(req.body.password);
        const user =  await client.query(`select * from Employees where EmpCode ='${data.Empcode}' and email='${data.email}' `);
        console.log("----->",user.rowCount);
        if(user.rowCount>0){
            return res.status(200).json({ sucess: false, message: "EmpCode / email is already exits ....!" })
        }
        else{
            const Register = `insert into Employees(firstName,lastName,EmpCode,email,phoneNo,department,DOB,DOJ,address,gender,password,role,ReportingManager,ReportingMangerID,CompanyId,FatherName,AadharNumber,PanNumber,UanNumber,bankAccNumber,bankName,bankIfscCode,createdOn)
                               values ('${data.firstName}','${data.lastName}','${data.EmpCode}','${data.email}','${data.phoneNo}','${data.department}','${data.DOB}','${data.DOJ}','${data.address}','${data.gender}','${password}','${data.role}','${data.ReportingManager}','${data.ReportingMangerID}','${data.CompanyId}','${data.FatherName}','${data.AadharNumber}','${data.PanNumber}','${data.UanNumber}','${data.bankAccNumber}','${data.bankName}','${data.bankIfscCode}','${date}')` 
            await client.query(Register,(err,result)=>{
                if(!err){
                    return res.status(200).json({ success: true, message: "Registered Successfully" });
                }
                else{
                    res.status(400).json({ success: false, message:"Somethimg Went wrong ", err });
                    console.log("---->", err);
                }
            })            
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({ success: true, message:"Internal Error" });
    }
}