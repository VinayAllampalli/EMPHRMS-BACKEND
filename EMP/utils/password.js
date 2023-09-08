const bcrypt = require('bcrypt');

passwordHash = (params) =>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(params, salt);
    return hash;
}
passwordCompare = async (password,hash)=>{
    let isVerfied = bcrypt.compareSync(password,hash);
    return isVerfied
}
module.exports = {passwordHash,passwordCompare}

