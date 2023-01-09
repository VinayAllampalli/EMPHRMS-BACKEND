const client = require('../connections/db')
exports.getAttedanceFromTo = async (req,res)=>{
    console.log('Get Attedance Api is triggred');
    try{
        let data = req.body
        const Attedance = `select * from task where empcode='${req.params.EmpCode}' and log_date between '${data.fromDate}' and '${data.toDate}'`
        await client.query(Attedance,(err,result)=>{
            if(err){
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
            else{
                res.status(200).json({ success: true, message: "Data get successfully",result:result.rows })
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({ success: false, message:"Internal Error" })
    }
}

exports.getAttedance= async(req,res)=>{
    console.log("Get Attendance api triggred");
    console.log(req.body)
    try{
        const Data = `SELECT * FROM task WHERE empcode = '${req.params.EmpCode}' and EXTRACT(MONTH FROM log_date) = ${req.body.MONTH} and EXTRACT(YEAR FROM log_date) = ${req.body.YEAR}`
        await client.query(Data,(err,result)=>{
            if(err){
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
            else{
                console.log("---->",result)
                res.status(200).json({ success: true, message: "Data get successfully",result:result.rows})
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({ success: false, message:"Internal Error" })
    }
}

