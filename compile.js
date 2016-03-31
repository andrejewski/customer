
function compileApi(api) {
  var obj = api.toObject();
  obj.resources = api.resources.map(compileResource);
  obj.actions = api.actions.map(compileAction);
  return obj;
}

function compileAction(action) {
  return action.toObject();
}

function compileResource(resource) {
  var obj = resource.toObject();
  obj.parents = obj.parents.map(compileResource);
  obj.children = obj.children.map(compileResource);
  obj.statics = obj.statics.map(compileAction);
  obj.methods = obj.methods.map(compileAction);
  return obj;
}

module.exports = function compile(api) {
  return compileApi(api);  
}

