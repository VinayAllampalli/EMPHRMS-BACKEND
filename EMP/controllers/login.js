const e = require('express');
const client = require('../connections/db');
const password = require('../utils/password')
exports.login=async(req,res)=>{
    console.log("Login Api is triggred");
    try{
    const loginApi = `Select * from employees where EmpCode='${req.body.EmpCode}'`
    await client.query(loginApi,async (err,user)=>{
        if(err){
            console.log(err);
            res.status(400).json({ success: false, message:"Somethimg Went wrong "})
        }
        else if(!user){
            res.status(400).json({ success: false, message: 'Please enter registered Employee Code!' })
        }
        else{
            const X = user.rows
            for (let i = 0; i < X.length; i++) {  
            const pass = X[i].password
            const check = await password.passwordCompare(req.body.password, pass);
            if(check==true){
                res.status(200).json({ success: true,message:"Login successfully" })
                    } 
                    else {
                        res.status(400).json({ success: false, message: 'Please check your password!' });
                    }
        }
    }
    }) 

}
catch (err) {
    console.log(err)
    res.status(400).json({ success: true, message:"Internal Error" })
}
}
