'use strict';

let routeButton = document.querySelector('.proceed-button');
let errorMessage = document.querySelector('.error-message');
let travelOrigin = document.querySelector('.from-route-select');
let travelDestination = document.querySelector('.to-route-select');
let numberOfPassengers = document.querySelector('.passengers-number');
let loadingMessage = document.querySelector('.loading-message');
const today = new Date().toISOString().split('T')[0];
document.querySelector('.route-date').value = today;

// INITIALIZE EMPTY ARRAY TO STORE STRING OF BOTH LOCATIONS
let locationArr = [];

// INITIALIZE EMPTY ARRAY TO STORE LATITUDE AND LONGITUDE OF BOTH LOCATIONS
let longAndLatArr = [];

let fromAndToSelect = [travelOrigin, travelDestination];

// FOR EACH METHOD TO ADD LOCATION SELECTION INTO LOCATION ARRAY
fromAndToSelect.forEach(function (button, index) {
  button.addEventListener('change', function () {
    locationArr[index] = fromAndToSelect[index].value;

    if (locationArr[0] && locationArr[1]) {
      routeButton.disabled = false;
    }
  });
});

//CALLBACK FUNCTION TO GET LONG AND LAT FOR BOTH LOCATIONS
const getLongAndLat = function () {
  const travelDate = document.querySelector('.route-date').value;
  const longAtLatKey = '65c3b838f54d4366bc1c73294b34787f';
  const distanceAPIKey =
    'ZfZW0eYft30w2ZJggoqbKaPaAjY067a5KXH85iT3F7kvJah5A6ykL4oHIIqEyuLp';

  // INITIALIZE COUNTER TO UPDATE LOCATION ARRAY
  let counter = 0;

  // CHECK IF FROM AND TO FIELDS HAVE THE SAME VALUES
  if (locationArr[0] === locationArr[1]) {
    errorMessage.textContent = 'Origin and destination cannot be the same';
  } else {
    errorMessage.textContent = '';

    loadingMessage.style.display = 'flex';
    setInterval(changeLoadingMessageColor, 200);

    const getLongAndLatForEachLocation = setInterval(function () {
      fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${locationArr[counter]}&apiKey=${longAtLatKey}`
      )
        .then(response => response.json())
        .then(data => {
          // PUSH LONGITUDE AND LATITUDE VALUES INTO ARRAY TO USED TO CALCULATE DISTANCE LATER
          longAndLatArr.push(
            data.features[0].properties.lat,
            data.features[0].properties.lon
          );

          if (longAndLatArr.length === 4) {
            // FUNCTION TO CALCULATE DISTANCE BETWEEN BOTH LOCATIONS
            const calculateDistance = function (arr) {
              // DESTRUCTURE ARRAY CONTAINING LON AND LAT FOR BOTH LOCATIONS
              const [originLat, originLon, destinationLat, destinationLon] =
                arr;
              const origin = `${originLat},${originLon}`;
              const destination = `${destinationLat},${destinationLon}`;

              fetch(
                `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${distanceAPIKey}`
              )
                .then(response => response.json())
                .then(data => {
                  longAndLatArr = [];

                  console.log(data);

                  let routeDetails = {
                    date: travelDate,
                    numPassengers: Number(numberOfPassengers.value),
                    fromCity:
                      travelOrigin.options[travelOrigin.selectedIndex]
                        .textContent,
                    toCity:
                      travelDestination.options[travelDestination.selectedIndex]
                        .textContent,

                    distanceValue: data.rows[0]?.elements[0]?.distance?.value,
                    distanceInKm: data.rows[0]?.elements[0]?.distance?.text,

                    travelDuration: data.rows[0]?.elements[0]?.duration?.text,
                  };

                  // CONVERT THE ROUTE DETAILS INTO A STRING
                  let routeDetailsString = JSON.stringify(routeDetails);

                  // SAVE THE ROUTE DETAILS USING SESSION STORAGE
                  sessionStorage.setItem('routeDetails', routeDetailsString);

                  window.location.href = '/select-bus.html';
                })
                .catch(err => console.error(err));
            };

            calculateDistance(longAndLatArr);
          }
        })

        .catch(err => console.error(err));

      if (counter === locationArr.length - 1) {
        clearInterval(getLongAndLatForEachLocation);
      } else {
        counter++;
      }
    }, 1000);
  }
};

const changeLoadingMessageColor = function () {
  if (loadingMessage.className === 'loading-message') {
    loadingMessage.className = 'toggle-loading-color';
  } else {
    loadingMessage.className = 'loading-message';
  }
};

routeButton.addEventListener('click', getLongAndLat);
