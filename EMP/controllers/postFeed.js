const client = require('../connections/db');
const DateFormat = require('../utils/date');
const uuid = require('uuid');
exports.postFeed = async (req, res) => {
    console.log("Post Or Announcement api is triggred")
    try {
        let FeedTable = `create table if not exists Feed(postFeedId varchar(100) not null, postBy varChar(50) not null, postDate date not null,postTime time not null, post varchar(1000) not null, CompanyId varchar(100), EmpCode varchar(50))`;
        await client.query(FeedTable)
        const UUID = uuid.v4()
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject)
        const time = DateFormat.timeCreation(dateObject)
        let Feed = `insert into Feed(postFeedId,postBy,postDate,postTime,post,CompanyId,EmpCode)
                     values ('${UUID}','${req.body.name}','${date}','${time}','${req.body.post}','${req.body.companyId}','${req.params.EmpCode}')`;

        await client.query(Feed, (err) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                return res.status(200).json({ success: true, message: "Post insert Successfully" });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });

    }
}

exports.getFeed= async(req,res)=>{
    console.log("get Feed api is triggred");
    try{
        let getAllFeedBasedOnCompId = `select * from feed where companyId='${req.params.compId}' 
        ORDER BY postdate Desc LIMIT 5;`
        await client.query(getAllFeedBasedOnCompId,(err,result)=>{
            if(err){
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                console.log(result);
                return res.status(200).json({ success: true, message: " Successfully", result:result.rows });
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}
