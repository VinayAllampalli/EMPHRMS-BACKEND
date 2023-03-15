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
   
    console.log(req.params)
    
    try{
        const dateObject = new Date(req.params.date);
    console.log(dateObject)
    const MONTH = dateObject.getMonth() + 1;
    const YEAR = dateObject.getFullYear();
    console.log(MONTH);
    console.log(YEAR)
        const Data = `SELECT * FROM logdata WHERE empcode = '${req.params.EmpCode}' and EXTRACT(MONTH FROM log_date) = '${MONTH}' and EXTRACT(YEAR FROM log_date) = '${YEAR}'`
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

exports.getEveryDayAttedance = async(req,res)=>{
    try{
        console.log('Get Every Day Attedance api is triggred');
        let offset = 0;
        let limit = 2;
      await client.query(`SELECT * FROM logData WHERE empcode = '${req.params.EmpCode}'
      LIMIT $1
      OFFSET $2
    `,[limit, offset],(err,result)=>{
        offset += limit
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
    }
}







// finally one  -----------------------------------

// const fs = require('fs');
// const { Builder } = require('xml2js');
// const xml2js = require('xml2js');
// const parser = new xml2js.Parser();

// fs.readFile('C:/Users/Lotus/Desktop/XML/testfile.xml', function(err, data) {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   parser.parseString(data, function (err, result) {
//     if (err) {
//       console.log(err);
//       return; 
//     }

//     const groups = result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].GROUP;
//     console.log(groups);

//     const target = {
//       ENVELOPE: {
//         HEADER: {
//           TALLYREQUEST: "Import Data"
//         },
//         BODY: {
//           IMPORTDATA: {
//             REQUESTDESC: {
//               REPORTNAME: "All Masters",
//               STATICVARIABLES: {
//                 SVCURRENTCOMPANY: "Phoenix Scientific Suppliers"
//               }
//             },
//             REQUESTDATA: {
//               TALLYMESSAGE: {
//                 GROUPS: {
//                   GROUP: groups
//                 }
//               }
//             }
//           }
//         }
//       }
//     };

//     const builder = new Builder();
//     const targetXml = builder.buildObject(target);

//     console.log("---------------------------------->", targetXml);

//     fs.writeFile('output.xml', targetXml, (err) => {
//       if (err) throw err;
//       console.log('XML document saved to file!');
//     }); 
//   });
// });