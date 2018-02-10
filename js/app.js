'use strict';
debugger;


// helper functions
//   - multiple browser support for requestFullScreen()
//   - UUID generator
// variables/constants
// other functions
// listeners.



// multiple browser support.
function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Weak, but 'close enough' UUID generator
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Display a random product.
// Will need the logic to review products already displayed and not repeat them per the rules.
function displayThreeRandomProducts() {

  for (var i = 1; i <= 3; i++) {
    var imageElementId = document.getElementById('image' + i);
    var randomIndex = Math.floor(Math.random() * Product.allProducts.length);
    imageElementId.src = Product.allProducts[randomIndex].filepath;
  }
}


var startButton = document.getElementById('startButton');
var prestart = document.getElementById('prestart');
var survey = document.getElementById('survey');
var header = document.getElementById('header');
var report = document.getElementById('report');
var reinitializeData = document.getElementById('reinitializeData');
var releaseTheHounds = document.getElementById('releaseTheHounds');
//Product objects
Product.allProducts = [];
//Survey response objects
Survey.allSurveys = [];

startButton.addEventListener('click', function (e) {
  e.preventDefault();
  header.style.display = 'none';
  prestart.style.display = 'none';
  survey.style.display = 'flex';
  launchIntoFullscreen(document.documentElement); // the whole page
  displayThreeRandomProducts();
});

report.addEventListener('click', function (e) {
  alert('You clicked reports. \nSorry there are no reports yet.');
});

reinitializeData.addEventListener('click', function (e) {
  alert('This will reset all survey data. \nAre you sure?');
  location.reload();
});

releaseTheHounds.addEventListener('click', function (e) {
  alert('Hounds released.');
  // location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});



//Product constructor function
function Product(filepath) {
    this.filepath = filepath;
    this.ProductId = uuidv4();
    Product.allProducts.push(this);
}

//Survey response constructor function
function Survey(firstName) {
  this.firstName = firstName;
  this.ProductId = uuidv4();
  Survey.allSurveys.push(this);
}


(function initProducts() {
  new Product('img/bag.jpg');
  new Product('img/banana.jpg');
  new Product('img/bathroom.jpg');
  new Product('img/boots.jpg');
  new Product('img/breakfast.jpg');
  new Product('img/bubblegum.jpg');
  new Product('img/chair.jpg');
  new Product('img/cthulhu.jpg');
  new Product('img/dog-duck.jpg');
  new Product('img/dragon.jpg');
  new Product('img/pen.jpg');
  new Product('img/pet-sweep.jpg');
  new Product('img/tauntaun.jpg');
  new Product('img/unicorn.jpg');
  new Product('img/wine-glass.jpg');
  new Product('img/water-can.jpg');
  new Product('img/usb.gif');
})();


