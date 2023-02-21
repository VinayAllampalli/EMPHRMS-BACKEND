function PFdectuction(pf, pay){
    let pfEmployee, pfEmployer;
  
    if (pf == 'enable' && pay > 15000) {
      pfEmployee = 1800;
      pfEmployer = 1800;
    } else if (pf == 'enable' && pay <= 15000) {
      pfEmployee = (3 / 100) * pay;
      pfEmployer = (3 / 100) * pay;
    } else {
      pfEmployee = 0;
      pfEmployer = 0;
    }
  
    return { pfEmployee, pfEmployer };
  }



function Gratutity(gar,pay){
  let gratuity
  if(gar=='enable' && pay > 15000){
    gratuity = (2.4/100)*pay
  }
  else if (gar == 'enable' && pay <= 15000) {
   gratuity = 300
  } 

  else{
    gratuity=0
  }
  return gratuity
}


function Insurance(ins,pay){
    let insurance 
    if(ins=='enable'){
      insurance = (0.8/100)*pay 
    }
    else{
      insurance=0;
    }
    return insurance;
  }
  
  module.exports={PFdectuction,Gratutity,Insurance}