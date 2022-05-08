/* These are the functions available to be invoked by the same frontend app */

const internalFunctions = {}; // You could name the object as you want

internalFunctions.myExampleFunction = (yourParamsHere) => {
  
  return 'This response comes from a backend function located inside your frontend folder (in this case an app calling itself, so the "internal.js" file will be the one required). The backend will route your incoming petition, execute the destination function passing the params sent, and then return its result.';

}

module.exports = internalFunctions;