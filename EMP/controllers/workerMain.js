// In Node.js, worker threads allow you to run JavaScript code concurrently in separate threads, 
// enabling parallel execution of tasks and improving the overall performance of your application.
// Worker threads run in the background, separate from the main thread, allowing tasks to be performed without blocking the main event loop.

const { Worker} = require('worker_threads');
const worker = new Worker('./worker.js');
worker.on("message",(msg)=>{
    console.log('Recived message from worker fellow :',msg)
})

worker.postMessage('hello i am vinay from main thread')