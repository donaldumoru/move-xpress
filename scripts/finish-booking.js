'use strict';

let userData = JSON.parse(sessionStorage.getItem('userDetails'));

let nextBtn = document.querySelector('.next');
let previousBtn = document.querySelector('.previous');
let progressBar = document.querySelector('.progress-bar');
let inputPassengerDetails = document.querySelector('.passenger-details');
let nextOfKinDetails = document.querySelector('.next-of-kin-details');
let steps = document.querySelectorAll('.step-info');

console.log(steps);

let progressCounter = 0;

// const collectUserInfo = function () {};

nextBtn.addEventListener('click', function () {
  // IF PROGRESS AT 100, REMOVE BUTTON////////////////////////////////////////////////////
  progressCounter = progressCounter + 50;
  progressBar.style.width = `${progressCounter}%`;

  for (let i = 0; i < steps.length; i++) {
    steps[i].style.padding = '5px';

    console.log(steps[i]);
    // steps[i].style.borderBottom = '3px solid black';
  }
});

previousBtn.addEventListener('click', function () {
  progressCounter = progressCounter - 50;

  progressBar.style.width = `${progressCounter}%`;
});
