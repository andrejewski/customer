
var Request = require('./request');

function Api(apiKey, baseUrl) {
  if(!(this instanceof Api)) return new Api();
  this.apiKey = apiKey;
  this.baseUrl = baseUrl;
  this.configRequest();
}

Api.prototype.setApiKey(apiKey) {
  this.apiKey = apiKey;
  this.configRequest();
  return this;
}

Api.prototype.setBaseUrl(baseUrl) {
  this.baseUrl = baseUrl;
  this.configRequest();
  return this;
}

Api.prototype.configRequest = function() {
  this.send = Request({
    apiKey: this.apiKey,
    baseUrl: this.baseUrl,
  });
}

module.exports = Api;

