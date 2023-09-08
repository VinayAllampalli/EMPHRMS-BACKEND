
const client = require('../connections/db');
const password = require('../utils/password')
exports.login = async (req, res) => {
    console.log("Login Api is triggred");
    try {
        const loginApi = `Select * from employees where email='${req.body.email}'`

        await client.query(loginApi, async (err, user) => {
            // console.log(user)
            if (err) {
                console.log("not found");
                res.status(400).json({ success: false, message: "Somethimg Went wrong " })
            }
            else if (user.rowCount == 0) {
                console.log(err)
                res.status(200).json({ success: true, message: 'Please enter registered email!' })
            }
            else {
                const X = user.rows
                for (let i = 0; i < X.length; i++) {
                    const pass = X[i].password
                    const check = await password.passwordCompare(req.body.password, pass);
                    if (check == true) {
                        res.status(200).json({ success: true, message: "Login successfully", data: user.rows })
                        console.log("success")
                    }
                    else {
                        res.status(400).json({ success: false, message: 'Please check your password!' });
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}

exports.adminLogin = async (req, res) => {
    console.log("Admin login Api is triggred");
    console.log(req.body)
        try {
        const query = `select * from company where adminemailid = '${req.body.email}'`
        await client.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).json({ success: false, message: "Somethimg Went wrong ", err })
            }
            else if (result.rowCount == 0) {
                res.status(400).json({ success: false, message: 'Please enter registered Email!' })
            }
            else {
                const data = result.rows
                for (let i = 0; i < data.length; i++) {
                
                    const pass = data[i].adminpassword
                    const check = await password.passwordCompare(req.body.password, pass);
                    console.log(check)
                    if (check == true) {
                        res.status(200).json({ success: true, message: "Login successfully", data: result.rows })
                        console.log("success")
                    }
                    else {
                        res.status(400).json({ success: false, message: 'Please check your password!' });
                        
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: "Internal Error" })
    }
}

