
function Resource(name, api, options) {
  if(!(this instanceof Resource)) {
    return new Resource(name, api, options);
  }
  this.name = name;
  this.api = api;
  this.options = options;
}

module.exports = Resource;

