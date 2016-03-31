
var path = require('path');
var underscoreString = require('underscore.string');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var ejs = require('ejs');
var ncp = Promise.promisify(require('ncp').ncp);
var rimraf = Promise.promisify(require('rimraf'));
var mkdirp = Promise.promisify(require('mkdirp'));

function clean(dir) {
  return rimraf(dir);
}

function clone(src, dest) {
  return Promise.series([mkdirp(src), ncp(src, dest)]);
}

function template(dir, shared) {
  var templateCache = {};
  var helpers = {_: underscoreString};

  function write(filepath, data) {
    var dir = path.dirname(filepath);
    return Promise.each([mkdirp(dir), fs.writeFile(filepath, data)]);
  }

  function render(sourcePath, template, data) {
    var locals = Object.assign({}, shared, data);
    return ejs.render(template, locals, {filename: sourcePath});
  }

  return function _template(template, filepath, locals) {
    if(template.indexOf('.') === -1) template += '.ejs';
    var sourcePath = path.join(dir, template);
    var file = templateCache[template];
    if(file) {
      var text = render(sourcePath, file, locals);
      return write(filepath, text);
    }

    var file = fs.readFile(path.join(dir, template), {encoding: 'utf8'});
    return file.then(function(file) {
      templateCache[template] = file;
      var text = render(sourcePath, file, locals);
      return write(filepath, text);
    });
  }
}

