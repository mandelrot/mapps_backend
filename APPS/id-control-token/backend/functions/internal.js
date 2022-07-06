/* These are the functions available to be invoked by the same frontend app */

const internalFunctions = {}; // You could name the object as you want

internalFunctions.getResponse = (param1, param2, idFromToken, param4) => {
  // Your logic here
  return { result: `Hello ${idFromToken} from the targeted function. If you can read this is either because 1) you sent your request with a valid token, or 2) the ID controls were disabled.` };
}

module.exports = internalFunctions;