const socket = io(`http://127.0.0.1:3000`);

const inputToEncript = document.getElementById('inputToEncript');


function sendToUtilsFromBrowser() {
  let textToEncrypt = inputToEncript.value.trim();
  if (textToEncrypt == '') { textToEncrypt = 'Some random text'; inputToEncript.value = textToEncrypt; }
  const encryptedFromBrowser = document.getElementById('encryptedFromBrowser');

  const message = {
    app: 'using-modules',
    to: 'encryption.js',
    action: 'cipher',
    data: {
      params: [textToEncrypt]
    }
  }
  socket.emit('utils', message, (response) => {
    if (response && response.msgError) { alert(response.msgError) }
    encryptedFromBrowser.innerText = response;
  });
}


function sendToUtilsFromInternalJS() {
  let textToEncrypt = inputToEncript.value.trim();
  if (textToEncrypt == '') { textToEncrypt = 'Some random text'; inputToEncript.value = textToEncrypt; }
  const encryptedFromInternalJs = document.getElementById('encryptedFromInternalJs');

  const message = {
    app: 'using-modules',
    to: 'using-modules', // This will be redirected to internal.js since source and target are the same
    action: 'cipherFront',
    data: {
      params: [textToEncrypt]
    }
  }
  socket.emit('msgFromApp', message, (response) => {
    if (response && response.msgError) { return alert(response.msgError) }
    encryptedFromInternalJs.innerText = response.msgOk;
  });
}

