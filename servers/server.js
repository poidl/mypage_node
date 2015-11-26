// some of this is copied from http://eloquentjavascript.net/20_node.html

var http = require("http");
var fs = require("fs")

var mymap = {
  framed : [
    // framed
    {prettyurl:"/", resource:"./framed/intro.html"},
    {prettyurl:"/intro", resource:"./framed/intro.html"},
    {prettyurl:"/skills", resource:"./framed/skills.html"},
    {prettyurl:"/programming", resource:"./framed/programming.html"},
    {prettyurl:"/publications", resource:"./framed/publications.html"},
    {prettyurl:"/cv", resource:"./framed/cv.html"}
  ],
  unframed : [
    {prettyurl:"/rotatingtable", resource:"./rotatingtable.html"}
  ],
  idx: idx
}

// operates on map
function idx(url,arrayname,urltype) {
  for (i = 0; i < this[arrayname].length; i++) {
    if (this[arrayname][i][urltype] == url) {
      return this[arrayname][i]
    }
  }
  return false
}

function respond(code, body, response) {
  // if (!type) type = "text/plain";
  response.writeHead(code);
  if (body && body.pipe)
    body.pipe(response);
  else
    response.end(body);
}

myget = function(path, respond, response) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      respond(404, "File not found", response);
    else if (error)
      respond(500, error.toString());
    else
      respond(200, fs.createReadStream(path), response)
              // require("mime").lookup(path));
  });
};

http.createServer(function(request, response) {
  var path = require("url").parse(request.url).pathname;
  // requested is a framed page via pretty url
  if (obj=mymap.idx(path, "framed", "prettyurl")) {
    //AJAX - don't rebuild the frame
    // if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
    //   fileServer(request, response);
    // } else {
    // console.log("requested is a framed page directly via resource")
        console.log(obj.resource)
        myget(obj.resource,respond, response)
  }
  // else if (obj=mymap.idx(path, "framed", "resource"))
  else
    respond(404, "File not found", response);

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
