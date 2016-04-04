
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
    obj.singleRelations = obj.singleRelations.map(function(relation) {
      relation.resource = compileResource(relation.resource);
      return relation;
    });
    obj.multipleRelations = obj.multipleRelations.map(function(relation) {
      relation.resource = compileResource(relation.resource);
      return relation;
    });
    obj.statics = obj.statics.map(function(actor) {
      actor.action = compileAction(actor.action);
      return actor;
    });
    obj.methods = obj.methods.map(function(actor) {
      actor.action = compileAction(actor.action);
      return actor;
    });
  }
  return obj;
}

module.exports = function compile(api) {
  return compileApi(api);  
}

