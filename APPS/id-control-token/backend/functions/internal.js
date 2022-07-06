/* These are the functions available to be invoked by the same frontend app */

const internalFunctions = {}; // You could name the object as you want

internalFunctions.getResponse = () => {
  // Your logic here
  return { result: 'Hello from the targeted function. If you can read this is either because 1) you sent your request with a valid token, or 2) the ID controls were disabled.' };
}

module.exports = internalFunctions;