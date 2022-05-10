const socket = io(`http://127.0.0.1:3000`);


function storeAtBackend() {
  const value1 = document.getElementById('value1');
  const value2 = document.getElementById('value2');

  if (value1.value.trim() === '') { value1.value = 'Luke'; } else { value1.value = value1.value.trim(); }
  if (value2.value.trim() === '') { value2.value = 'Leia'; } else { value2.value = value2.value.trim(); }

  const message = {
    app: 'database',
    to: 'database',
    action: 'store',
    data: {
      params: [[value1.value, value2.value]]
    }
  };

  socket.emit('msgFromApp', message, (response) => {
    if (response && response.msgError) { alert(response.msgError); }
    document.getElementById('registryResult').innerText = response.msgOk;
  });

  document.getElementById('blockSend').setAttribute('hidden', true);
  document.getElementById('blockRetrieve').removeAttribute('hidden');
}


function retrieveFromBackend() {

  const message = {
    app: 'database',
    to: 'database',
    action: 'readAll',
    data: {
      params: []
    }
  };

  socket.emit('msgFromApp', message, (response) => {
    if (response && response.msgError) { alert(response.msgError); }
    const parsedResponse = response.msgOk.map(eachObject => eachObject._id);
    document.getElementById('retrieved').innerText = 'Response from the DB: ' + parsedResponse.join(', ');
  });
  
  document.getElementById('btnGoGetIt').setAttribute('hidden', true);
  document.getElementById('retrievedMsg').removeAttribute('hidden');
}