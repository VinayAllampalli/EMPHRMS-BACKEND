var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
var routeConfig = require('./routesConfig/routes-config')

//routes initials
app.use('/api',routeConfig)



const client =require("./connections/db")
const port= 4000
app.listen(port,()=> console.log(`server listning on port ${port}`))


const cron = require('node-cron');
cron.schedule('59 59 * * * *',async(req,res,err)=>{
    console
   
    // const value = 'vinay'
    // const jobSchedulerTable = `create TABLE if not exists task (value varchar(50) not null )`;
    // await client.query(jobSchedulerTable)
    // const insertTask = `insert into task(value) values ('${value}')`
    // await client.query(insertTask,(err)=>{
    //     if(err){
    //           console.log(err);

    //       }
    //       else{
    //           console.log("inserting")
    //       }
        
    // })
    const TimeStamp = Date.now();
        console.log("TimeStamp", TimeStamp)
        const dateObject = new Date(TimeStamp);
        console.log(dateObject)
        const date = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        dateFormat = `${year}/${month}/${date}`
        await client.query(`create TABLE if not exists task(EmpCode VARCHAR(100) not null, checkIn_time VARCHAR(100) not null, checkOut_time VARCHAR(100) not null,Log_Date VARCHAR(100) not null, TotalHours Varchar(10) , Count int ) `, async (err) => {
        if (err) {

            console.log('--->', err)
            res.status(400).json({ success: false, "message": "someting went Wrong", err })
        }
         const insertTask = `insert into task(EmpCode,checkIn_time,checkOut_time,Log_Date,TotalHours,Count) values (' ',' ',' ','${dateFormat}',0,0)`
         await client.query(insertTask,(err)=>{
         if(err){
              console.log(err);

          }
          else{
              console.log("inserting")
          }
        
    })
    })
    console.log("done")

   
  });
module.exports = app;
