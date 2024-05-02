const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    const payload = {
        userId:id
    }
    const token = jwt.sign(payload, "VinayLovesNodejs", { expiresIn: '1h' });
    return token;
}



function authenticateToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, "VinayLovesNodejs", (err, userId) => {
        if (err) return res.sendStatus(403);
        req.userId = userId;
        next();
    });
  } catch (error) {
    res.status(500).send("Unauthorized");
  }
}

module.exports = { authenticateToken, generateToken };