//actual business logic functions


/**
 * send/receive data from backend
 * 
 * @param {string} endpoint
 * @param {string} method http method (optional, defaults to GET)
 * @param {object} data POST or PUT data (optional)
 */
export async function fetcher(endpoint, method, data) {
  return new Promise((resolve, reject) => {
    method = method || 'GET';
    var request =  {
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if(data){
      request.body = JSON.stringify(data);
    }

    fetch(endpoint, request).then((r) => r.json()).then((r) => resolve(r))
    .catch((e) => console.log(e));

  });
}