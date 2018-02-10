'use strict';
debugger;

//////////////////////////////////////////////////////////////////
//
// Helpers and misc functions.
// Would normally source from external libraries.
//

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
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Display a random product.
// Will need the logic to review products already displayed and not repeat them per the rules.
function displayThreeRandomProducts() {
  roundNum += 1;
  if (roundNum <= rounds) {
    // delete the div at the end with id "roundCounter"
    // add another div with a new "roundCounter"
    var roundCounter = document.getElementById('roundCounter');
    // survey is global
    survey.removeChild(roundCounter);

    roundCounter = document.createElement('div');
    roundCounter.id = 'roundCounter';

    var p = document.createElement('p');  
    var roundText = document.createTextNode('Round ' + roundNum + ' of ' + rounds + '.'); 
    p.appendChild(roundText);
    roundCounter.appendChild(p);
    survey.appendChild(roundCounter);


    // start with the copy of the full product array then
    // remove the products from the previous round.
    var availableProducts = Product.allProducts.slice();

    for (var pr = 0; pr < previousRound.length; pr++) {
      var index = availableProducts.indexOf(previousRound[pr]);
      availableProducts.splice(index, 1);
      console.log('availableProductsArray: ' + availableProducts);
    }

    previousRound = [];
    // pick three images, remove the selected image from this round.
    for (var i = 1; i <= 3; i++) {
      var imageElementId = document.getElementById('image' + i);

      var randomIndex = Math.floor(Math.random() * availableProducts.length);
      imageElementId.src = availableProducts[randomIndex].filepath;
      previousRound.push(availableProducts[randomIndex]);
      availableProducts.splice(randomIndex,1);
    }

  } else {
    alert('end of survey');
  }
}


recordSelect(e) {
  
}


//////////////////////////////////////////////////////////////////
//
// Variables and Contants
//

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
// Previous round array. Will contain three objects.
var previousRound = [];

const rounds = 4;
var roundNum = 0;



//////////////////////////////////////////////////////////////////
//
// Event listeners
//
startButton.addEventListener('click', function (e) {
  e.preventDefault();
  header.style.display = 'none';
  prestart.style.display = 'none';
  survey.style.display = 'flex';
  // launchIntoFullscreen(document.documentElement); // the whole page
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

// add an event listener to each image element
for (var i = 1; i <= 3; i++) {
  var imageElementId = document.getElementById('image' + i);
  imageElementId.addEventListener ('click', function(e){
    recordSelection(e);
    displayThreeRandomProducts();
  });
}

//////////////////////////////////////////////////////////////////
//
// Constructors
//

//Product constructor function
function Product(filepath) {
    this.filepath = filepath;
    this.productId = uuidv4();
    Product.allProducts.push(this);
}

//Survey response constructor function
function Survey(firstName) {
  this.firstName = firstName;
  this.ProductId = uuidv4();
  Survey.allSurveys.push(this);
}

//////////////////////////////////////////////////////////////////
//
// IIFEs
//
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


