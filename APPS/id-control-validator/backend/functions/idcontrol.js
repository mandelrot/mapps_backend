/*
This module is required by the backend if the app is designated by the admin as a valid 
*/

const idControl = {}; // You could name the object as you want

idControl.checkId = (token) => {
  // Your logic here (encryption, DB checking)
  // The validation will be accepted only if this function returns true, any other case would be taken as negative
  return token === '123' ? true: false;
}

module.exports = idControl;