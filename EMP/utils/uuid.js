const { v4: uuidv4 } = require('uuid');

function generateUUID() {
  return uuidv4();
}

function generateFourDigitUUID() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber.toString();
}

function generateSixDigitUUID(){
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.toString();
}

module.exports = {generateUUID,generateFourDigitUUID,generateSixDigitUUID}