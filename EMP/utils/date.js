const moment = require("moment");

dateCreation=(dateObject)=>{
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
  
    // Pad day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${year}-${formattedMonth}-${formattedDay}`;

}
timeCreation=(dateObject)=>{
    return timeFormate= `${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`
}

formateDate=(date)=>{
    return moment(date).format("DD/MMM/YYYY");
}

module.exports={dateCreation,timeCreation,formateDate}