const colors = require('colors'); // delete
const util = require('util');

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
app.use((err, req, res, next) => { if (err) { return res.sendStatus(400); } }); 

app.use(express.json());




/* INTERNAL APP ROUTES AND FUNCTIONS */

// The admin can ONLY use the admin window via Electron, can't connect from anywhere else
module.exports = {
  msgFromAdmin: async function (message) {
    return await control.msgFromAdmin(message);
  }
}

// Socket connections with the outside world
io.on('connection', (socket) => {
  socket.on('msgFromApp', async (message, responseFunction) => {
    response = await control.msgFromApp(message);
    responseFunction(response);
  });

  socket.on('msgFromMain', async (message, responseFunction) => {
    response = await control.msgFromMain(message);
    responseFunction(response);
  });

  socket.on('msgFromControl', (message) => {
    if (!socket.conn.remoteAddress.includes('127.0.0.1') ||
        message.pass !== config.PASSPHRASE) {
      return socket.disconnect();
    }
    const channel = message.to;
    delete message.pass;
    delete message.to;
    socket.broadcast.emit(channel, message);
  });
});



app.post('/files', (req, res) => {
  // File uploads pending
});


/* END OF INTERNAL APP ROUTES AND FUNCTIONS */




/* USERS ROUTES (WHERE THEY CONNECT TO INTERACT WITH THE APPS) */
app.use(express.static(path.join(__dirname, '..', 'fronts')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fronts/main.html'));
});

app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fronts/404.html'));
});

app.get('/msgFromServer', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fronts/msgfromserver.html'));
});


app.get('/:appFolder', async (req, res)=> {
  const appChecked = await control.checkApp(req.params.appFolder);
  if (appChecked.msgError) { return res.redirect(`/msgFromServer?msg=${appChecked.msgError}`); }
  if (appChecked.result) {
    return res.sendFile(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, req.params.appFolder, 'app', 'index.html'));
  }
  res.redirect('/404');
})

app.get('/:appFolder/*', async (req, res) => {
  // console.log (req.get('Referrer')); // Who asks for the resource, not needed now (just for potential future reference)
  const appChecked = await control.checkApp(req.params.appFolder);
  if (appChecked.msgError) { return res.redirect(`/msgFromServer?msg=${appChecked.msgError}`); }
  if (!appChecked.result && !(req.params['0'].includes('backend-static'))) {
    return res.redirect('/404');
  }
  if (req.params['0'].includes('..')) { // In case someone wants to get out of the app folder scope
    return res.redirect('/404');
  }
  if (appChecked.result === 'managedByFrontendApp' && !(req.params['0'].includes('static'))) {
    return res.sendFile(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, req.params.appFolder, 'app', 'index.html'));
  }
  const fileExists = await control.checkAppFile ([req.params.appFolder, 'app'].concat(req.params['0'].split('/')));
  if (fileExists) {
    return res.sendFile(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, req.params.appFolder, 'app', ...req.params['0'].split('/')));
  } else {
    return res.redirect('/404');
  }
});


/* END OF USERS ROUTES */





app.all('*', (req, res) => { // Non-get petitions will end up here
  res.sendStatus(404);
})



server.listen(config.server.PORT, () => {
  console.log (`Server listening on ${config.server.PORT}`.gray);
})

