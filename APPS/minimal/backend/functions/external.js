/* These are the functions available to be invoked by other apps */

const externalFunctions = {}; // You could name the object as you want

externalFunctions.myExampleFunction = (params) => {
  // Your logic here

  // This is just an example of what the function could return to other functions calling
  return { msgOk: `Hello ${params.whoIsCalling} from the basic minimal app. Since you call this function from another app, the backend will route your petition to the targeted app frontend folder and there it will require the "external.js" file to find the function you called.` };
}

module.exports = externalFunctions;