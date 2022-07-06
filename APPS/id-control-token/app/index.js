
const socket = io(`http://127.0.0.1:${serverPort}`);


function sendWithoutToken () {
  const messageWithoutToken = {
    app: 'id-control-token',
    to: 'id-control-token',
    action: 'getResponse',
    data: {
      params: ['not used in this example']
    }
  }
  socket.emit('msgFromApp', messageWithoutToken, (response) => {
    if (response && response.msgError) { return alert(response.msgError) }
    const responseField = document.getElementById('responseWithoutToken');
    responseField.setAttribute('style', 'color: red;');
    responseField.innerText = JSON.stringify(response);
  });
}


function sendWithToken () {
  const messageWithToken = {
    app: 'id-control-token',
    to: 'id-control-token',
    action: 'getResponse',
    data: {
      params: ['not used in this example'],
      token: '123' // NEEDED IF THE ADMIN HAS SET THE ID CONTROL
    }
  }
  socket.emit('msgFromApp', messageWithToken, (response) => {
    if (response && response.msgError) { return alert(response.msgError) }
    const responseField = document.getElementById('responseWithToken');
    responseField.setAttribute('style', 'color: limegreen;');
    responseField.innerText = response.result;
  });
}




