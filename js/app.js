'use strict';
// debugger;
// helper functions first, variables/constants, other functions, listeners.

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


var startButton = document.getElementById('startButton');
var prestart = document.getElementById('prestart');
var survey = document.getElementById('survey');
var header = document.getElementById('header');
var report = document.getElementById('report');
var reinitializeData = document.getElementById('reinitializeData');
var releaseTheHounds = document.getElementById('releaseTheHounds');

startButton.addEventListener('click', function (e) {
  e.preventDefault();
  header.style.display = 'none';
  prestart.style.display = 'none';
  survey.style.display = 'flex';
  launchIntoFullscreen(document.documentElement); // the whole page
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



