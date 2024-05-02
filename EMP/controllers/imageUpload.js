const client = require('../connections/db');
const uuid = require('../utils/uuid');


exports.imageUpload = async (req, res) => {
    console.log(' Image Upload api is triggered');
    console.log(req.params.EmpCode)
    try {
        let imageTable = `create table if not exists image(EmpCode VARCHAR(100) primary key not null, file varchar(100) not null)`
        await client.query(imageTable)
        let imageExits = `select * from image where EmpCode='${req.params.EmpCode}'`
        await client.query(imageExits, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else if (result.rowCount > 0) {
                console.log("--->",req.file)
                const filename = req.file.filename;
                console.log("----->", filename);
                const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                const updateImage = ` update image set file ='${basepath}${filename}' where empcode = '${req.params.EmpCode}' `
                await client.query(updateImage, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                    }
                    else {
                        return res.status(200).json({ success: true, message: "Update Successfully" });
                    }
                })
            }
            else {
                console.log(req.file)
                const filename = req.file.filename;
                console.log("----->", filename)
                const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                const insertQuery = `insert into image(EmpCode, file) 
                              values('${req.params.EmpCode}', '${basepath}${filename}')`;
                await client.query(insertQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                    }
                    else {
                        return res.status(200).json({ success: true, message: "Insert Successfully" });
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.getImage = async (req, res) => {
    console.log('Get Image api is triggred');
    try {
        let getImage = `select * from image where EmpCode='${req.params.EmpCode}'`
        await client.query(getImage, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                return res.status(200).json({ success: true, message: "fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.getEmpDataWithImage = async (req, res) => {
    console.log("get Data with image join api is triggred");
    try {
        let query = `  SELECT employees.empcode,employees.firstname, employees.lastname, COALESCE(image.file, 'No image') as file
        FROM employees
        LEFT JOIN image ON employees.empcode = image.empcode where companyid = '${req.query.CompanyId}';`
        await client.query(query, (err, result) => {
            if (!err) {
                return res.status(200).json({ success: true, message: "fetch Successfully", result: result.rows });
            }
            else {
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.MasterholidayImageUpload = async (req, res) => {
    console.log("Holiday image upload api is triggred")
    try {
        const Id = uuid.generateUUID();
        console.log(req.file)
        const filename = req.file.filename;
        console.log("----->", filename)
        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const insertQuery = `insert into HolidayImage(id,holidayname, file) 
                      values('${Id}','${req.body.holidayname}', '${basepath}${filename}')`;
        await client.query(insertQuery, (err) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                return res.status(200).json({ success: true, message: "Insert Successfully" });
            }
        })
    }
    catch (err) {
    }
}

