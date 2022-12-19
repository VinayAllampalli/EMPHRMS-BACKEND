const express = require('express');
var router = express.Router();
//define all routes here the entry point prefix will be "api/"
const userRoute = require('../routes/userRoutes');
router.use('/', userRoute);
module.exports = router;