
const socket = io(`http://127.0.0.1:${serverPort}`); // Coming from /backend-static/serverport.js


// Please note: this is just a way I have figured out to do the job, you can
// implement your own as long as the socket message to have the right format
function send() {
  const files = document.getElementsByClassName('files');
  const texts = document.getElementsByClassName('texts');

  const form = {
    files: [],
    texts: []
  };

  for (const text of texts) {
    const textName = text.name;
    form.texts.push({ name: textName, value: text.value });
  }

  let filesPending = files.length;
  for (const file of files) {
    if (file.files[0] == undefined) {
      filesPending --;
    } else {
      // You can control the file size to set some control,
      // or send the info to the backend to do it there
      const fieldName = file.name;
      const fileName = file.files[0].name;
      const fileSize = file.files[0].size;
      const reader = new FileReader();
      reader.onloadend = () => {
        form.files.push({ fieldName, fileName, fileSize, content: reader.result });
        filesPending --;
        if(filesPending == 0) { sentToBackend(); } // Once all the files are loaded
      }
      reader.readAsArrayBuffer(file.files[0]); 
        // In this example we use a buffer, and this means the socket message MUST
        // be an actual JSON and can not be stringified. If you use a non-JS technology
        // you should test what works fine for your app
    }
  }


  function sentToBackend() {
    const message = {
      app: 'files',
      to: 'files',
      action: 'manageFormWithFiles',
      data: {
        params: [form]
      }
    };


    socket.emit('msgFromApp', message, (response) => {
      if (response && response.msgError) { alert(response.msgError) }
      document.getElementById('backendResponse').innerText = 'Backend response: ' + response.msgOk;
    });
  }

}