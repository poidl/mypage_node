// some of this is copied from http://eloquentjavascript.net/20_node.html

var http = require("http");
var fs = require("fs")
var mustache = require('mustache');
// var fs = require("moustache")

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

var mymapnew = {
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

pagetype = {'/':'framed',
              '/intro':'framed',
              '/skills':'framed',
              '/programming':'framed',
              '/publications':'framed',
              '/cv':'framed',
              '/rotatingtable':'unframed'};

resources =   {'/':'./framed/intro.html',
              '/intro':'./framed/intro.html',
              '/skills':'./framed/skills.html',
              '/programming':'./framed/programming.html',
              '/publications':'./framed/publications.html',
              '/cv':'./framed/cv.html',
              '/rotatingtable':'./unframed/rotatingtable.html'};

// operates on map
// url: requested url      pagetype: framed or unframed    urltype: pretty or direct resource
function idx(url,pagetype,urltype) {
  for (i = 0; i < this[pagetype].length; i++) {
    if (this[pagetype][i][urltype] == url) {
      return this[pagetype][i]
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

fs_stat_promise = function(path) {
  var promise = new Promise( function(resolve, reject) {
    fs.stat(path, function(error, stats) {
      if (error)
        reject(error);
      else
        resolve(stats);
    });
  });
  return promise;
}

mygetnew = function(path, respond, response) {
  // TODO: stats is not used here
  fs_stat_promise(path).then( function(stats){
      respond(200, fs.createReadStream(path), response)
    })
    .catch( function(error) {
      response.writeHead(404);
      response.end('File not found');
      console.log("From mygetnew: Response failed: ", error.stack);
    });
}

fs_readFile_promise = function(file) {
  console.log('file: '+file)
  var promise = new Promise( function(resolve, reject) {
    fs.readFile(file, 'utf8', function(error, data) {
      if (error) {
        //TODO: log error
        console.log('Error in fs_readFile_promise: '+error.toString());
        reject(error);
      } else {
        console.log('reading data of file '+file)
        resolve(data);
      }
      });
    });
  return promise;
}

framing_promise = function(myarray) {
  var promise = new Promise( function(resolve, reject) {
    console.log('moustache')
    var rendered = mustache.render(myarray[0], {content: myarray[1]});
    console.log('rendered: '+rendered)
    //TODO: !rendered valid?
    if (!rendered)
      reject(error);
    else
      resolve(rendered);
    });
  return promise;
}

myrender = function(file) {
  // http://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain
  console.log('myrender 1')
  var a= fs_readFile_promise('./framed/frame.html');
  var b= fs_readFile_promise(file);

  return Promise.all([a, b]).then(function(myarray) {
        return framing_promise(myarray);
    });
  //.catch(function(error){ console.log('hoitaus')});
}


http.createServer(function(request, response) {
  var path = require("url").parse(request.url).pathname;
  // requested a framed page via pretty url
  ptype =  pagetype[path];
  resource = resources[path];
  if (ptype==='framed') {
    //AJAX - don't rebuild the frame
    if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
      mygetnew(resource,respond, response);
    } else {
      myrender(resource).then( function(data) {
        respond(200, data, response)
      }).catch( function(error) {
        response.writeHead(error.code);
        response.end(error.toString());
        console.log("Response failed: ", error.stack);
      })
    }
  // requested is an unframed page via pretty url
  } else if (ptype==='unframed'){
    mygetnew(resource, respond, response)
  // requested is a non-pretty url
  } else {
    // for css and png ??
    console.log('Direct: '+path)
    mygetnew('./'+path, respond, response)
  }
}).listen(8080);
