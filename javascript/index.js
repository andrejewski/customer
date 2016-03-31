
var co = require('co');
var path = require('path');
var util = require('../util');

module.exports = function build(dest, api) {
  return co(function*() {
    yield util.clean(dest);
    yield util.clone(path.join(__dirname, 'base'), dest);
    
    var template = util.template(path.join(__dirname, 'templates'), {api: api});

    var writes = [];

    writes.push(template('package', path.join(dest, 'package.json')));

    api.options.errors = [];
    writes.push(template('error', path.join(dest, 'errors.js')));

    writes.push(template('request', path.join(dest, 'request.js')));
    
    writes.push(template('index', path.join(dest, 'index.js')));
    api.resources.forEach(function(resource) {
      var filepath = path.join(dest, 'resources', resource.noun, 'index.js');
      writes.push(template('resource', filepath, {resource: resource}));
    });

    yield writes;
  });
  // create base application project
  // define authentication file
  // define error types (if api.options.errors)
  // define base api object file
  // define base request object file
  // define base resource class (Resource, ParentResource, ChildResource)
  // for resource
  //    create resources/#{noun}/index.js file
  //    for resource in parents
  //      create #{parent path}/#{subnoun}.js file > ChildResource
  //        in file define subnoun methods and statics
  //      add subresource to resource index
  //    for resource in children
  //      create #{parent path}/#{subnoun}.js file > ParentResource
  //        in file define subnoun methods and statics
  //    in file define noun method and statics
  //      add subresource to resource index
  //
  //    add resource to api index
}

/*
// index.js

var ${capitalize(api.name)} = require('./api');

Github.setBaseUrl(${api.options.baseUrl});

${#for resource in api.resources}
Github.${capitalize(resource.noun)} = require('./resource/${resource.noun}');
${/for}

module.exports = Github;
*/

