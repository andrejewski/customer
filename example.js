
var customer = require('customer');
var Api = customer.Api;
var Resource = customer.Resource;

var Github = Api('github', {
  baseUrl: 'https://api.github.com/v3',
  errors: [
    'authentication_error',
    'api_connection_error',
    'invalid_request_error',
    'rate_limit_error',
    'api_error',
  ]
});

var User = Resource('user', {});
var Org = Resource('org', {});
var Repo = Resource('repo', {});

User
  .belongsTo(Org)
  .hasMany(Repo);
  .read();
  .update();

Org
  .belongsTo(User)
  .hasMany(User)
  .hasMany(Repo);
  .crud();

Repo.crud();

module.exports = Github.hasMany([User, Org, Repo]);

