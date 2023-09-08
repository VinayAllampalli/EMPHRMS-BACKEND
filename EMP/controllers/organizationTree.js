const client = require('../connections/db');

exports.orgTree = async (req, res) => {
    console.log("Organization Tree API is triggered");
    try {
        const query = `select employees.firstname,employees.empcode,employees.reportingmanager,employees.reportingmangerid,image.file from employees 
                       left join image on image.empcode = employees.empcode WHERE employees.companyid ='${req.params.compId}'`;
        const result = await client.query(query);
        // Create a map of employees
        const employeesMap = new Map();
        // Iterate over the result rows and populate the map
        for (const row of result.rows) {
            const { firstname, empcode, reportingmanager, reportingmangerid,file } = row;
            const employee = {
                name: firstname,
                id: empcode,
                image:file,
                reportingmangerid: reportingmangerid
            };
            console.log(employee)
            employeesMap.set(empcode, employee);
        }
        // Build the organization tree starting from the root managers
        const organizationTree = [];
        for (const [empCode, employee] of employeesMap) {
            if (!employee.reportingmangerid) {
                const rootEmployee = {
                    name: employee.name,
                    id: employee.id,
                    image:employee.image,
                    childerns: getSubordinates(empCode, employeesMap)
                };
                organizationTree.push(rootEmployee);
            }
        }
        console.log("Organization Tree:", organizationTree);
        res.json(organizationTree);
    } catch (err) {
        console.error("Error retrieving organization tree:", err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
function getSubordinates(managerId, employeesMap) {
    const subordinates = [];
    for (const [empCode, employee] of employeesMap) {
        if (employee.reportingmangerid === managerId) {
            const subordinate = {
                name: employee.name,
                id: employee.id,
                image:employee.image,
                childerns: getSubordinates(empCode, employeesMap)
            };
            subordinates.push(subordinate);
        }
    }
    return subordinates;
}


exports.dbTables = async (req, res) => {
    console.log("DbTables API is triggered");
    try {
        const data = `SELECT table_name
                      FROM information_schema.tables
                      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`;

        const result = await client.query(data);
        const tableNames = result.rows.map(row => row.table_name);
        console.log(tableNames);
        res.status(200).json({ success: true, data: tableNames });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
