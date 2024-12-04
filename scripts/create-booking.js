'use strict';

const routeData = JSON.parse(sessionStorage.getItem('routeData'));

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let routeInfo = document.querySelector('.user-route-info');
let busImage = document.querySelector('.bus-image');
let busName = document.querySelector('.bus-name');
let busRoute = document.querySelector('.bus-route');
let seatsAvailable = document.querySelector('.seats-available');
let travelTime = document.querySelector('.time');
let passengersNumber = document.querySelector('.passengers');
let price = document.querySelector('.price');
let cashBack = document.querySelector('.cash-back');
let viewSeatButton = document.querySelector('.view-seats');
let selectSeatsContainer = document.querySelector('.select-seats-container ');
let seats = document.querySelectorAll('.seat');

const [year, month, day] = routeData.date.split('-');

const busAndRoutInfo = function () {
  routeInfo.textContent = `${routeData.fromCity} => ${
    routeData.departureLocation
  } to ${routeData.toCity} ==> ${routeData.arrivalLocation} -- ${
    months[Number(month - 1)]
  } ${day}, ${year}. ${routeData.passengers} ${
    routeData.passengers <= 1 ? 'Passenger' : 'Passengers'
  }`;

  busImage.src = `/images/${routeData.busName.split(' ')[1].toLowerCase()}.jpg`;

  busName.textContent = `${routeData.busName.split(' ')[0]} (${routeData.busName
    .split(' ')
    .slice(1)
    .join(' ')})`;

  busRoute.textContent = `Departure: ${routeData.fromCity} => ${routeData.departureLocation} • Arrival: ${routeData.toCity} ==> ${routeData.arrivalLocation}`;

  seatsAvailable.textContent = `${routeData.seatCapacity} seats(available)`;

  travelTime.textContent = routeData.departureTime;

  passengersNumber.textContent = `${
    routeData.passengers <= 1 ? 'Passenger:' : 'Passengers:'
  } ${routeData.passengers}`;

  price.textContent = `₦${routeData.price}`;
};

busAndRoutInfo();

// FUNCTION TO CALCULATE THE CASHBACK
// FIXLATER FIX THIS TO CALCULATE CASHBACK BASED ON DIFFERENCE BETWEEN PURCHASE DATE AND DEPARTURE DATE
const calcCashBack = function (routePrice) {
  let cashBackOptions = [0.02, 0.04, 0.06, 0.08];

  let randomCashback = Math.floor(Math.random() * cashBackOptions.length);

  return routePrice * cashBackOptions[randomCashback];
};

cashBack.textContent = `Cashback: ₦${calcCashBack(routeData.price)}`;

console.log(routeData);

const selectSeats = function () {};

// INITIALIZA EMPTY ARRAY TO STORE SEATS TAKEN
let seatsTaken = [];

// FUNCTION TO DISPLAY THE SEAT SELECTOR
viewSeatButton.addEventListener('click', function () {
  selectSeatsContainer.style.display = 'flex';
});

// FOR LOOP FOR USER TO SELECT SEATS
for (let i = 0; i < seats.length; i++) {
  seats[i].addEventListener('click', function () {
    // SET SEAT COLOR BASED ON AVAILABLE SEATS
    if (seats[i].src.endsWith('seat_available.svg')) {
      seats[i].src = 'images/seat_clicked.svg';
    } else {
      seats[i].src = 'images/seat_available.svg';
    }
  });
}
