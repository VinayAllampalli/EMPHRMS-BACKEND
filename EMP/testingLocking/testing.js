const axios = require('axios');
 
// Define the number of requests to send
const numRequests = 5;
 
// Define the request data
const requestData = {
    itemName:"test",
    id:676
};
 

 
// Function to send a single request
async function sendRequest() {
  try {
    const response = await axios.post('http://localhost:3000/api/lock',requestData);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
 
// Function to send multiple requests using a for loop
async function sendMultipleRequests() {
  // Create an array to store promises for each request
  const requestPromises = [];
 
  // Loop to send multiple requests
  for (let i = 0; i < numRequests; i++) {
    // Push a promise for each request into the array
    requestPromises.push(sendRequest());
  }
 
  // Wait for all requests to complete
  console.log(requestPromises.length);
  await Promise.all(requestPromises);
}
 
 
 
// Call the function to send multiple requests
sendMultipleRequests();