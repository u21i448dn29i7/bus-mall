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

function exitFromFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

// a function to improve rounding
function round(value, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

// Weak, but 'close enough' UUID generator for primary key of Survey objects
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Display a random product.
function runSurveyRound() {
  roundNum += 1;
  if (roundNum <= rounds) {
    // creates a counter at the bottom of the survey page.
    var roundCounter = document.getElementById('roundCounter');
    surveySectionId.removeChild(roundCounter);
    roundCounter = document.createElement('div');
    roundCounter.id = 'roundCounter';

    var p = document.createElement('p');
    var roundText = document.createTextNode('Round ' + roundNum + ' of ' + rounds + '.');
    p.appendChild(roundText);
    roundCounter.appendChild(p);
    surveySectionId.appendChild(roundCounter);

    // clone the product array then remove products 
    // from the previous round
    var availableProducts = Product.allProducts.slice();

    for (let i = 0; i < previousRound.length; i++) {
      var index = availableProducts.indexOf(previousRound[i]);
      availableProducts.splice(index, 1);
    }

    // reset previousRound array to support the current round
    previousRound = [];

    // pick three images and remove the selected image from availableProducts
    for (let i = 1; i <= 3; i++) {
      var surveySectionDivElementId = document.getElementById('image' + i);

      // get a random product and set it's image as the div background
      var randomIndex = Math.floor(Math.random() * availableProducts.length);
      surveySectionDivElementId.style.backgroundImage = 'url(\'' + availableProducts[randomIndex].filepath + '\')';
      surveySectionDivElementId.name = availableProducts[randomIndex].productName;

      // clean up before moving on:
      availableProducts[randomIndex].displayCount += 1;
      previousRound.push(availableProducts[randomIndex]);
      availableProducts.splice(randomIndex, 1);
    }
  } else {
    // remove listeners
    for (let i = 1; i <= 3; i++) {
      // get the each image ID in the html
      surveySectionDivElementId = document.getElementById('image' + i);
      surveySectionDivElementId.removeEventListener('click', handleProductSelection);
    }
    // end of survey
    exitFromFullscreen();
    generatePercentageSelected();

    var strAllProducts = JSON.stringify(Product.allProducts);
    localStorage.setItem('allProducts', strAllProducts);

    displayReports();
  }
}

function makeChart() {
  var sortedResults = Product.allProducts.slice();

  // ORDER BY selectedCount DESC
  sortedResults.sort(function (a, b) {
    return a.selectedCount - b.selectedCount;
  });
  sortedResults.reverse();

  var labels = [];
  for (let i = 0; i < sortedResults.length; i++) {
    labels.push(sortedResults[i].productName);
  }

  var data = [];
  for (let i = 0; i < sortedResults.length; i++) {
    data.push(sortedResults[i].selectedCount);
  }

  var context = document.getElementById('barChartsAreBoring').getContext('2d');
  var barChartsAreBoring = new Chart(context, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Product Votes',
        data: data,
        backgroundColor: palette('rainbow', sortedResults.length).map(function (hex) {
          return '#' + hex;
        })
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize : 1
          }
        }],
        xAxes: [{
          ticks: {
            autoSkip: false
          }
        }]
      }
    }
  });
}

function generatePercentageSelected() {
  for (let i = 0; i < Product.allProducts.length; i++) {

    var numerator = Product.allProducts[i].selectedCount;
    var denominator = Product.allProducts[i].displayCount;

    if (denominator > 0) {
      Product.allProducts[i].percentageSelectedOfTotalDisplayed = round(((numerator / denominator) * 100), 2);
    } else {
      Product.allProducts[i].percentageSelectedOfTotalDisplayed = 0;
    }
  }
}

function displayReports() {
  headerId.style.display = 'flex';
  prestartSectionId.style.display = 'none';
  surveySectionId.style.display = 'none';
  resultsSectionID.style.display = 'block';

  var resultsUlElement = document.createElement('ul');

  // ORDER BY percentageSelectedOfTotalDisplayed DESC
  Product.allProducts.sort(function (a, b) {
    return a.percentageSelectedOfTotalDisplayed - b.percentageSelectedOfTotalDisplayed;
  });
  Product.allProducts.reverse();


  for (let i = 0; i < Product.allProducts.length; i++) {
    var liElement = document.createElement('li');
    var text = Product.allProducts[i].productName + ' displayed ' + Product.allProducts[i].displayCount + ' times with ' + Product.allProducts[i].selectedCount + ' votes. (' + Product.allProducts[i].percentageSelectedOfTotalDisplayed + '%)';
    liElement.appendChild(document.createTextNode(text));
    resultsUlElement.appendChild(liElement);
  }

  resultsSectionID.appendChild(resultsUlElement);
  makeChart();
}

//////////////////////////////////////////////////////////
//
// Variables and Constants
//
var headerId = document.getElementById('header');
var prestartSectionId = document.getElementById('prestartSection');
var surveySectionId = document.getElementById('surveySection');
var resultsSectionID = document.getElementById('resultsSection');

var report = document.getElementById('report');
var start = document.getElementById('start');
var reinitializeData = document.getElementById('reinitializeData');
var releaseTheHounds = document.getElementById('releaseTheHounds');


Product.allProducts = [];
Survey.allSurveys = [];
var previousRound = [];

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

  headerId.style.display = 'none';
  prestartSectionId.style.display = 'none';
  surveySectionId.style.display = 'block';
  launchIntoFullscreen(document.documentElement); // the whole page
  runSurveyRound();

});


start.addEventListener('click', function (e) {
  location.reload();
});

report.addEventListener('click', function (e) {
  displayReports();
});

reinitializeData.addEventListener('click', function (e) {
  alert('Are you sure you want to initiate a Big Crunch? \nThis universe will be destroyed.\n\n\n(Don\'t panic. It just resets the survey data.)');
  localStorage.clear();
  location.reload();
});

releaseTheHounds.addEventListener('click', function (e) {
  //alert('Hounds released.');
  location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});


// add an event listener to each image element
for (var i = 1; i <= 3; i++) {
  var surveySectionDivElementId = document.getElementById('image' + i);
  surveySectionDivElementId.addEventListener('click', handleProductSelection);
}

function handleProductSelection(e) {
  e.preventDefault();

  for (let i = 0; i < Product.allProducts.length; i++) {
    if (Product.allProducts[i].productName === e.target.name) {
      Product.allProducts[i].selectedCount += 1;
    }
  }

  runSurveyRound();
}

//////////////////////////////////////////////////////////
//
// Constructors
//

//Product constructor function
function Product(filepath, productName) {
  this.filepath = filepath;
  this.productName = productName;
  this.productId = uuidv4();
  this.displayCount = 0;
  this.selectedCount = 0;
  this.percentageSelectedOfTotalDisplayed = 0;
  this.test = true;
  Product.allProducts.push(this);
}

//Survey response constructor function
function Survey(firstName) {
  this.surveyId = uuidv4();
  this.firstName = firstName;
  this.round;
  this.displayedProduct = [];
  this.selectedProduct;
  Survey.allSurveys.push(this);
}

//////////////////////////////////////////////////////////
//
// IIFEs
//
(function initProducts() {
  if (localStorage.allProducts) {
    var strAllProducts = localStorage.getItem('allProducts');
    Product.allProducts = JSON.parse(strAllProducts);
    console.log(Product.allProducts);
  } else {
    new Product('img/bag.jpg', 'R2-D2 Travel Bag');
    new Product('img/banana.jpg', 'Banana Slicer De-lux');
    new Product('img/bathroom.jpg', 'iPad Holder');
    new Product('img/boots.jpg', 'Rain Boots');
    new Product('img/breakfast.jpg', 'Instamatic Breakfast Maker');
    new Product('img/bubblegum.jpg', 'Bubblegum Flavored Meatballs');
    new Product('img/chair.jpg', 'Super Comfy Char');
    new Product('img/cthulhu.jpg', 'Monster Thing');
    new Product('img/dog-duck.jpg', 'Quacker for Dogs');
    new Product('img/dragon.jpg', 'Canned Dragon');
    new Product('img/pen.jpg', 'Pen cap multi-tool');
    new Product('img/pet-sweep.jpg', 'Pet torture device');
    new Product('img/tauntaun.jpg', 'Goo-less tauntaun sleeping bag');
    new Product('img/unicorn.jpg', 'Canned Unicorn');
    new Product('img/wine-glass.jpg', 'Wine glass');
    new Product('img/water-can.jpg', 'Water can');
    new Product('img/usb.gif', 'USB Thumb drive with animatronics');
  }
})();