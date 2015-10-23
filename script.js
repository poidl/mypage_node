
// // from http://diveintohtml5.info/history.html
// function setupHistoryClicks() {
//   addClicker(document.getElementById("home"));
//   addClicker(document.getElementById("skills"));
// }
//
// function addClicker(link) {
//   link.addEventListener("click", function(e) {
// //     debugger
//     swapMainwindow(link.href);
//     //console.log("pushState with: " + link.href);
//     history.pushState(null, null, link.href);
//     e.preventDefault();
//   }, false);
// }

var container = document.getElementById('leftDrawer');
container.addEventListener('click', navlink_clicked, false);

function navlink_clicked (e) {
  if (e.target != e.currentTarget) {
    e.preventDefault();
    swapMainwindow(e.target.href);
    //console.log("pushState with: " + e.target.href);
    history.pushState(null, null, e.target.href);
  }
  e.stopPropagation();
}


function swapMainwindow(href) {
  var xhttp = new XMLHttpRequest();
  //console.log("swapMainwindow: "+href)
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      document.getElementById("mainPanel").innerHTML = xhttp.responseText;
    }
  }
  // href is the url we want to appear on the address bar. e.g. "hoitaus.com/skills.html". but skills.html is in directory "content"
  xhttp.open("GET", "content/" + href.split('/').pop(), true); // true: asynchronously
  xhttp.send();
  //setupHistoryClicks();
}

window.onload = function() {
  swapMainwindow(location.href + "intro.html");
  //console.log("pushState with: " + location.href +"intro.html");
  history.pushState(null, null, location.href + "intro.html");
  window.addEventListener("popstate", doit, false);

  function doit(e) {
    //console.log('popstate fired!');
    //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    swapMainwindow(location.href);
  }
}

// function loadDoc(filename) {
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (xhttp.readyState == 4 && xhttp.status == 200) {
//       document.getElementById("mainPanel").innerHTML = xhttp.responseText;
//     }
//   }
//   xhttp.open("GET", filename, true); // true: asynchronously
//   xhttp.send();
// }
//
// // load intro page as default
// window.onload = function() {
//   loadDoc('content/intro.html');
//   // loadDoc('content/skills.html');
// };



function navdrawer_close() {
  appbarElement.classList.remove('open');
  navdrawerContainer.classList.remove('open');
}

function navdrawer_toggle() {
  var isOpen = navdrawerContainer.classList.contains('open');
  if(isOpen) {
    navdrawer_close();
  } else {
    appbarElement.classList.add('open');
    navdrawerContainer.classList.add('open');
  }
}

// load document and close navdrawer after click
function loadnav(filename) {
  window.loadDoc(filename);
  window.navdrawer_close();
}

// event listener for app-bar button, to toggle navdrawer on click
var navdrawerContainer = document.querySelector('.navdrawer');
var appbarElement = document.querySelector('.app-bar');

var menuBtn = document.querySelector('.menu');
menuBtn.addEventListener('click', function() {
  window.navdrawer_toggle();
}, true);
