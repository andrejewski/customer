
var path = require('path');
var underscoreString = require('underscore.string');
var pluralize = require('pluralize');
underscoreString.pluralize = pluralize;

var co = require('co');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var ejs = require('ejs');
var ncp = Promise.promisify(require('ncp').ncp);
var rimraf = Promise.promisify(require('rimraf'));
var mkdirp = Promise.promisify(require('mkdirp').mkdirp);

function clean(dir) {
  return rimraf(dir);
}

function clone(src, dest) {
  return co(function*() {
    yield mkdirp(src);
    yield ncp(src, dest);
  });
}

function template(dir, shared) {
  var templateCache = {};
  var helpers = {_: underscoreString};

  function write(filepath, data) {
    return co(function*() {
      yield mkdirp(path.dirname(filepath));
      yield fs.writeFileAsync(filepath, data);
    });
  }

  function render(sourcePath, template, data) {
    var locals = Object.assign({}, helpers, shared, data);
    var text = ejs.render(template, locals, {filename: sourcePath});
    var best; // at most 2 new lines seperating chucks
    while(best !== (text = text.replace('\n\n\n', '\n\n'))) {best = text;}
    return best;
  }

  return function _template(template, filepath, locals) {
    if(template.indexOf('.') === -1) template += '.ejs';
    var sourcePath = path.join(dir, template);
    var file = templateCache[template];
    if(file) {
      var text = render(sourcePath, file, locals);
      return write(filepath, text);
    }

    var file = fs.readFileAsync(path.join(dir, template), {encoding: 'utf8'});
    return file.then(function(file) {
      templateCache[template] = file;
      var text = render(sourcePath, file, locals);
      return write(filepath, text);
    });
  }
}

module.exports = {
  clean: clean,
  clone: clone,
  template: template,
};

