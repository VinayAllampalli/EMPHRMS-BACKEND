const client = require("../connections/db");
const uuid = require("../utils/uuid");
const moment = require("moment");
exports.DOB = async (req, res) => {
  console.log("Today Birthday Api is triggred");
  try {
    let DOB = `select * from employees where CompanyId='${req.params.compId}' and 
        EXTRACT(day from dob) = EXTRACT(day from now()) and EXTRACT(month from dob) = EXTRACT(month from now())`;
    await client.query(DOB, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ success: false, message: "Somethimg Went wrong " });
      } else {
        res.status(200).json({
          success: true,
          message: "Data get successfully",
          result: result.rows,
        });
        // console.log(result);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, message: "Internal Error" });
  }
};

exports.DOJ = async (req, res) => {
  console.log("working annviersy Api is triggred");
  try {
    let DOJ = `select * from employees where CompanyId='${req.params.compId}' and 
        EXTRACT(day from doj) = EXTRACT(day from now()) and EXTRACT(month from doj) = EXTRACT(month from now())`;
    await client.query(DOJ, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ success: false, message: "Somethimg Went wrong " });
      } else {
        res.status(200).json({
          success: true,
          message: "Data get successfully",
          result: result.rows,
        });
        console.log(result);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, message: "Internal Error" });
  }
};

exports.getallMasterHolidays = async (req, res) => {
  console.log("Get all Master Holidays");
  try {
    let masterHolidays = `select id,holidayname from holidayimage `;
    await client.query(masterHolidays, (err, result) => {
      if (err) {
        res
          .status(400)
          .json({ success: false, message: "Something Went wrong", err });
      } else {
        res.status(200).json({ success: true, data: result.rows });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, message: "Internal Error" });
  }
};

exports.holidays = async (req, res) => {
  console.log("holiday api is triggred");
  try {
    const Id = uuid.generateUUID();
    let data = req.body;
    let date = moment(req.body?.HolidayDate).format("DD/MMM/YYYY");

    let checkholiday = await client.query(
      `select * from holidays where holidayname='${data.HolidayName}' and holidaydate='${date}' and company_id = '${req.params.compId}'`
    );
    if (checkholiday.rowCount > 0) {
      res.status(200).json({
        success: false,
        message: "Holiday was already Exist on same Date",
      });
    } else {
      let holiday = `insert into holidays(id,holidayname,holidaydate,company_id) values('${Id}','${data.HolidayName}','${date}','${req.params.compId}')`;
      await client.query(holiday, (err) => {
        if (!err) {
          return res
            .status(200)
            .json({ success: true, message: "holiday added Successfully" });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Somethimg Went wrong ", err });
          console.log("---->", err);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, message: "Internal Error" });
  }
};


exports.deleteHoliday = async(req, res) => {
  console.log("Delete holiday Api is triggered");
  try {
    const query = `select * from holidays where company_id = '${req.params.compId}' and id= '${req.params.id}'`;
    const value = await client.query(query)
      if (value.rowCount > 0) {
        const deleteQuery = `delete from holidays where id='${req.params.id}';`;
        await client.query(deleteQuery, (err) => {
          if (err) {
            console.log(err);
            res
              .status(400)
              .json({ success: false, message: "Something Went wrong", err });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Holiday deleted successfully" });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Sorry, the holiday name does not exist..!",
        });
      }
    
  } catch (err) {
    console.log(err);
    return res.status(200).json({ success: true, message: "Internal Error" });
  }
};

exports.getHolidays = async (req, res) => {
  console.log("Get Holidays api is triggered ");
  try {
    let data = req.params;
    console.log(data);
    if (data) {
      let getallhoildays = `
              SELECT
                holidays.*,
                holidayImage.file
              FROM
                holidays
              LEFT JOIN
                holidayImage ON holidays.holidayname = holidayImage.holidayname
              WHERE
                EXTRACT(YEAR FROM holidaydate) = ${req.params.year} and company_id = '${req.params.compId}' ORDER BY holidaydate ASC;
            `;

      await client.query(getallhoildays, (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(400)
            .json({ success: false, message: "Something Went wrong", err });
        } else {
          const adjustedResult = result.rows.map((row) => {
            // Adjust the date by adding one day
            const holidayDate = new Date(row.holidaydate);
            holidayDate.setDate(holidayDate.getDate() + 1);

            // Convert the adjusted date back to ISO string format
            row.holidaydate = holidayDate.toISOString();

            return row;
          });
          return res.status(200).json({
            success: true,
            message: "Fetch Successfully",
            result: adjustedResult,
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, message: "Internal Error" });
  }
};


