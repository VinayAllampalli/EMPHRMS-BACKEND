const client = require("../connections/db");
const Password = require("../utils/password");
const nodemailer = require("nodemailer");
const uuid = require('../utils/uuid');

exports.forgotPasswordGenratedOtp = async (req, res) => {
    console.log("forgotPassword Api is triggred");
    try {
        let data = req.body;
        let users = await client.query(
            `select firstname,email,empcode from employees where email ='${data.email}'`
        );
        console.log("--->", users.rows);
        if (users.rowCount === 0) {
            return res.json({ sucess: true, message: "User Does not Exists" });
        } else {
            const Id = uuid.generateUUID();
            const OTP = uuid.generateFourDigitUUID();
            await client.query(`insert into otp_logs(id,otp)values('${Id}','${OTP}')`)
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "samplemailid705@gmail.com",
                    pass: "ixtbegjtpgumfrfn",
                },
            });
            for (let i = 0; i < users.rows.length; i++) {
                const email = users.rows[i].email;
                const firstName = users.rows[i].firstname;
                const mailOptions = {
                    from: "samplemailid705@gmail.com",
                    to: email,
                    subject: "Password Update",
                    html:
                        '<body><h3 style="color:DodgerBlue;">Hello, ' +
                        firstName +
                        "</h3>" +
                        '<p style="color:MediumSeaGreen;">You have requested to reset your password . To proceed with the action, please use the One-Time Password (OTP) provided below:</p>' +
                        '<p style="color:tomato;">' + OTP +
                        '<p style="color:MediumSeaGreen;">Please note that this OTP is valid for a limited time and should be kept confidential. Do not share it with anyone. If you did not request this action, please disregard this email.</p>' +
                        '<p style="color:MediumSeaGreen;">Thank You</p>' +
                        '<p style="color:DodgerBlue;">Best Regards</p>' +
                        '<p style="color:DodgerBlue;">WorkHub 360</p></body>'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error:", error);
                        return res
                            .status(400)
                            .json({ message: " Please try again after some time." });
                    } else {
                        return res
                            .status(200)
                            .json({
                                success: true,
                                message:
                                    "You have requested to reset your password for that we send OTP to your Email Id",
                                value: Id
                            });
                    }
                });
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.forgotPassword = async (req, res) => {
    console.log("forgotPassword Api is triggred");
    try {
        const data = req.body
        console.log(req.body)
        let users = await client.query(
            `select firstname,email,empcode from employees where email ='${req.params.email}'`
        );
        console.log('---->', req.params.value)
        let check = await client.query(`select * from otp_logs where id='${req.params.value}'`)
        console.log(check)

        if (check.rowCount > 0) {
            for (let i = 0; i < check.rows.length; i++) {
                console.log(check.rows[i].otp)
                if (data.otp === check.rows[i].otp) {
                    console.log("enter")
                    const password = Password.passwordHash(data.password);
                    await client.query(
                        `update employees set password = '${password}' where email = '${req.params.email}'`
                    );
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: "samplemailid705@gmail.com",
                            pass: "ixtbegjtpgumfrfn",
                        },
                    });
                    for (let i = 0; i < users.rows.length; i++) {
                        const email = users.rows[i].email;
                        const firstName = users.rows[i].firstname;

                        const mailOptions = {
                            from: "samplemailid705@gmail.com",
                            to: email,
                            subject: "Password Update",
                            html:
                                '<body><h3 style="color:DodgerBlue;">Hello' +
                                firstName +
                                "</h3>" +
                                '<p style="color:MediumSeaGreen;">We wanted to inform you that your password has been successfully updated. Your account is now secured with a new password.</p>' +
                                '<p style="color:MediumSeaGreen;">If you have any questions or concerns regarding your account or any other matter, please dont hesitate to reach out to our support team.</p>' +
                                '<p style="color:MediumSeaGreen;">Thank You</p>' +
                                '<p style="color:DodgerBlue;">Best Regards' + '</br>' +
                                'WorkHub 360</p></body>',
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log("Error:", error);
                                return res
                                    .status(400)
                                    .json({ message: " Please try again after some time." });
                            } else {
                                return res
                                    .status(200)
                                    .json({ success: true, message: "Password Update Successfully" });
                            }
                        });
                    }
                }
            }
        }
        else {
            return res
                .status(400)
                .json({ message: "otp is not valid " });
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
