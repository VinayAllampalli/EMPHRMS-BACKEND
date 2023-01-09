const client = require('../connections/db');
const date =require('../utils/date')
exports.taskCreation = async (req,res)=>{
    console.log("Task Creation Api is triggred");
    try{
        // for this sequence query refer https://medium.com/knoldus/how-to-create-auto-incremented-alphanumeric-id-in-postgres-2851d903ce3e
       



        // Note : for this table we have to excecute this comment code first after that we can insert data or otherwise it won't work 
        // const taskTable = `CREATE SEQUENCE r_seq;
        // SELECT setval('r_seq',100);
        // CREATE TABLE if not exists TASK(
        // taskId text CHECK (taskId ~ '^TS[0-9]+$') DEFAULT 'TS' || nextval('r_seq'),
        // userEmpCode varchar(50) not null, taskDescription text not null, startDate date not null, endDate date not null, assignedBy varchar(100) not null, assignedDate date not null, companyId varchar(100) not null, status text not null )`
          
        // await client.query(taskTable);

        const data = req.body
        const taskcreation = `insert into TASK(userEmpCode,taskDescription,startDate,endDate,assignedBy,assignedDate,companyId,status)
                               values('${data.userEmpCode}','${data.taskDescription}','${data.startDate}','${data.endDate}','${data.assignedBy}','${data.assignedDate}','${req.params.compId}}','${data.status}') `

        await client.query(taskcreation,async (err)=>{
            if(err){
                console.log(err);
                res.status(400).json({ success: false, message:"Somethimg Went wrong "});
               
            }
            else{
                return res.status(200).json({ success: true, message: "Task created Successfully" });
            }
        })     
    }
    catch(err){ 
        console.log(err);
        res.status(400).json({ success: true, message:"Internal Error" });
    }
}

exports.taskstatusUpdate=async(req,res)=>{
    console.log("Task Status Update triggred");
    try{
    let update = `update task set status='${req.body.status}' where taskId='${req.params.taskId}'`
    await client.query(update,(err)=>{
        if(err){
            console.log(err);
            res.status(400).json({ success: false, message:"Somethimg Went wrong "});
        }
        else{
            return res.status(200).json({ success: true, message: "Update Successfully"}); 
        }
    })
}
catch(err){
    console.log(err);
    res.status(400).json({ success: true, message:"Internal Error" });
}

}

exports.gettasks=async(req,res)=>{
    console.log("get Task based on userId/Empcode api triggred");
    try{
        let GetTask=`select * from task where userempcode='${req.params.EmpCode}' and status='Inprogress' or status='Todo'`;
        await client.query(GetTask,(err,result)=>{
            if(err){
            console.log(err);
            res.status(400).json({ success: false, message:"Somethimg Went wrong "});
            }
            else{
                return res.status(200).json({ success: true, message: "Update Successfully", result:result.rows}); 
            }
        })
    }
    catch(err){
    console.log(err);
    res.status(400).json({ success: true, message:"Internal Error" });

    }
}
