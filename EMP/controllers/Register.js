const client = require('../connections/db');
const Password = require('../utils/password')

exports.userRegister = async(req,res)=>{
    console.log("User Registration api is Triggred");
    try{
        const createUsersTabel = `create table if not exists Employees (firstName text not null, lastName text not null, EmpCode VARCHAR(50) primary key not null, email Varchar(50) not null, phoneNo varchar(12) not null, department varchar(50) not null, DOB varchar(50) not null, DOJ varchar(50), address varchar(50) not null, gender char(10) not null, password Varchar(100) not null)`
        await client.query(createUsersTabel) ;
        const data = req.body;
        const password = Password.passwordHash(req.body.password)
        const user =  await client.query(`select * from Employees where EmpCode ='${data.Empcode}' and email='${data.email}' `)
        console.log("----->",user.rowCount)
        if(user.rowCount>0){
            return res.status(400).json({ sucess: false, menubar: "EmpCode / email is already exits ....!" })
        }
        else{
            const Register = `insert into Employees(firstName,lastName,EmpCode,email,phoneNo,department,DOB,DOJ,address,gender,password)
                               values ('${data.firstName}','${data.lastName}','${data.EmpCode}','${data.email}','${data.phoneNo}','${data.department}','${data.DOB}','${data.DOJ}','${data.address}','${data.gender}','${password}')` 
            await client.query(Register,(err,result)=>{
                if(!err){
                    return res.status(200).json({ success: true, message: "Registered Successfully" })
                }
                else{
                    res.status(400).json({ success: false, message:"Somethimg Went wrong ", err })
                    console.log("---->", err)
                }
            })            
        }
    }

    catch(err){
        console.log(err)
        res.status(400).json({ success: true, message:"Internal Error" })
    }
}