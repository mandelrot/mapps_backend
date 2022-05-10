/* These are the functions available to be invoked by other apps */

const externalFunctions = {}; // You could name the object as you want

externalFunctions.myExampleFunction = (params) => {
  // Your logic here

  // This is just an example of what the function would return to the secondary app calling
  return { msgOk: `Hello from the minimal app. This message will be returned when other apps invoke this function.` };
}

module.exports = externalFunctions;