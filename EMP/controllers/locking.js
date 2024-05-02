const client = require('../connections/db');
exports.locking = async (req, res) => {
    try {
        console.log("Lockng api is triggered");
        const data = req.body;
        const insert_data = `insert into practice (id,item_name)values(${data.id},'${data.itemName}') RETURNING *;`
        await client.query(insert_data, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                return res.status(200).json({ success: true, message: "Successfully", registercode: result.rows });
            }
        })
    } catch (error) {
        throw error;
    }

}