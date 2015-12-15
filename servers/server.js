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

// myget = function(path, respond, response) {
//   fs.stat(path, function(error, stats) {
//     if (error && error.code == "ENOENT")
//       respond(404, "File not found", response);
//     else if (error)
//       respond(500, error.toString(),response);
//     else
//       respond(200, fs.createReadStream(path), response)
//               // require("mime").lookup(path));
//   });
// };

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
      response.writeHead(500);
      response.end(error.toString());
      console.log("Response failed: ", error.stack);
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

framing_promise = function(content, frame) {
  var promise = new Promise( function(resolve, reject) {
    console.log('moustache')
    var rendered = mustache.render(frame, {content: content});
    console.log('rendered: '+rendered)
    //TODO: !rendered valid?
    if (!rendered)
      reject(error);
    else
      resolve(rendered);
    });
  return promise;
}

// myrender = function(file) {
//   console.log('myrender 1')
//   var a= fs_readFile_promise(file).then( function(content) {
//     console.log('myrender 2')
//     return fs_readFile_promise('./framed/frame.html');
//   }).then( function(frame) {
//     console.log('myrender 3')
//     console.log(frame)
//     console.log(content)
//
//     return framing_promise(content,frame);
//   });
//   //.catch(function(error){ console.log('hoitaus')});
// }

myrender = function(file) {
  // http://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain
  console.log('myrender 1')
  var a= fs_readFile_promise(file);
  var b= a.then( function(content) {
    console.log('myrender 2')
    return fs_readFile_promise('./framed/frame.html');
  });

  return Promise.all([a, b]).spread(function(content, frame) {
        // more processing
        return framing_promise(content,frame);
    });
  //.catch(function(error){ console.log('hoitaus')});
}


http.createServer(function(request, response) {
  var path = require("url").parse(request.url).pathname;
  // requested is a framed page via pretty url
  if (obj=mymap.idx(path, "framed", "prettyurl")) {
    //AJAX - don't rebuild the frame
    // console.log(request.headers)
    if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
      // console.log('AJAX request: '+obj.resource)
      mygetnew(obj.resource,respond, response)
    } else {
      // console.log('Framing: '+obj.resource)
      // console.log('calling readFile '+obj.resource);
      // fs.readFile(obj.resource, 'utf8', function(err,data_content) {
      //   if (err) throw err;
      //   // console.log('calling readFile /framed/frame.html');
      //   fs.readFile('./framed/frame.html', 'utf8', function(err,data_frame) {
      //     var rendered = mustache.render(data_frame, {content: data_content});
      //     // console.log(rendered)
        myrender(obj.resource).then( function(data) {
          console.log('rendered...')
          respond(200, data, response)
        }).catch( function(error) {
          console.log('Brrrrrrrr Error')
        })
    }
  }
  // else if (obj=mymap.idx(path, "framed", "resource"))
  else {
    // for css and png ??
    console.log('Direct: '+path)
    mygetnew('./'+path, respond, response)
    //respond(404, "File not found", response);
  }
}).listen(8080);
