'use strict';

let routeData = JSON.parse(sessionStorage.getItem('routeDetails'));

let bookingInfoContainer = document.querySelector('.booking-info-container');
let busInfoContainer = document.querySelector('.bus-info-container');
let selectSeatsContainer = document.querySelector('.select-seats-container ');
let confirmSeatsBtn = document.querySelector('.confirm-seats-button');
let overlay = document.querySelector('.overlay');
let allSeats;

console.log(routeData);

routeData.selectedSeats = [];

routeData.busSeats = function (bus) {
  let seatCounter = 0;
  let seatsPerRow = 3;

  for (let i = 0; i < bus.seatCapacity / 3; i++) {
    const seatsRow = document.createElement('div');
    seatsRow.classList.add('seats-row');
    selectSeatsContainer.append(seatsRow);

    for (let i = 0; i < seatsPerRow; i++) {
      seatCounter++;

      const seat = document.createElement('img');
      seat.classList.add('seat');
      seat.src = '/images/seat_available.svg';
      seatsRow.append(seat);
    }
  }
};

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

const displayAvailableBuses = function () {
  fetch('./buses.json')
    .then(response => response.json())
    .then(json => {
      // console.log(json);

      const populateWithBuses = function (buses) {
        const travelMonth = months[Number(routeData.date.split('-')[1] - 1)];
        const travelDate = routeData.date.split('-')[2];
        const travelYear = routeData.date.split('-')[0];
        const dateOfTravel = `${travelMonth} ${travelDate}, ${travelYear}`;

        const passengerStr = `${
          routeData.numPassengers > 1 ? 'Passengers' : 'Passenger'
        }`;

        const toCityStr = routeData.toCity.split('=>').join('==>');

        const userRouteInfo = document.createElement('p');
        userRouteInfo.classList.add('user-route-info');
        userRouteInfo.textContent = `${routeData.fromCity} to ${toCityStr} -- ${dateOfTravel}. ${routeData.numPassengers} ${passengerStr}`;
        bookingInfoContainer.appendChild(userRouteInfo);

        buses.forEach(function (bus, index) {
          const totalPrice = Math.round(
            calcTravelFare(
              convertMetersToKm(routeData.distanceValue),
              bus.rate,
              bus.multiplier
            ) * routeData.numPassengers
          );

          const bookingInfoWrapper = document.createElement('div');
          bookingInfoWrapper.classList.add('booking-info-wrapper');
          bookingInfoContainer.appendChild(bookingInfoWrapper);

          const busImageWrapper = document.createElement('div');
          busImageWrapper.classList.add('bus-image-wrapper');
          bookingInfoWrapper.appendChild(busImageWrapper);

          const busImage = document.createElement('img');
          busImage.classList.add('bus-image');
          busImage.src = bus.image;
          busImageWrapper.appendChild(busImage);

          const bookingInfo = document.createElement('div');
          bookingInfo.classList.add('booking-info');
          bookingInfoWrapper.appendChild(bookingInfo);

          const busName = document.createElement('p');
          busName.classList.add('bus-name');
          busName.textContent = bus.busName;
          bookingInfo.appendChild(busName);

          const busRoute = document.createElement('p');
          busRoute.classList.add('bus-route', 'user-route-info');
          busRoute.textContent = `Departure: ${routeData.fromCity} • Arrival: ${toCityStr}`;
          bookingInfo.appendChild(busRoute);

          const seatsAndTime = document.createElement('div');
          seatsAndTime.classList.add('seats-and-time');
          bookingInfo.appendChild(seatsAndTime);

          const seatsAvailable = document.createElement('p');
          seatsAvailable.classList.add('seats-available');
          seatsAndTime.textContent = `${bus.seatCapacity} ${
            bus.seatCapacity > 1 ? 'seats' : 'seat'
          }(available)`;
          seatsAndTime.appendChild(seatsAvailable);

          const timeDisplay = document.createElement('p');
          timeDisplay.classList.add('time');
          timeDisplay.textContent = bus.departureTime;
          seatsAndTime.appendChild(timeDisplay);

          const passengersDisplay = document.createElement('p');
          passengersDisplay.classList.add('passengers');
          passengersDisplay.textContent = `${passengerStr}: ${routeData.numPassengers}`;
          bookingInfo.appendChild(passengersDisplay);

          const priceAndButton = document.createElement('div');
          priceAndButton.classList.add('price-and-button');
          bookingInfoWrapper.appendChild(priceAndButton);

          const priceDisplay = document.createElement('p');
          priceDisplay.classList.add('price');
          priceDisplay.textContent = `₦${totalPrice.toLocaleString()}`;
          priceAndButton.appendChild(priceDisplay);

          const cashBackDisplay = document.createElement('p');
          cashBackDisplay.classList.add('cash-back');

          const cashBack = Math.round(
            calcCashBack(
              calcTravelFare(
                convertMetersToKm(routeData.distanceValue),
                bus.rate,
                bus.multiplier
              ),
              bus.cashBackPercentage
            )
          );

          cashBackDisplay.textContent = `Cashback: ₦${cashBack.toLocaleString()}`;

          priceAndButton.appendChild(cashBackDisplay);

          const viewSeatsButton = document.createElement('button');
          viewSeatsButton.classList.add('view-seats');
          viewSeatsButton.textContent = 'View Seats';
          priceAndButton.appendChild(viewSeatsButton);

          viewSeatsButton.addEventListener('click', function () {
            routeData.busSeats(bus);
            routeData.totalPrice = totalPrice;
            routeData.cashBack = cashBack;

            selectSeatsContainer.classList.remove('hidden');
            overlay.classList.remove('hidden');

            allSeats = document.querySelectorAll('.seat');

            let counter = routeData.numPassengers;
            allSeats.forEach((seat, index) =>
              seat.addEventListener('click', e => {
                if (seat.src.endsWith('/images/seat_clicked.svg')) {
                  seat.src = '/images/seat_available.svg';

                  counter++;
                  console.log(counter);
                } else if (counter !== 0) {
                  seat.src = '/images/seat_clicked.svg';

                  counter--;
                  console.log(counter);
                }
              })
            );
          });

          busImage.addEventListener('mouseover', function (e) {
            displayBusInfo(bus);
            busInfoContainer.classList.remove('hidden');
            busInfoContainer.style.top = `${e.clientY}px`;
            busInfoContainer.style.left = `${e.clientX}px`;
          });

          busImage.addEventListener('mouseout', function (e) {
            let elementsToRemove =
              document.getElementsByClassName('bus-info-wrapper');

            while (elementsToRemove.length > 0) {
              elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
            }
            busInfoContainer.classList.add('hidden');
          });
        });
      };
      populateWithBuses(json);
    });
};

const removeModal = function () {
  overlay.classList.add('hidden');
  selectSeatsContainer.classList.add('hidden');

  let elementsToRemove = document.getElementsByClassName('seats-row');

  while (elementsToRemove.length > 0) {
    elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
  }
};

// EVENT LISTENER TO REMOVE MODAL OVERLAY
overlay.addEventListener('click', removeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    removeModal();
  }
});

confirmSeatsBtn.addEventListener('click', function () {
  let arr = [];
  for (let i = 0; i < allSeats.length; i++) {
    if (allSeats[i].src.endsWith('/images/seat_clicked.svg')) {
      arr.push(i);
    }
  }

  routeData.selectedSeats = arr;

  if (routeData.selectedSeats.length === routeData.numPassengers) {
    // // CONVERT THE ROUTE DETAILS INTO A STRING
    let userDetailsString = JSON.stringify(routeData);

    sessionStorage.setItem('userDetails', userDetailsString);
    console.log(userDetailsString);

    window.location.href = '/finish-booking.html';
  } else {
    console.log('please select seats');
  }
});

// CHECK IF THERES INCOMING ROUTE DATA BEFORE DISPLAYING BUSES
if (routeData) {
  displayAvailableBuses();
}

// CONVERT THE DISTANCE IN METERS TO KM
const convertMetersToKm = function (distance) {
  return distance / 1000;
};

// CALCULATE THE PRICE FOR EACH BUS BASED ON DISTANCE AND BUS TYPE
const calcTravelFare = function (distance, busRate, multiplier) {
  const baseFare = 15000;
  return baseFare + distance * busRate * multiplier;
};

// CALCULATE THE CASHBACK FOR EACH BOOKING BASED ON BUS TYPE
const calcCashBack = function (travelPrice, busRate) {
  return (travelPrice * busRate) / 100;
};

// FUNCTION TO DISPLAY INFORMATION FOR EACH BUS
const displayBusInfo = function (bus) {
  const busInfoWrapper = document.createElement('div');
  busInfoWrapper.classList.add('bus-info-wrapper');
  busInfoContainer.append(busInfoWrapper);

  const displayBusType = document.createElement('p');
  displayBusType.classList.add('bus-info-detail');
  displayBusType.textContent = `Bus Type: ${bus.busType}`;
  busInfoWrapper.append(displayBusType);

  const displayCapacity = document.createElement('p');
  displayCapacity.classList.add('bus-info-detail');
  displayCapacity.textContent = `Bus Capacity: ${bus.seatCapacity} Seats`;
  busInfoWrapper.append(displayCapacity);

  const displayBusName = document.createElement('div');
  displayBusName.classList.add('bus-info-detail');
  busInfoWrapper.append(displayBusName);

  const displayWifi = document.createElement('p');
  displayBusType.classList.add('bus-info-detail');
  displayWifi.textContent = `Wifi: ${bus.wiFi ? 'Yes' : 'No'}`;
  busInfoWrapper.append(displayWifi);

  const displayAirCo = document.createElement('p');
  displayAirCo.classList.add('bus-info-detail');
  displayAirCo.textContent = `Air Conditioning: ${
    bus.airConditioning ? 'Yes' : 'No'
  }`;
  busInfoWrapper.append(displayAirCo);

  const displayRestRoom = document.createElement('p');
  displayRestRoom.classList.add('bus-info-detail');
  displayRestRoom.textContent = `Rest Room: ${bus.restRoom ? 'Yes' : 'No'}`;
  busInfoWrapper.append(displayRestRoom);

  const displaySnacks = document.createElement('p');
  displaySnacks.classList.add('bus-info-detail');
  displaySnacks.textContent = `Snacks Included: ${
    bus.snacksIncluded ? 'Yes' : 'No'
  }`;
  busInfoWrapper.append(displaySnacks);

  const displayEntertainment = document.createElement('p');
  displayEntertainment.classList.add('bus-info-detail');
  displayEntertainment.textContent = `Entertainment: ${
    bus.entertainmentSystem ? `${bus.entertainmentSystem.join(', ')}` : 'No'
  }`;
  busInfoWrapper.append(displayEntertainment);
};
