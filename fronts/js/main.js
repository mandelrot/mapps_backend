



function checkAppsList () {

  // Mensaje SOCKET al backend


  /* Delete */
  const apps = [
    { appFolder: 'app1', appFullName: 'Cats App', appDescription: 'Here you will find a cat list. You can sort your cats by different fields.', appIcon: 'https://brandeps.com/icon-download/C/Cat-icon-vector-01.svg', appLink: '#' },
    { appFolder: 'app2', appFullName: 'Dogs App', appDescription: 'The dog app allows to share your favorite dog breeds, names suggestions and behavior and traning tricks. You can send questions to our vets team too, and they will answer them online.', appIcon: 'https://brandeps.com/icon-download/D/Dog-icon-vector-01.svg', appLink: '#' }
  ];

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('appslist', { detail: {apps} }));
    window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: false} }));
  }, 1000);
  /* Delete */

}


window.onload = function () {
  checkAppsList();
}