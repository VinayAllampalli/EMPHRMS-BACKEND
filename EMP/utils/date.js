dateCreation=(dateObject)=>{
    return dateFormat = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`
}
timeCreation=(dateObject)=>{
    return timeFormate= `${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`
}

module.exports={dateCreation,timeCreation}