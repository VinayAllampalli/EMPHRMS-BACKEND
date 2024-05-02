const client = require('../connections/db');
const Password = require('../utils/password')
const DateFormat = require('../utils/date');
const Earnings = require('../utils/earnings');
const Probition = require('../utils/probition');
const ID = require('../utils/uuid');

exports.userRegister = async (req, res) => {
    console.log("User Registration api is Triggred");
    try {
        const createUsersTabel = `create table if not exists Employees (
            firstName text not null, 
            lastName text not null, 
            EmpCode VARCHAR(100) primary key not null, 
            email Varchar(100) not null, 
            phoneNo varchar(12) not null, 
            department varchar(100) not null, 
            DOB date not null, DOJ date not null, 
            address varchar(100) not null, 
            gender char(10) not null, 
            password Varchar(100) not null, 
            role varchar(20) ,
            ReportingManager Varchar(100), 
            ReportingMangerID Varchar(10), 
            CompanyId varchar(100),
            CompanymailId Varchar(100) not null,
            FatherName varchar(100) not null,
            motherName varchar(100) not null,
            AadharNumber varchar(20) not null,
            PanNumber varchar(20) not null,
            UanNumber varchar(20), 
            bankAccNumber varchar(20) not null, 
            bankName varchar(20), 
            bankIfscCode varchar(100),
            createdOn date not null,
            probitiondate date not null,
            probitionstatus varchar not null,
            employement_status varchar(20) not null,
            universityname varchar(100) not null,
            education_qualification varchar(100) not null,
            education_branch varchar(100) not null,
            education_passingYear Int not null,
            previous_companyname varchar(100),
            pervious_companydesgination varchar(100),
            total_experience varchar(100)
            )`
        await client.query(createUsersTabel);
        const data = req.body;
        console.log(data)
        const probitionValue = req.body.probitionValue
        const TimeStamp = Date.now();
        const dateObject = new Date(TimeStamp);
        const date = DateFormat.dateCreation(dateObject);
        const password = Password.passwordHash(req.body.password);
        const probitionDATE = Probition.probition(probitionValue, 6);
        const user = await client.query(`select * from Employees where email='${data.email}' `);
        if (user.rowCount > 0) {
            return res.status(200).json({ sucess: true, message: "Email is already exits ....!" })
        }
        else {
            const employeeId = ID.generateSixDigitUUID()
            let DateOfProbition = probitionDATE.Date
            let StatusOfProbition = probitionDATE.Status
            const empStatus = StatusOfProbition === 'Inprogress' ? 'No' : 'Yes';

            // const Register = `insert into Employees(firstName,
            //     lastName,
            //     EmpCode,
            //     email,
            //     phoneNo,
            //     department,
            //     DOB,
            //     DOJ,
            //     address,
            //     gender,
            //     password,
            //     role,
            //     ReportingManager,
            //     ReportingMangerID,
            //     CompanyId,
            //     CompanymailId,
            //     FatherName,
            //     AadharNumber,
            //     PanNumber,
            //     UanNumber,
            //     bankAccNumber,
            //     bankName,
            //     bankIfscCode,
            //     createdOn,
            //     probitiondate,
            //     probitionstatus,
            //     employement_status,
            //     universityname,
            //     education_qualification,
            //     education_branch,
            //     education_passingyear,
            //     previous_companyname,
            //     pervious_companydesgination,
            //     total_Experience 
            //     )
            //     values (
            //     '${data.firstName}',
            //     '${data.lastName}',
            //     '${employeeId}',
            //     '${data.email}',
            //     '${data.phoneNo}',
            //     '${data.department}',
            //     '${data.DOB}',
            //     '${data.DOJ}',
            //     '${data.address}',
            //     '${data.gender}',
            //     '${password}',
            //     '${data.role}',
            //     '${data.ReportingManager}',
            //     '${data.ReportingMangerID}',
            //     '${data.CompanyId}',
            //     '${data.CompanymailId}',
            //     '${data.FatherName}',
            //     '${data.AadharNumber}',
            //     '${data.PanNumber}',
            //     '${data.UanNumber}',
            //     '${data.bankAccNumber}',
            //     '${data.bankName}',
            //     '${data.bankIfscCode}',
            //     '${date}',
            //     '${DateOfProbition}',
            //     '${StatusOfProbition}',
            //     '${empStatus}',
            //     '${data.University}',
            //     '${data.Qualification}',
            //     '${data.Branch}',
            //     '${data.Year}',
            //     '${data.Company}',
            //     '${data.Desgination}',
            //     '${data.TotalExp}'
            //     )`

            const Register = `INSERT INTO Employees(
                firstName, lastName, EmpCode, email, phoneNo, department, DOB, DOJ, address,
                gender, password, role, ReportingManager, ReportingMangerID, CompanyId,
                CompanymailId, FatherName, AadharNumber, PanNumber, UanNumber, bankAccNumber,
                bankName, bankIfscCode, createdOn, probitiondate, probitionstatus, employement_status,
                universityname, education_qualification, education_branch, education_passingyear,
                previous_companyname, pervious_companydesgination, total_Experience
            ) VALUES (
                '${data.firstName}', '${data.lastName}', '${employeeId}', '${data.email}', '${data.phoneNo}',
                '${data.department}', '${data.DOB}', '${data.DOJ}', '${data.address}', '${data.gender}',
                '${password}', '${data.role}', '${data.ReportingManager}', '${data.ReportingMangerID}',
                '${data.CompanyId}', '${data.CompanymailId}', '${data.FatherName}', '${data.AadharNumber}',
                '${data.PanNumber}', '${data.UanNumber}', '${data.bankAccNumber}', '${data.bankName}',
                '${data.bankIfscCode}', '${date}', '${DateOfProbition}', '${StatusOfProbition}', '${empStatus}',
                '${data.University}', '${data.Qualification}', '${data.Branch}', '${data.Year}', '${data.Company}',
                '${data.Desgination}', '${data.TotalExp}'
            ) RETURNING *`;
            await client.query(Register, (err, result) => {
                console.log(result)
                if (!err) {
                    return res.status(200).json({ success: true, message: "Registered Successfully", registercode: result.rows[0].empcode });
                }
                else {
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err });
                    console.log("---->", err);
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}


exports.getEmployeesBasedOnReportingID = async (req, res) => {
    console.log('get Employees based on Reporting Id ')
    try {
        data = req.params.EmpCode
        let emp = `select * from employees where reportingmangerid = '${data}'`
        await client.query(emp, (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.getEmployeeData = async (req, res) => {
    console.log('Employee Data Api is triggred');
    try {
        let employee = `select * from employees where empcode='${req.params.EmpCode}'`
        await client.query(employee, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else {
                // console.log(result)
                return res.status(200).json({ success: true, message: "Data Fetch Successfully", result: result.rows });
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.employeePay = async (req, res) => {
    console.log("employee pay api is triggred")
    try {
        let email = `select empcode from employees where email='${req.body.email}'`


        let EmployeePay = `create table if not exists EmployeePay(EmpCode VARCHAR(100) primary key not null, CTC decimal not null,Basic decimal not null,ConveyanceAllowance decimal not null,
                            HRA decimal not null, MedicalAllowance decimal not null, DearnessAllowance decimal not null,specialAllowance decimal not null,
                            EductionAllowance decimal not null,PfEmployee decimal not null,PfEmployer decimal not null,gratuity decimal not null,insurance decimal not null)`

        await client.query(EmployeePay, async err => {
            if (err) {
                console.log(err)
            }

            let empcode = `select * from EmployeePay where EmpCode = '${req.query.reregisterId}'`
            await client.query(empcode, async (err, result) => {
                if (err) {
                    console.log("---.", err)
                    res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                }

                else {
                    let sal = req.body.CTC
                    let pfStatus = req.body.pfStatus;
                    let gratutityStatus = req.body.gratutityStatus;
                    let insuranceStatus = req.body.insuranceStatus;

                    let PfDecution = Earnings.PFdectuction(pfStatus, sal);
                    let PFemployee = PfDecution.pfEmployee;
                    let PFemployer = PfDecution.pfEmployer;

                    let GratuityDecuction = Earnings.Gratutity(gratutityStatus, sal);
                    let InsuranceDecution = Earnings.Insurance(insuranceStatus, sal);

                    let basic = (40 / 100) * sal;
                    let ca = (4 / 100) * sal;
                    let hra = (20 / 100) * sal;
                    let medical = (4 / 100) * sal;
                    let da = (10 / 100) * sal;
                    let Ea = (1 / 100) * sal;
                    let special = (21 / 100) * sal;

                    console.log(req.body)
                    let allDeduction = `insert into EmployeePay(EmpCode,CTC,Basic,ConveyanceAllowance,HRA,MedicalAllowance,DearnessAllowance,EductionAllowance,specialAllowance,PfEmployee,PfEmployer,gratuity,insurance)
                                         values('${req.query.reregisterId}',${req.body.CTC},${basic},${ca},${hra},${medical},${da},${Ea},${special},${PFemployee},${PFemployer},${GratuityDecuction},${InsuranceDecution})`

                    await client.query(allDeduction, (err, result) => {
                        if (err) {
                            console.log(">>>>>>", err);
                            res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
                        }
                        else {
                            console.log(result)
                            return res.status(200).json({ success: true, message: "Registered Successfully" });
                        }
                    })
                }
            })
        })
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}


exports.getEarningsOfEmployee = async (req, res) => {
    console.log('Get Earnings Api of Employee is triggred');
    let Data = `SELECT *FROM employeePay
    WHERE empcode = '${req.params.EmpCode}'`
    await client.query(Data, (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Somethimg Went wrong " })
        }
        else {
            res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
        }
    })
}

exports.AllEmployees = async (req, res) => {
    console.log('Get All employees Api is triggred')
    let getEmployee = `select * from employees where companyid = '${req.params.compId}'`
    await client.query(getEmployee, (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, message: "Somethimg Went wrong " })
        }
        else {
            res.status(200).json({ success: true, message: "Data get successfully", result: result.rows })
        }
    })
}

exports.deleteEmp = async (req, res) => {
    console.log('Delete Api is triggred');
    try {
        let Delete = `Delete from employees where empcode = '${req.params.EmpCode}'`
        await client.query(Delete, (err) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Somethimg Went wrong " })
            }
            else {
                res.status(200).json({ success: true, Message: "Deleted Successfully" })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: true, message: "Internal Error" });
    }
}

exports.empInfo = async (req, res) => {
    console.log("Emp Info based on empcode Api is triggred")
    try {
        const body = req.body
        const info = ` select * from employees where empcode = '${req.params.EmpCode}'`
        await client.query(info, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, message: "Somethimg Went wrong " })
            }
            else {
                res.status(200).json({ success: true, result: result.rows })
            }
        })
    } catch (err) {
        res.status(400).json({ success: true, message: "Internal Error" });
        throw err
    }
}
