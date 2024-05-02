const client = require("../connections/db");
const uuid = require('../utils/uuid');
const moment = require("moment");
const date = require('../utils/date')
// exports.taskCreatio = async (req, res) => {
//     console.log("Task Creation Api is triggred");
//     try {
//         // for this sequence query refer https://medium.com/knoldus/how-to-create-auto-incremented-alphanumeric-id-in-postgres-2851d903ce3e
//         // Note : for this table we have to excecute this comment code first after that we can insert data or otherwise it won't work
//         // const taskTable = `CREATE SEQUENCE all_seq;
//         // SELECT setval('all_seq',100);
//         // CREATE TABLE if not exists ALLTASK(
//         // taskId text CHECK (taskId ~ '^TS[0-9]+$') DEFAULT 'TS' || nextval('my_seq'),
//         // userEmpCode varchar(50) not null, taskDescription text not null, startDate date not null, endDate date not null, assignedBy varchar(100) not null, assignedDate date not null, companyId varchar(100) not null, status text not null,assignedName varchar(100) )`

//         // await client.query(taskTable);

//         const data3 = req.body;
//         console.log("---->", data3);
//         console.log(req.params);
//         for (let j = 0; j < data3.length; j++) {
//             let obj = data3[j];
//             // console.log('obj',obj)
//             let objstartDate = moment(data3[j].startDate).format("DD/MMM/YYYY");
//             // console.log(objstartDate)
//             let objendDate = moment(data3[j].endDate).format("DD/MMM/YYYY");
//             // console.log(objendDate)
//             const TimeStamp = Date.now();
//             const dateObject = new Date(TimeStamp);
//             const date1 = DateFormat.dateCreation(dateObject);
//             const taskcreation = `insert into ALLTASK(userEmpCode,taskDescription,startDate,endDate,assignedBy,assignedDate,companyId,status,assignedName)
//                                values('${obj.userEmpCode}','${obj.taskDescription}','${objstartDate}','${objendDate}','${req.params.Empcode}','${date1}','${req.params.compId}','${obj.status}',(SELECT firstname FROM employees WHERE EmpCode = '${req.params.Empcode}')) `;
//             await client.query(taskcreation);
//         }

//         return res
//             .status(200)
//             .json({ success: true, message: "Task created Successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ success: false, message: "Something Went wrong" });
//     }
// };


exports.taskCreation = async (req, res) => {
    console.log(` Task Creation API is triggered `)
    const createAllTaskTable = `create table if not exists alltasks (taskId SERIAL PRIMARY KEY, title varchar(100) not null ,
    description varchar(500) not null , startDate date not null, endDate date not null ,projectname varchar(20) not null, assignedto varchar(10) not null ,
    assignedby varchar(10) not null, companyid varchar(50) not null , taskstatus varchar(10) , assigneddate date not null ,attachement varchar(100) not null
    )`
    await client.query(createAllTaskTable)

    const body = req.body
    console.log(">>>>", body)

    const startdate = date.formateDate(body.from)
    const endate = date.formateDate(body.to)

    // const assignedDate = date.formateDate(new Date());
    console.log("----->", req.file);
    const filename = req.file.filename;
    // console.log("----->", req.file);
    const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    console.log(body)
    const createTask = `
     INSERT INTO alltasks (
       title, description, startDate, endDate, projectname,
       assignedto, assignedby, companyid, taskstatus, assigneddate, attachement
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10)
   `;

    const values = [
        body.title,
        body.taskDescription,
        startdate,
        endate,
        body.project,
        body.assignTo,
        req.query.empCode,
        req.query.CompanyId,
        body.status,
        `${basepath}${filename}`
    ];

    try {        await client.query(createTask, values);
        return res.status(200).json({ success: true, message: "Task created Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something Went wrong" });
    }
}


exports.taskstatusUpdate = async (req, res) => {
    console.log("Task Status Update triggred");
    try {
        let update = `update alltasks set taskstatus='${req.params.taskstatus}' where taskId='${req.params.taskId}'`;
        await client.query(update, (err) => {
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json({ success: false, message: "Somethimg Went wrong " });
            } else {
                return res
                    .status(200)
                    .json({ success: true, message: "Update Successfully" });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
};
// exports.gettasks = async (req, res) => {
//     console.log("get Task based on userId/Empcode api triggred");
//     try {
//         console.log(req.params.EmpCode);
//         let data = req.params;
//         const assignedtoQuery = `SELECT
//         at.*,
//         u_assignedby.firstname AS assignedby_name,
//          u_assignedto.firstname AS assignedto_name
//     FROM
//         alltasks at
//     JOIN
//         employees u_assignedby ON at.assignedby = u_assignedby.empcode
//         JOIN
//         employees u_assignedto ON at.assignedto = u_assignedto.empcode

//     WHERE
//         at.assignedto = '${data.EmpCode}';
//     `;

//         await client.query(assignedtoQuery, (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res
//                     .status(400)
//                     .json({ success: false, message: "Somethimg Went wrong " });
//             } else {
//                 return res
//                     .status(200)
//                     .json({
//                         success: true,
//                         message: "Successfully",
//                         result: result.rows,
//                     });
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ success: true, message: "Internal Error" });
//     }
// };

exports.getalltaskAssign = async (req, res) => {
    console.log("Get all task Assigned api is triggered");
    try {
        let data = req.params;
        const isAssignedBy = data.value === 'assigendBy';
        const isAssignedTo = data.value === 'assigned';

        const assignedbyQuery = `SELECT
        at.*,
        u_assignedby.firstname AS assignedby_name,
         u_assignedto.firstname AS assignedto_name
    FROM
        alltasks at
    JOIN
        employees u_assignedby ON at.assignedby = u_assignedby.empcode
        JOIN
        employees u_assignedto ON at.assignedto = u_assignedto.empcode
        WHERE
    ${isAssignedBy ? `at.assignedby` : (isAssignedTo ? `at.assignedto` : '')} = '${data.EmpCode}';
    `;
        await client.query(assignedbyQuery, (err, result) => {
            console.log(result);
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json({ success: false, message: "Somethimg Went wrong " });
            } else {
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Successfully",
                        result: result.rows,
                    });
            }

        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error", error: err });
    }
};



exports.getTaskDataAndOverallStatusForYear = async (req, res) => {
    console.log("Get task Data and Overall Status for Year API is triggered");
    try {
        const year = req.query.Year;
        const companyId = req.query.CompanyId;
        const empCode = req.params.EmpCode;

        // Query to retrieve monthly task data
        const taskDataQuery = `
        SELECT assigneddate 
        FROM alltasks 
        WHERE companyid = '${companyId}' 
          AND assignedto = '${empCode}' 
          AND EXTRACT(YEAR FROM assigneddate) = '${year}';
      `;

        // Query to retrieve overall task status for the year
        const overallStatusQuery = `
        SELECT COUNT(*) AS statusCount ,taskstatus
        FROM alltasks
        WHERE companyid = '${companyId}' 
          AND assignedto = '${empCode}' 
          AND EXTRACT(YEAR FROM assigneddate) = '${year}' 
        GROUP BY taskstatus;
      `;

        const [taskDataResult, overallStatusResult] = await Promise.all([
            client.query(taskDataQuery),
            client.query(overallStatusQuery),
        ]);

        // Process task data
        const taskDates = taskDataResult.rows.map((x) => {
            return moment(x?.assigneddate).format("DD/MMM/YYYY");
        });
        const monthCounts = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        };
        for (const dateStr of taskDates) {
            const parts = dateStr.split("/");
            const month = parts[1];
            monthCounts[month] = (monthCounts[month] ?? 0) + 1;
        }

        // Prepare and send the combined response
        const response = {
            success: true,
            monthlyTaskData: Object.entries(monthCounts).map(([month, value]) => ({
                month,
                value,
            })),
            overallStatusForYear: overallStatusResult.rows,
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createProject = async (req, res) => {
    const UUID = uuid.generateFourDigitUUID();
    console.log("Creat Project Api is triggered")
    const create_project = `create table if not exists companyProjects(project_id varchar(100) not null,
    project_name varchar(100) not null , company_id varchar(50) not null)`

    await client.query(create_project)
    const companyId = req.query.CompanyId;
    const projectName = req.query.projectName

    const check_project = `select * from companyProjects where project_name = '${projectName}' AND company_id = '${companyId}'`
    try {
        const result = await client.query(check_project)
        if (result.rowCount > 0) {
            return res.json({ status: true, message: 'Project Name is already Existed' })
        }
        else {
            const project = `Insert into companyProjects(project_id,project_name,company_id) 
               values ('${UUID}','${projectName}','${companyId}')`
            await client.query(project, (err) => {
                if (err) {
                    // res.json({status : false ,result : err })
                    console.log("----->", err)
                }
                else {
                    res.json({ status: true, message: 'Project created successfully' })
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}




exports.getallProjects = async (req, res) => {
    console.log("Get all Projects Api is triggred")
    try {
        const getProjects = `select * from companyProjects where company_id = '${req.query.CompanyId}'`
        await client.query(getProjects, (err, result) => {
            if (err) {
                res
                    .status(400)
                    .json({ success: true, message: "Somethimg Went wrong " });
            }
            else {
                res.status(200).json({ status: true, result: result.rows })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

exports.updateTask = async (req, res) => {
    console.log("UpdateTask Api is triggred")
    const data = req.body
    const startdate = date.formateDate(data.from)
    const endate = date.formateDate(data.to)
    const updateQuery = `
        UPDATE alltasks
        SET title = $1, description = $2, assignedto = $3, taskstatus = $4, startdate = $5, enddate = $6
        WHERE taskid = $7
    `;
    const values = [
        data.title,
        data.taskDescription,
        data.assignTo,
        data.status,
        startdate,
        endate,
        req.query.taskId
    ];

    try {
        await client.query(updateQuery, values, (err) => {
            if (err) {
                console.log(err)
                res
                    .status(400)
                    .json({ success: true, message: "Somethimg Went wrong " });
            }
            else {
                res.status(200).json({ status: true, message: "Task Updated Successfully" })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, error: err.message });
    }
}

exports.deleteTask = async (req, res) => {
    console.log("Delete Task Api is triggred ")
    const deleteTaskQuery = `delete from alltasks where taskid='${req.query.taskId}';`
    try {
        await client.query(deleteTaskQuery, (err) => {
            if (err) {
                console.log(err)
                res
                    .status(400)
                    .json({ success: true, message: "Somethimg Went wrong " });
            }
            else {
                res.status(200).json({ status: true, message: "Task Deleted Successfully" })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, error: err.message });
    }
}
