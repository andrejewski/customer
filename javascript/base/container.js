
var Promise = require('bluebird');
var parseLinkHeader = require('parse-link-header');

function Default(api, response) {
  return this.response.body;
}

function Cursor(api, response) {
  if(!(this instanceof Cursor)) {
    return new Cursor(response);
  }

  this.api = api;
  this.response = response;
  this.links = parseLinkHeader(response.headers['link']);
}

Cursor.prototype.get = function get(callback) {
  return this.response.body;
}

var links = ['first', 'last', 'prev', 'next'];
links.forEach(function(link) {
  Cursor.prototype[link] = function(callback) {
    var url = this.links
      .filter(function(x) {return x.rel === link;})
      .pop();
    if(!url) throw new Error('Link rel="'+link+'" is not defined.');
    var response this.api.send(request.get(url));
    if(callback) Promise.asCallback(callback);
    return response;
  }
});

module.exports = {
  Default: Default,
  Cursor: Cursor,
};

