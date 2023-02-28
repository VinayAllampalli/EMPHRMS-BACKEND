let probition=(PS,months)=>{
    let probitionDate 
    let probitionStatus
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + months, currentDate.getDate());
     if(PS=='enable'){
       probitionDate = `${futureDate.getDate()}/${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`
       probitionStatus ="Inprogress"
       // console.log(probitionDate)
     }
     else{
       const currentDate = new Date();
       probitionDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
       probitionStatus = "Completed"
       // console.log(probitionDate)
     }
     let finalValue = {Date:probitionDate,Status:probitionStatus}
     return finalValue
   }
   module.exports={probition}
    
 
 
