
var Promise = require('bluebird');
var Errors = require('./error');

function prefix(prefix) {
    return function (request) {
        if (request.url[0] === '/') {
            request.url = prefix + request.url;
        }

        return request;
    };
}

function Request(options) {
  return function _Request(request) {
    if(options.apiKey) {
      request = request.auth(options.apiKey);
    }

    if(options.baseUrl) {
      request = request.use(prefix(options.baseUrl));
    }

    return new Promise(function(resolve, reject) {
      request.end(function(error, res) {
        if(error) {
          var CustomError = error.res.body && Errors[error.res.body.name];
          if(CustomError) {
            var customError = new CustomError(error.res.body.message);
            customError.raw = error;
            return reject(customError);
          }
          return reject(error);
        }
        resolve(res);
      });
    });
  }
}

