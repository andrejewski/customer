
function compileApi(api) {
  var obj = api.toObject();
  obj.resources = api.resources.map(function(res) {
    return compileResource(res, true);
  });
  obj.actions = api.actions.map(compileAction);
  return obj;
}

function compileAction(action) {
  return action.toObject();
}

function compileResource(resource, recurse) {
  var obj = resource.toObject();
  if(recurse) {
    obj.parents = obj.parents.map(compileResource);
    obj.children = obj.children.map(compileResource);
    obj.statics = obj.statics.map(compileAction);
    obj.methods = obj.methods.map(compileAction);
  }
  return obj;
}

module.exports = function compile(api) {
  return compileApi(api);  
}

