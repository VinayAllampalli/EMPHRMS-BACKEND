const { parentPort } = require('worker_threads');

// Listen for messages from the main thread
parentPort.on('message', (msg) => {
    console.log('Received message from main thread:', msg);

    // Echo back the message to the main thread
    parentPort.postMessage(`Message received: ${msg}`);
});


