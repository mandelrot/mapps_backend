const colors = require('colors'); // delete

const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      control = require(path.join(__dirname, '..', 'control', 'control.js'));


/* SERVER CONFIGURATION */
const express = require('express'),
      app = express(),
      http = require('http'),
      server = http.createServer(app),
      { Server } = require('socket.io'),
      io = new Server(server);

// VERY important: if an express app gets a request with a json-type header but a
// non-json body, depending on the request the app can crash. The next line prevents it:
app.use((err, req, res, next) => { if (err) { return res.status(400).send(); } }); 

app.use(express.json());



/* USERS ROUTES (WHERE THEY CONNECT TO INTERACT WITH THE APPS) */


// app.get('/:app', (req, res) => { // To be implemented
//   // send to the CONTROL module
// })


/* END OF USERS ROUTES */





/* INTERNAL APP ROUTES AND FUNCTIONS */


io.on('connection', (socket) => {
  socket.on('msgFromApp', (message) => {
    // console.log (message);
    // To be implemented: send to CONTROL
  })

  socket.on('msgFromBackend', (message) => {
    if (!socket.conn.remoteAddress.includes('127.0.0.1') ||
        message.appId !== config.server.MSG_PASSPHRASE) { return; }
    delete message.appId;
    
    // To be implemented: handle the operation
    socket.broadcast.emit('msgFromBackend', message);
  })
});

app.get('/files', (req, res) => {
  // File uploads pending
});


/* END OF INTERNAL APP ROUTES AND FUNCTIONS */






app.all('*', (req, res) => { // 404 response to be implemented
  console.log (('Request en app.all: ' + req.url).red)
  res.send('404: the resource you are looking for is not there');
})




server.listen(config.server.PORT, () => {
  console.log (`Server listening on ${config.server.PORT}`.gray);
})

