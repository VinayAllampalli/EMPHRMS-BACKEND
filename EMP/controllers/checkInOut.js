const client = require('../connections/db');
const DateFormat = require('../utils/date');
const { earnings } = require('../utils/earnings');


// postman : http://localhost:3000/api/logData/CheckIn/e2aeb693-ebb8-4bde-b739-90950fd55b7e change the value : checkin 
//           http://localhost:3000/api/logData/CheckOut/e2aeb693-ebb8-4bde-b739-90950fd55b7e change the value : checkOut

exports.CheckedIn = async (req, res) => {
    console.log("Checked In / Out  api is triggred ")
    try {
        console.log(req.params)
        const TimeStamp = Date.now();
        console.log("TimeStamp", TimeStamp)
        const dateObject = new Date(TimeStamp);
        console.log(dateObject)
        const date = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        const day = dateObject.getDay()
        const hours = dateObject.getHours();
        const mins = dateObject.getMinutes();
        const sec = dateObject.getSeconds();
        dateFormat = `${date}/${month}/${year}`
        TimeFormat = `${hours}:${mins}:${sec}`
        console.log(dateFormat, TimeFormat)

        await client.query(`create TABLE if not exists logData(EmpCode VARCHAR(100) not null, checkIn_time VARCHAR(100) not null, checkOut_time VARCHAR(100) not null,Log_Date date not null, TotalHours Varchar(10) , Count int, location varchar(30) not null, longitude varchar(100), latitude varchar(100), IPAddress varchar(100)) `, async (err) => {
            if (err) {
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
        })
        if (req.params.value == 'CheckIn') {
            const AlreadyCheckin = `select checkin_time from logData where EmpCode ='${req.params.EmpCode}' and log_date='${dateFormat}'`
            await client.query(AlreadyCheckin, async (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount > 0) {
                    res.status(200).json({ success: false, message: "Already checked in" })
                }
                else {
                    const insertQuery = `insert into logData(EmpCode,checkIn_time,checkOut_time,Log_Date,TotalHours,Count,location,longitude,latitude,IpAddress) values('${req.params.EmpCode}','${TimeFormat}','${TimeFormat}','${dateFormat}','0',0,'${req.body.location}','${req.body.longitude}','${req.body.latitude}','${req.body.IpAddress}')`
                    // const insertQuery = `update logData set EmpCode='${req.params.EmpCode}',checkIn_time='${TimeFormat}',checkOut_time='${TimeFormat}' where Log_Date='${dateFormat}' `
                    console.log("----+", insertQuery)
                    await client.query(insertQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            console.log(result.rows)
                            res.status(200).json({ success: true, message: "checked IN successfully" })
                        }
                    })

                }
            })
        }
        else if (req.params.value = 'checkOut') {
            const withoutCheckIn = `select checkin_time from logData where EmpCode='${req.params.EmpCode}' and log_date='${dateFormat}'`
            await client.query(withoutCheckIn, async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount == 0) {
                    res.status(200).json({ success: false, message: "Please checked In" })
                }
                else {

                    const updateCheckoutQuery = `update logData set checkOut_time='${TimeFormat}' where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                    console.log("----+", updateCheckoutQuery)
                    await client.query(updateCheckoutQuery, async (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            const difference = `select checkin_time,checkOut_time from logData where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                            await client.query(difference, async (err, result) => {
                                // console.log(err)
                                // console.log(result.rows)
                                let values = result.rows
                                for (let i = 0; i < values.length; i++) {
                                    let InTime = values[i].checkin_time;
                                    // console.log(InTime)
                                    const [hours, minutes, seconds] = InTime.split(':');
                                    const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds)
                                    // console.log("date",date)
                                    let OutTime = values[i].checkout_time;
                                    // console.log(OutTime)
                                    const [hours2, minutes2, seconds2] = OutTime.split(':');
                                    const date2 = new Date(+year, month - 1, +day, +hours2, +minutes2, +seconds2)
                                    // console.log("date2",date2)
                                    let res = Math.abs(date - date2) / 1000;
                                    console.log("res", res)
                                    const TotalHours = Math.floor(res / 3600) % 24;
                                    const Totalmin = Math.floor(res / 60) % 60;
                                    const Totalsec = res % 60
                                    const totalTime = `${TotalHours}:${Totalmin}:${Totalsec}`
                                    // console.log('--->',typeof totalTime)
                                    const updateTotalTime = `update logData set TotalHours='${totalTime}' where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                                    await client.query(updateTotalTime, (err) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).json({ success: false, message: "someting went Wrong" })
                                        }
                                    })

                                }
                            });

                            res.status(200).json({ success: true, message: "checked out successfully" })

                        }
                    })

                }
            })

        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}

exports.IN = async (req, res) => {
    try {
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)
        console.log('CheckIN api is Triggred')
        console.log(req.params)
        const AlreadyCheckin = `select checkin_time from logData where EmpCode ='${req.params.EmpCode}' and log_date='${date}'`
        await client.query(AlreadyCheckin, async (err, result) => {
            // console.log(result)
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "someting went Wrong" })
            }
            else if (result.rowCount > 0) {
                console.log("---------------->")
                res.status(200).json({ success: true, message: "Already checked in " })
            }
            else {
                res.status(400).json({ success: true, message: "got to checkout" })
            }
        }
        )
    }

    catch (err) {
        console.log("----->", err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}


