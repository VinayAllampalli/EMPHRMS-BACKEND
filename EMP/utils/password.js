const bycrypt = require('bcrypt');

passwordHash = (params) =>{
    let hash =  bycrypt.hashSync(params, 10);
    return  hash;
}
passwordCompare = async (password,hash)=>{
    let isVerfied = bycrypt.compareSync(password,hash);
    return isVerfied
}
module.exports = {passwordHash,passwordCompare}