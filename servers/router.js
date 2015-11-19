// Copied from http://eloquentjavascript.net

var Router = module.exports = function() {
  this.routes = [];
};

Router.prototype.add = function(urlregex, handler) {
  this.routes.push({urlregex: urlregex,
                    handler: handler});
};

if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
  fileServer(request, response);
} else {

}

Router.prototype.resolve = function(request, response) {
  var path = require("url").parse(request.url).pathname;

  return this.routes.some(function(route) {
    var match = route.urlregex.exec(path);
    if !match
      return false;

    var urlParts = match.slice(1).map(decodeURIComponent);
    route.handler.apply(null, [request, response]
                                .concat(urlParts));
    return true;
  });
};
