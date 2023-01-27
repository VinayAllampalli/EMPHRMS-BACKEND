 const client = require('../connections/db');
 exports.DOB = async(req,res)=>{
    console.log("Today Birthday Api is triggred");
    try{
        let DOB = `select * from employees where CompanyId='${req.params.compId}' and 
        EXTRACT(day from dob) = EXTRACT(day from now()) and EXTRACT(month from dob) = EXTRACT(month from now())`
        await client.query(DOB,(err,result)=>{
            if(err){
                console.log(err);
                res.status(400).json({ success: false, message:"Somethimg Went wrong "});
            }
            else{
                res.status(200).json({success:true, message:"Data get successfully",result:result.rows});
                // console.log(result);
            }
        })
    }catch(err){
        console.log(err);
        res.status(400).json({ success: true, message:"Internal Error" });
    }
 }


 exports.DOJ = async(req,res)=>{
    console.log("working annviersy Api is triggred");
    try{
        let DOJ = `select * from employees where CompanyId='${req.params.compId}' and 
        EXTRACT(day from doj) = EXTRACT(day from now()) and EXTRACT(month from doj) = EXTRACT(month from now())`
        await client.query(DOJ,(err,result)=>{
            if(err){
                console.log(err);
                res.status(400).json({ success: false, message:"Somethimg Went wrong "});
            }
            else{
                res.status(200).json({success:true, message:"Data get successfully",result:result.rows});
                console.log(result);
            }
        })
    }catch(err){
        console.log(err);
        res.status(400).json({ success: true, message:"Internal Error" });
    }
}


