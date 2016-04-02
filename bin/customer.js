#!/usr/bin/env node

var co = require('co');
var path = require('path');
var compile = require('../compile');
var package = require('../package');

var args = process.argv.slice(2);
var customerFile = args[0];

if(!args.length) {
  var help = [
    "customer: polygot client libraries for APIs",
    " version: "+package.version,
    "   usage: ",
    " $ customer customerFile [destinationDir=libraries]",
    "      where customerFile is a Node module (e.g. customer.js)",
    "        and destinationDir is the directory the libraries will be placed,",
    "            the default destination is \"libraries\".",
  ].join('\n');
  return console.log(help);
}

if(!customerFile) {
  throw new Error('Customer file must be the first argument.');
}

if(customerFile.charAt(0) !== path.sep) {
  customerFile = path.join(process.cwd(), customerFile);
}

var customerData = require(customerFile);
var customerJson = compile(customerData);

var destDir = args[2] || 'libraries';
if(destDir.charAt(0) !== path.sep) {
  var destPath = path.join(process.cwd(), destDir);
}

var languages = [
  'javascript',
];

co(function*() {
  for(var key in languages) {
    if(!languages.hasOwnProperty(key)) continue;
    var language = languages[key];
    var libPath = path.join(destPath, language);
    yield require('../'+language)(libPath, customerJson);
  }
}).then(function() {
    console.log('Customer library builds completed with no error.');
    process.exit(0);
  }, function(error) {
    console.error(error.stack);
  });

