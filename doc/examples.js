'use strict';
//array to store the objects
Goat.allGoats = [];

//make my constructor function
function Goat(name, filepath) {
    this.name = name;
    this.filepath = filepath;
    Goat.allGoats.push(this);
}

//use my constructor function to create new Goat instances
new Goat('Cruisin goat','img/cruisin-goat.jpg');
new Goat('Kissing goats', 'img/kissing-goat.jpg');
new Goat('Sassy goat', 'img/sassy-goat.jpg');
new Goat('Smiling goat', 'img/smiling-goat.jpg');
new Goat('Sweater goat', 'img/sweater-goat.jpg');

//listener, something to be clicked...events!!!
var imgEl = document.getElementById('goat-pic');

imgEl.addEventListener('click', randomGoat);

//randomly display one of the pictures
function randomGoat() {
    var randomIndex = Math.floor(Math.random() * Goat.allGoats.length);
    imgEl.src = Goat.allGoats[randomIndex].filepath;
}
randomGoat();