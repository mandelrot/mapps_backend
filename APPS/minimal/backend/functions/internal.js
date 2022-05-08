/* These are the functions available to be invoked by the same frontend app */

const internalFunctions = {}; // You could name the object as you want

internalFunctions.myExampleFunction = (whateverParamsYouWant) => {
  // Your logic here
  return 'You could return anything and it would be received by the frontend that called this function';
}

module.exports = internalFunctions;