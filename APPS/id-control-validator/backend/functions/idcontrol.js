/*
This module is required by the backend if the app is designated by the admin as a valid 
*/

const idControl = {}; // You could name the object as you want

idControl.checkId = (token) => {
  // Your logic here (encryption, DB checking)
  // The validation should be resolved returning something that can be evaluated as positive, otherwise it will fail
  return token === '123' ? 'John Doe' : false;
}

module.exports = idControl;