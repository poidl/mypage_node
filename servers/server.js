// // Copied from http://eloquentjavascript.net
//
// var http = require("http");
// var Router = require("./router");
// var ecstatic = require("ecstatic");
//
// var fileServer = ecstatic({root: "/"});
// var router = new Router();
//
// router.add(/^\/talks\/([^\/]+)$/,)
//
//
// http.createServer(function(request, response) {
//   if (!router.resolve(request, response))
//     fileServer(request, response);
// }).listen(8000);


var http = require("http");
// The requestListener is a function which is automatically added to the 'request' event
var requestListener = function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    urlregex = /^\/withFrame\/([^\/]+)$/;
    var path = require("url").parse(request.url).pathname;
    var repl = urlregex.exec(path);
    response.write("<h1>Hello!</h1>"+
    "<p>request.url <code>" + request.url + "</p>"+
    "<p>replace:  <code>" + repl + "</p>"+
    "<p>slice(1):  <code>" + repl.slice(1) + "</p>");
    response.end();
}

var server = http.createServer(requestListener);
server.listen(8080);


// var http = require("http");
// http.createServer(function(request, response) {
//   response.writeHead(200, {"Content-Type": "text/plain"});
//   request.on("data", function(chunk) {
//     response.write(chunk.toString().toUpperCase());
//   });
//   request.on("end", function() {
//     response.end();
//   });
// }).listen(8080);
