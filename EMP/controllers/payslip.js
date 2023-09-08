const client = require('../connections/db');
exports.payslip = async (req,res)=>{
    console.log("payslip api is triggered ")
    try{

        
    }
    catch(err){
        console.log(err)
        res.status(500).json({sucess: true,message:"Internal Error"})
    }
}