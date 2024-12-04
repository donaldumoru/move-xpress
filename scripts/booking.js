'use strict';

let routeButton = document.querySelector('.proceed-button');
let errorMessage = document.querySelector('.error-message');

const today = new Date().toISOString().split('T')[0];

document.querySelector('.route-date').value = today;

const buses = [
  {
    fromCity: 'Lagos',
    toCity: 'Benin',
    route: 'lagos-to-benin',
    price: 25000,
    wiFi: true,
    airConditioning: true,
    travelTime: 5,
    departureTime: '08:00 AM',
    arrivalTime: '01:00 PM',
    busType: 'Luxury',
    seatCapacity: 18,
    driverName: 'John Doe',
    stopOvers: ['Ore'],
    restRoom: true,
    snacksIncluded: true,
    entertainmentSystem: true,
    busID: 'BUS12345',
    departureLocation: 'Ojota Bus Terminal',
    arrivalLocation: 'Ugbowo Park',
    busName: 'Mercedes Luxury Coach',
  },
  {
    fromCity: 'Abuja',
    toCity: 'Kaduna',
    route: 'abuja-to-kaduna',
    price: 15000,
    wiFi: false,
    airConditioning: true,
    travelTime: 3,
    departureTime: '10:30 AM',
    arrivalTime: '01:30 PM',
    busType: 'Standard',
    seatCapacity: 18,
    driverName: 'Mary Ann',
    stopOvers: ['Kubwa', 'Zuba'],
    restRoom: false,
    snacksIncluded: false,
    entertainmentSystem: false,
    busID: 'BUS56789',
    departureLocation: 'Jabi Park',
    arrivalLocation: 'Sabo Terminal',
    busName: 'Toyota Standard Coach',
  },
  {
    fromCity: 'Port Harcourt',
    toCity: 'Calabar',
    route: 'ph-to-calabar',
    price: 18000,
    wiFi: true,
    airConditioning: true,
    travelTime: 4,
    departureTime: '09:00 AM',
    arrivalTime: '01:00 PM',
    busType: 'Luxury',
    seatCapacity: 18,
    driverName: 'Alex Ike',
    stopOvers: ['Uyo'],
    restRoom: true,
    snacksIncluded: true,
    entertainmentSystem: true,
    busID: 'BUS98765',
    departureLocation: 'Mile 1 Park',
    arrivalLocation: 'Marian Park',
    busName: 'Mercedes Luxury Coach',
  },
  {
    fromCity: 'Ibadan',
    toCity: 'Ife',
    route: 'ibadan-to-ife',
    price: 12000,
    wiFi: false,
    airConditioning: false,
    travelTime: 2,
    departureTime: '07:45 AM',
    arrivalTime: '09:45 AM',
    busType: 'Standard',
    seatCapacity: 18,
    driverName: 'Kola Tunde',
    stopOvers: ['Oyo'],
    restRoom: false,
    snacksIncluded: false,
    entertainmentSystem: false,
    busID: 'BUS11223',
    departureLocation: 'Dugbe Park',
    arrivalLocation: 'Mayfair Park',
    busName: 'Toyota Standard Coach',
  },
  {
    fromCity: 'Enugu',
    toCity: 'Onitsha',
    route: 'enugu-to-onitsha',
    price: 10000,
    wiFi: true,
    airConditioning: true,
    travelTime: 1.5,
    departureTime: '02:15 PM',
    arrivalTime: '03:45 PM',
    busType: 'Executive',
    seatCapacity: 18,
    driverName: 'Chinwe Okafor',
    stopOvers: ['None'], // No stopover
    restRoom: true,
    snacksIncluded: true,
    entertainmentSystem: true,
    busID: 'BUS33445',
    departureLocation: 'Old Park',
    arrivalLocation: 'Upper Iweka',
    busName: 'Volvo Executive Coach',
  },
];

const getRouteInfo = function () {
  let userRouteInput = document.querySelector('.route-select').value;

  const userRoute = buses.find(function (element) {
    return element.route === userRouteInput;
  });

  userRoute.date = document.querySelector('.route-date').value;
  userRoute.passengers = Number(
    document.querySelector('.passenger-data').value
  );

  sessionStorage.setItem('routeData', JSON.stringify(userRoute));

  window.location.href = 'select-bus.html';
};

routeButton.addEventListener('click', getRouteInfo);
