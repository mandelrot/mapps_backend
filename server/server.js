
const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      control = require(path.join(__dirname, '..', 'control', 'control.js'));


/* SERVER CONFIGURATION */
const express = require('express'),
      app = express(),
      http = require('http'),
      server = http.createServer(app),
      { Server } = require('socket.io'),
      io = new Server(server, {maxHttpBufferSize: ((config.msgMaxSize * 1048576) || 1048576)}); // Production
      // io = new Server(server, {cors: {origin: '*'}, maxHttpBufferSize: ((config.msgMaxSize * 1048576) || 1048576)}); // Development

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
    const response = await control.msgFromApp(message);
    responseFunction(response);
  });
  socket.on('utils', async (message, responseFunction) => {
    const response = await control.utils(message);
    responseFunction(response);
  });
  socket.on('msgToBroadcast', (message) => {
    const messageToBroadcast = control.msgToBroadcast(message);
    if (messageToBroadcast.msgOk) { // Otherwise ignored
      const stringified = JSON.stringify(messageToBroadcast.msgOk);
      io.emit('broadcast', stringified);
    }
  });

  socket.on('msgFromMain', async (message, responseFunction) => {
    const response = await control.msgFromMain(message);
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
  let parsed = await control.parseRequest(req.headers.host, req.headers.referer, req.params.appFolder);
  if (!parsed) { 
    parsed = {
      appFolder: req.params.appFolder
    }
  }
  const appChecked = await control.checkApp(parsed.appFolder);
  if (appChecked.msgError) { return res.redirect(`/msgFromServer?msg=${appChecked.msgError}`); }
  if (appChecked.result) {
    const url = req.url.endsWith('/') ? req.url.substring(0, (req.url.length -1)) : req.url;
    if (url.endsWith(parsed.appFolder)) {
      return res.sendFile(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, parsed.appFolder, 'app', 'index.html'));
    } else {
      return res.redirect(`/${parsed.appFolder}/${parsed.params}`);
    }
  }
  res.redirect('/404');
})

app.get('/:appFolder/*', async (req, res) => {
  let parsed = await control.parseRequest(req.headers.host, req.headers.referer, req.params.appFolder, req.params['0']);
  if (!parsed) {
    parsed = {
      appFolder: req.params.appFolder,
      params: req.params['0']
    }
  }
  const appChecked = await control.checkApp(parsed.appFolder);
  if (appChecked.msgError) { return res.redirect(`/msgFromServer?msg=${appChecked.msgError}`); }
  if (!appChecked.result && !(parsed.params.includes('backend-static'))) {
    return res.redirect('/404');
  }
  if (parsed.params.includes('..')) { // In case someone wants to get out of the app folder scope
    return res.redirect('/404');
  }
  if (appChecked.result === 'managedByFrontendApp' && (parsed.params.includes('__'))) {
    return res.sendFile(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, parsed.appFolder, 'app', 'index.html'));
  }
  const fileExists = await control.checkAppFile ([parsed.appFolder, 'app'].concat(parsed.params.split('/')));
  if (fileExists) {
    const finalFile = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, parsed.appFolder, 'app', ...parsed.params.split('/'));
    return res.sendFile(finalFile);
  } else {
    return res.redirect('/404');
  }
});

/* END OF USERS ROUTES */






app.all('*', (req, res) => { // Non-get petitions will end up here
  res.sendStatus(404);
})


server.listen(config.server.PORT, () => {
  console.log (`Server listening on ${config.server.PORT}`);
})

