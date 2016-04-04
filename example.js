
var customer = require('customer');
var Api = customer.Api;
var Resource = customer.Resource;
var Action = customer.Action;
var Crud = customer.Util.Crud;

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
  .hasOne(Org)
  .hasMany(Repo)
  .method(Crud.read)
  .method(Crud.update);

var Refund = Action('refund', 'post', 'refund', {});

Org
  .hasOne(User, 'owner')
  .hasMany(User)
  .hasMany(Repo)
  .method(Crud.create)
  .method(Refund, 'refund')
  .use(Crud);

Repo.use(Crud);

module.exports = Github
  .resource(User)
  .resource(Org)
  .resource(Repo);

