'use strict';
debugger;

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
function runSurveyRound() {
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

    for (let i = 0; i < previousRound.length; i++) {
      var index = availableProducts.indexOf(previousRound[i]);
      availableProducts.splice(index, 1);
      // console.log('availableProductsArray: ' + availableProducts);
    }

    // reset previousRound array to support the current round
    previousRound = [];

    // pick three images
    // remove the selected image from availableProducts so that it can't
    // be reused in this round
    for (let i = 1; i <= 3; i++) {
      // get the each image ID in the html
      var imageElementId = document.getElementById('image' + i);

      // get a random object from the availableProducts array.
      // set the filepath as the image src and set the name as the productName
      // (ehhhhh...)
      var randomIndex = Math.floor(Math.random() * availableProducts.length);
      imageElementId.src = availableProducts[randomIndex].filepath;
      imageElementId.name = availableProducts[randomIndex].productName;
      
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
    displayReports();
    // location.reload();   // during testing, just reload the whole site
  }
}


function displayReports() {
  header.style.display = 'flex';
  prestart.style.display = 'none';
  survey.style.display = 'none';
  resultsSectionID.style.display = 'block';
  
  var resultsUlElement = document.createElement('ul');
  
  for (let i = 0; i < Product.allProducts.length; i++) {
    var liElement = document.createElement('li');
    // 3 votes for the Banana Slicer
    var text = Product.allProducts[i].selectedCount + ' votes for ' + Product.allProducts[i].productName; 
    liElement.appendChild(document.createTextNode(text));
    resultsUlElement.appendChild(liElement);
  }

  resultsSectionID.appendChild(resultsUlElement);

}


// function recordSelection(e) {
//   // into the current Survey object, push the round number, 
//   // the displayed products per each round, and the product selected
//   // into a multidimensional array for later tabulation.

//   // alert(e.target.name);
//   // selections.push(e.target.name);
//   // alert(selections);

//   // image1,image2,image3,selectedImaged

//   var newArrayElement = [[]];

//   for (let i = 1; i <= 3; i++) {
//     // get the each image ID in the html
//     var imageElementId = document.getElementById('image' + i);
//     newArrayElement[roundNum-1].push(imageElementId.name);
//   }

//   //push the selected image last
//   newArrayElement[roundNum-1].push(e.target.name);

// }

//////////////////////////////////////////////////////////
//
// Variables and Constants
//
// var start = document.getElementById('start');
var prestart = document.getElementById('prestart');
var survey = document.getElementById('survey');
var header = document.getElementById('header');
var report = document.getElementById('report');
var resultsSectionID = document.getElementById('resultsSection');
var reinitializeData = document.getElementById('reinitializeData');
var releaseTheHounds = document.getElementById('releaseTheHounds');


//Product objects
Product.allProducts = [];
//Survey response objects
Survey.allSurveys = [];
// Previous round array. Will contain three objects.
var previousRound = [];
var selections = [];

var rounds = 0;
var roundNum = 0;


//////////////////////////////////////////////////////////
//
// Event listeners
//
var form = document.querySelector('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var firstName = form.elements.firstName.value;
  rounds = form.elements.rounds.value;

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
  runSurveyRound();

});


report.addEventListener('click', function (e) {
  // alert('You clicked reports. \nSorry there are no reports yet.');
  document.getElementById(resultsSectionID).removeChild('ul');
  displayReports();
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

    // recordSelection(e);    // this function, later, will tally responses from multiple subjects.

    for (let i = 0; i < Product.allProducts.length; i++) {
      if (Product.allProducts[i].productName === e.target.name) {
        Product.allProducts[i].selectedCount += 1;
      }
    }

    runSurveyRound();

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
function Product(filepath,productName) {
  this.filepath = filepath;
  this.productName = productName;
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
  new Product('img/bag.jpg', 'R2-D2 Travel Bag');
  new Product('img/banana.jpg','Banana Slicer De-lux');
  new Product('img/bathroom.jpg','iPad Holder');
  new Product('img/boots.jpg', 'Rain Boots');
  new Product('img/breakfast.jpg','Instamatic Breakfast Maker');
  new Product('img/bubblegum.jpg','Bubblegum Flavored Meatballs');
  new Product('img/chair.jpg','Super Comfy Char');
  new Product('img/cthulhu.jpg','Monster Thing');
  new Product('img/dog-duck.jpg','Quacker for Dogs');
  new Product('img/dragon.jpg','Canned Dragon');
  new Product('img/pen.jpg','Pen cap multi-tool');
  new Product('img/pet-sweep.jpg','Pet torture device');
  new Product('img/tauntaun.jpg','Goo-less tauntaun sleeping bag');
  new Product('img/unicorn.jpg','Canned Unicorn');
  new Product('img/wine-glass.jpg','Wine glass');
  new Product('img/water-can.jpg','Water can');
  new Product('img/usb.gif','USB Thumb drive with animatronics');
})();
