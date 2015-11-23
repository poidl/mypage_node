var http = require("http");

var ecstatic = require("ecstatic");

var fileServer = ecstatic({root: "/"});

// var servestatic = function(path) {
//
// }

var framed = ["/","/intro","/skills","/programming", "/publications", "/cv", "/contact"];
var unframed = ["/rotatingtable"];

var issubdirrequest = function(path) {
  urlregex = /^\/withFrame\/([^\/]+)$/;
  var repl = urlregex.exec(path);
  // is the part after subdirectory in framed?
  if (framed.indexOf( "/"+repl.slice(1) ) > -1)
    return repl
  else
    return false
}

http.createServer(function(request, response) {
  var path = require("url").parse(request.url).pathname;

  if (framed.indexOf(path) > -1) {
    response.write("<h1>framed</h1>"+
    "<p>request.url <code>" + request.url + "</p>"+
    "<p>path  <code>" + path + "</p>");
    response.end();
  }
  else if (bla = issubdirrequest(path)) {
    // AJAX - don't rebuild the frame
    // if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
    //   fileServer(request, response);
    // } else {
    //
    // }
    response.write("<h1>SUBDIRREQUEST</h1>"+
    "<p>request.url <code>" + request.url + "</p>"+
    "<p>path  <code>" + path + "</p>");
    response.end();
  }
  else // 404?
    fileServer(request, response);
  // if (!router.resolve(request, response))
    // fileServer(request, response);
}).listen(8080);


// var http = require("http");
// // The requestListener is a function which is automatically added to the 'request' event
// var requestListener = function(request, response) {
//     response.writeHead(200, {"Content-Type": "text/html"});
//     urlregex = /^\/withFrame\/([^\/]+)$/;
//     var path = require("url").parse(request.url).pathname;
//     var repl = urlregex.exec(path);
//     response.write("<h1>Hello!</h1>"+
//     "<p>request.url <code>" + request.url + "</p>"+
//     "<p>replace:  <code>" + repl + "</p>"+
//     "<p>slice(1):  <code>" + repl.slice(1) + "</p>");
//     response.end();
// }
//
// var server = http.createServer(requestListener);
// server.listen(8080);


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
