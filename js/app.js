'use strict';
// debugger;

//////////////////////////////////////////////////////////
//
// Helpers and misc functions.
// Would normally source from external libraries.
//

// multiple browser support for requestFullScreen()
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

// Weak, but 'close enough' UUID generator for primary key of Survey objects
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Display a random product.
function displayThreeRandomProducts() {
  roundNum += 1;
  if (roundNum <= rounds) {
    // this creates a simple counter at the bottom of the survey page.
    var roundCounter = document.getElementById('roundCounter');
    survey.removeChild(roundCounter);
    roundCounter = document.createElement('div');
    roundCounter.id = 'roundCounter';

    var p = document.createElement('p');  
    var roundText = document.createTextNode('Round ' + roundNum + ' of ' + rounds + '.'); 
    p.appendChild(roundText);
    roundCounter.appendChild(p);
    survey.appendChild(roundCounter);

    // start with the clone of the full product array then
    // remove the products from the previous round to create
    // an availableProducts array.
    var availableProducts = Product.allProducts.slice();

    for (var pr = 0; pr < previousRound.length; pr++) {
      var index = availableProducts.indexOf(previousRound[pr]);
      availableProducts.splice(index, 1);
      // console.log('availableProductsArray: ' + availableProducts);
    }

    // reset previousRound array to support the current round
    previousRound = [];

    // pick three images
    // remove the selected image from availableProducts so that it can't
    // be reused in this round
    for (var i = 1; i <= 3; i++) {
      // get the each image ID in the html
      var imageElementId = document.getElementById('image' + i);

      // get a random object from the availableProducts array.
      // set the filepath as the image src and set the name as the productId
      // (ehhhhh...)
      var randomIndex = Math.floor(Math.random() * availableProducts.length);
      imageElementId.src = availableProducts[randomIndex].filepath;
      imageElementId.name = availableProducts[randomIndex].productId;
      
      // clean up before moving on:
      // - increment display count
      // - add to previousRound array
      // - remove from availableProducts so it doesn't repeat
      availableProducts[randomIndex].displayCount += 1;
      previousRound.push(availableProducts[randomIndex]);
      availableProducts.splice(randomIndex,1);
    }
  } else {
    alert('end of survey');
    location.reload();   // during testing, just reload the whole site
  }
}

function recordSelection(e) {
  // into the current Survey object, push the round number, 
  // the displayed products per each round, and the product selected
  // into a multidimensional array for later tabulation.

  // alert(e.target.name);
  // selections.push(e.target.name);
  // alert(selections);


  for (var i = 1; i <= 3; i++) {
    // get the each image ID in the html
    var imageElementId = document.getElementById('image' + i);
    // imageElementId.name;   //for images displayed

  }


}

//////////////////////////////////////////////////////////
//
// Variables and Constants
//
// var start = document.getElementById('start');
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
var selections = [];

const rounds = 10;
var roundNum = 0;


//////////////////////////////////////////////////////////
//
// Event listeners
//
var form = document.querySelector('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var firstName = form.elements.firstName.value;

  if (!firstName) {
    alert('Please provide the subjects first name?');
  } else {
    new Survey(firstName);
    form.reset();
  }

  // hide the prestart and header then show the survey
  // and switch to full screen
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
  alert('Are you sure you want to initiate a Big Crunch? \n\n\n(Don\'t panic. It just resets the survey data.)');
  location.reload();
});

releaseTheHounds.addEventListener('click', function (e) {
  //alert('Hounds released.');
  location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

// add an event listener to each image element
for (var i = 1; i <= 3; i++) {
  var imageElementId = document.getElementById('image' + i);
  imageElementId.addEventListener ('click', function(e){
    e.preventDefault();

    recordSelection(e);
    displayThreeRandomProducts();

    // // temp debugging output
    // for (var temp = 0; temp < Product.allProducts.length; temp++) {
    //   console.log('Product: ' + Product.allProducts[temp].filepath + ', Count:' + Product.allProducts[temp].displayCount);
    // }

  });
}

//////////////////////////////////////////////////////////
//
// Constructors
//

//Product constructor function
function Product(filepath) {
  this.filepath = filepath;
  this.productId = uuidv4();
  this.displayCount = 0;
  this.selectedCount = 0;
  Product.allProducts.push(this);
}

//Survey response constructor function
function Survey(firstName) {
  this.surveyId = uuidv4();
  this.firstName = firstName;
  this.round;
  this.displayedProduct = [];
  this.selectedProduct;
  // this.product = Product.allProducts.slice();
  Survey.allSurveys.push(this);
}

//////////////////////////////////////////////////////////
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
