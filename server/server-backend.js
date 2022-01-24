/* THESE FUNCTIONS ARE ONLY ACCESIBLE FROM WITHIN THE SERVER */


const colors = require('colors'); // delete

const path = require('path'),
      requestIp = require('request-ip');
const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      control = require(path.join(__dirname, '..', 'control', 'control.js'));


/* SERVER CONFIGURATION */
const express = require('express'),
      app = express(),
      http = require('http'),
      server = http.createServer(app),
      { Server } = require('socket.io'),
      io = new Server(server);


// Security controls
app.use((req, res, next) => { 
  const clientIp = requestIp.getClientIp(req); 
  if (!clientIp.includes('127.0.0.1')) { return res.sendStatus(404); }
  next();
}); 
app.use((err, req, res, next) => { if (err) { return res.sendStatus(400); } }); 

app.use(express.json());







/* INTERNAL APP ROUTES AND FUNCTIONS */


io.on('connection', (socket) => {
  if (!socket.conn.remoteAddress.includes('127.0.0.1')) { return socket.disconnect(); }
  socket.on('msgFromAdmin', (message) => {

    // To be implemented: send to CONTROL
  });

  socket.on('msgFromBackend', (message) => {
    if (message.pass !== config.server.MSG_PASSPHRASE) { return; }
    delete message.pass;
    
    // To be implemented: handle the operation, send to CONTROL
    // socket.broadcast.emit('msgFromBackend', message);
  });
});


/* END OF INTERNAL APP ROUTES AND FUNCTIONS */





/* ADMIN ROUTE */


app.use(express.static(path.join(__dirname, '..', 'fronts')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fronts/admin.html'));
});


/* END OF ADMIN ROUTE */





app.all('*', (req, res) => { // Non-get petitions will end up here
  res.sendStatus(404);
})




server.listen(config.server.PORT_BACKEND, () => {
  console.log (`Backend listening on ${config.server.PORT_BACKEND}`.gray);
})

