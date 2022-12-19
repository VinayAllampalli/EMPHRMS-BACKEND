const client = require('../connections/db');

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
        dateFormat = `${year}/${month}/${date}`
        TimeFormat = `${hours}:${mins}:${sec}`
        console.log(dateFormat, TimeFormat)

        await client.query(`create TABLE if not exists logData(EmpCode VARCHAR(100) not null, checkIn_time VARCHAR(100) not null, checkOut_time VARCHAR(100) not null,Log_Date VARCHAR(100) not null, TotalHours Varchar(10) , Count int ) `, async (err) => {
            if (err) {
                console.log('--->', err)
                res.status(400).json({ success: false, "message": "someting went Wrong", err })
            }
        })
        if (req.params.value == 'CheckIn') {
            const AlreadyCheckin = `select checkin_time from task where EmpCode ='${req.params.EmpCode}' and log_date='${dateFormat}'`
            await client.query(AlreadyCheckin, async (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount > 0) {
                    res.status(400).json({ success: false, message: "Already checked in " })
                }
                else {
                    const insertQuery = `update task set EmpCode='${req.params.EmpCode}',checkIn_time='${TimeFormat}',checkOut_time='${TimeFormat}' where Log_Date='${dateFormat}' `
                    console.log("----+", insertQuery)
                    await client.query(insertQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            res.status(200).json({ success: true, message: "checked IN successfully" })
                        }
                    })

                }
            })
        }
        else if (req.params.value = 'checkOut') {
            const withoutCheckIn = `select checkin_time from task where EmpCode='${req.params.EmpCode}' and log_date='${dateFormat}'`
            await client.query(withoutCheckIn, async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ success: false, message: "someting went Wrong" })
                }
                else if (result.rowCount == 0) {
                    res.status(400).json({ success: false, message: "Please checked In" })
                }
                else {

                    const updateCheckoutQuery = `update task set checkOut_time='${TimeFormat}' where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                    console.log("----+", updateCheckoutQuery)
                    await client.query(updateCheckoutQuery, async (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ success: false, message: "someting went Wrong" })
                        }
                        else {
                            const difference = `select checkin_time,checkOut_time from task where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                            await client.query(difference, async (err, result) => {
                                console.log(err)
                                let values = result.rows
                                for (let i = 0; i < values.length; i++) {
                                    let InTime = values[i].checkin_time;
                                    const [hours, minutes, seconds] = InTime.split(':');
                                    const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds)
                                    let OutTime = values[i].checkout_time;
                                    const [hours2, minutes2, seconds2] = OutTime.split(':');
                                    const date2 = new Date(+year, month - 1, +day, +hours2, +minutes2, +seconds2)
                                    let res = Math.abs(date - date2) / 1000;
                                    const TotalHours = Math.floor(res / 3600) % 24;
                                    const Totalmin = Math.floor(res / 60) % 60;
                                    const Totalsec = res % 60
                                    const totalTime = `${TotalHours}:${Totalmin}:${Totalsec} `
                                    const updateTotalTime = `update task set TotalHours='${totalTime}' where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                                    await client.query(updateTotalTime, (err) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).json({ success: false, message: "someting went Wrong" })
                                        }
                                    })
                                    if(totalTime > "5:29:0"){
                                        console.log("halfday")
                                        const updateCount = `update task set count = 0.5 where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                                        await client.query(updateCount)
                                    }
                                    else if (totalTime > "8:59:0" ){
                                        const updateCount1 = `update task set count = 1 where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                                        await client.query(updateCount1)
                                    }
                                    else {
                                        console.log("earlygoing")
                                        const updateCount2 = `update task set count = 0 where EmpCode='${req.params.EmpCode}' and Log_Date='${dateFormat}'`
                                        await client.query(updateCount2)
                                    }

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
        res.status(400).json({ success: false, err })

    }
}