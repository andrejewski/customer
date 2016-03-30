
function Customer(name, apis) {
  if(!(this instanceof Api)) {
    return new Customer(options);
  }
  this.name = name;
  this.apis = apis;
}

function Api(options) {
  if(!(this instanceof Api)) {
    return new Api(options);
  }

  if(typeof options.baseUrl !== 'string') {
    throw new Error('Api "baseUrl" string required');
  }

  if(typeof options.baseUrl !== 'string') {
    throw new Error('Api "version" string required');
  }

  this.options = options || {};
  this.resources = [];
  this.actions = {};
}

Api.prototype.resource = function(noun, options) {
  var res = Resource(noun, options);
  this.resources.push(res);
  return res;
}

Api.prototype.action = function(method, verb, options) {
  var action = Action(method, verb, options);
  this.actions.push(action);
  return action;
}

function Action(method, verb, options) {
  if(!(this instanceof Action)) {
    return new Action(method, verb, options);
  }

  if(typeof method !== 'string') {
    throw new Error('Action "method" string required');
  }

  this.method = method;
  this.verb = verb;
  this.options = options;
}

var Crud = {
  create: Action('post', null),
  list: Action('get', null),
  
  read: Action('get', null),
  update: Action('put', null),
  delete: Action('delete', null),
};

function Resource(noun, options) {
  if(!(this instanceof Resource)) {
    return new Resource(noun, options);
  }
  
  if(typeof noun !== 'string') {
    throw new Error('Resource name required.');
  }

  this.noun = noun;
  this.options = options || {};
  this.parents = [];
  this.children = [];
  this.statics = {};
  this.methods = {};
}

Resource.prototype.hasMany = function hasMany(resources) {
  if(!Array.isArray(resources)) resources = [resources];
  for(var key in resources) {
    if(!resources.hasOwnProperty(key)) continue;
    var res = resources[key];
    if(!(res instanceof Resource)) {
      throw new Error('Resource "'+noun'".hasMany() passed a non-resource '+res);
    }
    if(this.children.indexOf(res) === -1) {
      this.children.push(res);
    }
  }
  return this;
}

Resource.prototype.belongsTo = function belongsTo(resources) {
  if(!Array.isArray(resources)) resources = [resources];
  for(var key in resources) {
    if(!resources.hasOwnProperty(key)) continue;
    var res = resources[key];
    if(!(res instanceof Resource)) {
      throw new Error('Resource "'+noun'".belongsTo() passed a non-resource '+res);
    }
    if(this.parents.indexOf(res) === -1) {
      this.parents.push(res);
    }
  }
  return this;
}

Resource.prototype.static = function(actions) {
  if(!Array.isArray(actions)) actions = [actions];
  for(var key in actions) {
    if(!actions.hasOwnProperty(key)) continue;
    var action = actions[key];
    if(!(action instanceof Resource)) {
      throw new Error('Resource "'+noun'".belongsTo() passed a non-actionource '+action);
    }
    if(this.statics.indexOf(action) === -1) {
      this.statics.push(action);
    }
  }
  return this;
}

Resource.prototype.method = function(actions) {
  if(!Array.isArray(actions)) actions = [actions];
  for(var key in actions) {
    if(!actions.hasOwnProperty(key)) continue;
    var action = actions[key];
    if(!(action instanceof Resource)) {
      throw new Error('Resource "'+noun'".belongsTo() passed a non-actionource '+action);
    }
    if(this.methods.indexOf(action) === -1) {
      this.methods.push(action);
    }
  }
  return this;
}

var statics = ['create', 'list'];
statics.forEach(function(fn) {
  Resource.prototype[fn] = function(options) {
    this.statics[fn] = Crud[fn];
    return this;
  }
});

var methods = ['read', 'update', 'delete'];
methods.forEach(function(fn) {
  Resource.prototype[fn] = function() {
    this.methods[fn] = Crud[fn];
    return this;
  }
});

Resource.prototype.crud = function crud() {
  var fns = methods.concat(statics);
  fns.forEach(function(fn) {
    this[fn]();
  }, this);
  return this;
}


module.exports = Customer;
Customer.Api = Api;
Customer.Resource = Resource;
Customer.Action = Action;
Customer.Util = {Crud: Crud};

