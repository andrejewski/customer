
function Api(name, options) {
  if(!(this instanceof Api)) {
    return new Api(name, options);
  }

  if(typeof name !== 'string') {
    throw new Error('Api "name" string is required.');
  }

  if(typeof options.baseUrl !== 'string') {
    throw new Error('Api option "baseUrl" string required (so not an option really)');
  }

  this.name = name;
  this.options = options;
  this.resources = [];
  this.actions = [];
}

Api.prototype.use = function(func, options) {
  func(this, options);
  return this;
}

Api.prototype.toObject = function() {
  return {
    type: 'api',
    name: this.name,
    resources: this.resources,
    actions: this.actions,
    options: this.options,
  };
}

Api.prototype.resource = function(resource) {
  if(!(resource instanceof Resource)) {
    var msg = 'Api '+this.name+'.resource() not passed a customer.Resource.';
    throw new Error(msg);
  }
  var existing = this.resources
    .filter(function(x) {return x.name === resource.name})
    .pop();
  if(existing) {
    var msg = 'Api '+this.name+'.resource('+resource.name+') conflicts with another resource named "'+existing name+'".';
    throw new Error(msg);
  }
  this.resources.push(resource);
  return this;
}

Api.prototype.action = function(action) {
  if(!(action instanceof Action)) {
    var msg = 'Api '+this.name+'.action() not passed a customer.Action.';
    throw new Error(msg);
  }
  var existing = this.actions
    .filter(function(x) {return x.name === action.name})
    .pop();
  if(existing) {
    var msg = 'Api '+this.name+'.action('+action.name+') conflicts with another action named "'+existing name+'".';
    throw new Error(msg);
  }
  this.actions.push(action);
  return this;
}

function Action(name, method, verb, options) {
  if(!(this instanceof Action)) {
    return new Action(name, method, verb, options);
  }

  if(typeof name !== 'string') {
    throw new Error('Action "name" string required');
  }
  
  if(typeof method !== 'string') {
    throw new Error('Action "method" string required');
  }

  this.name = name;
  this.method = method;
  this.verb = verb;
  this.options = options;
}

Action.prototype.toObject = function() {
  return {
    type: 'action',
    name: this.name,
    method: this.method,
    verb: this.verb,
    options: this.options,
  };
}

var Crud = (function() {
  var create = Action('create', 'post', null);
  var list = Action('list', 'get', null, {container: 'cursor'});
  var read = Action('read', 'get', null);
  var update = Action('update', 'put', null);
  var del = Action('delete', 'delete', null);
  
  function Crud(resource) {
    resource
      .static(create)
      .static(list)
      .method(read)
      .method(update)
      .method(del);
  }

  Crud.create = create;
  Crud.list = list;
  Crud.read = read;
  Crud.update = update;
  Crud.delete = del;

  return Crud;
}).call(this);

function Resource(name, options) {
  if(!(this instanceof Resource)) {
    return new Resource(name, options);
  }
  
  if(typeof name !== 'string') {
    throw new Error('Resource name required.');
  }

  this.name = name;
  this.options = options || {};
  this.singleRelations = [];
  this.multipleRelations = [];
  this.statics = [];
  this.methods = [];
}

Resource.prototype.use = function(func, options) {
  func(this, options);
  return this;
}

Resource.prototype.toObject = function() {
  return {
    type: 'resource',
    name: this.name,
    singleRelations: this.singleRelations,
    multipleRelations: this.multipleRelations,
    statics: this.statics,
    methods: this.methods,
  };
}

Resource.prototype._addRelation = function addRelation(prop, func, resource, name) {
  name = name || resource.name;
  if(!(resource instanceof Resource)) {
    var msg = 'Resource '+this.name+'.'+func+'() not passed a customer.Resource.';
    throw new Error(msg);
  }

  var existing = this[prop]
    .filter(function(x) {return x.name === name});
    .pop();
  if(existing) {
    var msg = 'Conflicting '+this.name+'.'+func+'('+resource.name+', '+name+') relation with name "'+name+'".';
    throw new Error(msg);
  }
  this[prop].push({name: name, resource: resource});
}

Resource.prototype.hasMany = function hasMany(resource, name) {
  this._addRelation('multipleRelations', 'hasMany', resource, name);
  return this;
}

Resource.prototype.hasOne = function hasOne(resource, name) {
  this._addRelation('singleRelations', 'hasOne', resource, name);
  return this;
}

Resource.prototype._addAction = function addAction(prop, func, action, name) {
  var name = name || action.name;
  if(!(action instanceof Action)) {
    var msg = 'Resource '+this.name+'.'+func+'() not passed a customer.Action.';
    throw new Error(msg);
  }

  var existing = this[prop]
    .filter(function(x) {return x.name === name;})
    .pop();
  if(existing) {
    var msg = 'Resource '+this.name+'.'+func+'('+action.name+', '+name+') conflict on name "'+name+'".';
    throw new Error(msg);
  }

  this[prop].push({
    name: name,
    action: action,
  });
}

Resource.prototype.static = function static(action, name) {
  this._addAction('statics', 'static', action, name);
  return this;
}

Resource.prototype.method = function method(action, name) {
  this._addAction('methods', 'method', action, name);
  return this;
}

module.exports = Customer = {};
Customer.Api = Api;
Customer.Resource = Resource;
Customer.Action = Action;
Customer.Util = {Crud: Crud};

