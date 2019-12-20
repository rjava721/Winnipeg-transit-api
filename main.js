let street = 'warde'
let streetType = 'avenue';

const mainButton = document.querySelector('#main-button');

let streetKey;
let streetStopsKeys = [];

mainButton.addEventListener('click', function (event) {
  document.body.insertAdjacentHTML('beforeend', `<h2 class='street-name'>Street Name: ${street} ${streetType}</h2>`);
  
  //first we get the street key
  fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${street}&type=${streetType}&api-key=jJp4zgyfpCcZGyAYLyM`)
  .then((streetFetch) => streetFetch.json())
  .then((streetData) => {
    streetKey = streetData.streets[0].key;
    
    //now we need to get the keys of each stops
    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=jJp4zgyfpCcZGyAYLyM`)
    .then((stopsFetch) => stopsFetch.json())
    .then((stopsData) => {
      //store all of the stop keys inside of an array
      stopsData.stops.forEach((element,index) => {
        streetStopsKeys[index] = element.key;
      })

      //loop through the array of the bus stops of the street 
      //and fetch - display the schedule for each element
      streetStopsKeys.forEach((element) => {
        fetch(`https://api.winnipegtransit.com/v3/stops/${element}/schedule.json?max-results-per-route=2&api-key=jJp4zgyfpCcZGyAYLyM`)
        .then(stopKeysFetch => stopKeysFetch.json()) 
        .then(parsedStopsKeys =>  {
          if(parsedStopsKeys["stop-schedule"]["route-schedules"].length !== 0) {
            if(parsedStopsKeys["stop-schedule"]["route-schedules"].length === 2) {
              document.body.insertAdjacentHTML('beforeend', `
              <div class='stop'>
                <h2>Stop name: ${parsedStopsKeys["stop-schedule"].stop.name}</h2>
                <h4>Direction: ${parsedStopsKeys["stop-schedule"].stop.direction} -- Cross-street: ${parsedStopsKeys["stop-schedule"].stop["cross-street"].name} </h4>
                <p>Scheduled arrival time of the next 2 buses :</p>
                <ul><u>Bus 1:</u>
                  <li><span>Route number: ${parsedStopsKeys["stop-schedule"]["route-schedules"][0].route.number}</span></li>
                  <li>Estimated arrival time: ${parsedStopsKeys["stop-schedule"]["route-schedules"][0]["scheduled-stops"][0].times.arrival.scheduled}</li>
                </ul>
                <ul><u>Bus 2:</u>
                  <li><span>Route number: ${parsedStopsKeys["stop-schedule"]["route-schedules"][1].route.number}</span></li>
                  <li>Estimated arrival time: ${parsedStopsKeys["stop-schedule"]["route-schedules"][1]["scheduled-stops"][0].times.arrival.scheduled}</li>
                </ul>
              </div>`)
            } else if (parsedStopsKeys["stop-schedule"]["route-schedules"].length === 1) {
              document.body.insertAdjacentHTML('beforeend', `
              <div class='stop'>
                <h2>Stop name: ${parsedStopsKeys["stop-schedule"].stop.name}</h2>
                <h4>Direction: ${parsedStopsKeys["stop-schedule"].stop.direction} -- Cross-street: ${parsedStopsKeys["stop-schedule"].stop["cross-street"].name} </h4>
                <p>Scheduled arrival time of the next 2 buses :</p>
                <ul><u>There is only one bus scheduled, Bus 1:</u>
                  <li><span>Route number: ${parsedStopsKeys["stop-schedule"]["route-schedules"][0].route.number}</span></li>
                  <li>Estimated arrival time: ${parsedStopsKeys["stop-schedule"]["route-schedules"][0]["scheduled-stops"][0].times.arrival.scheduled}</li>
                </ul>
              </div>`)
            }   
          } else {
            document.body.insertAdjacentHTML('beforeend', `
            <div class='stop'>
              <h2>Stop name: ${parsedStopsKeys["stop-schedule"].stop.name}</h2>
              <h4>Direction: ${parsedStopsKeys["stop-schedule"].stop.direction} -- Cross-street: ${parsedStopsKeys["stop-schedule"].stop["cross-street"].name} </h4>
              <p>Scheduled arrival time of the next 2 buses :</p>
              <ul> <u>Bus 1 & bus 2:</u>
                <li><span>Route number: No route because no scheduled busses</span></li>
                <li>Estimated arrival time: Sorry, no scheduled buses for the moment</li>
              </ul>
            </div>`)
          }
        })
      }) 
    })
  })
  .catch((data) => console.log(`mess ${data} `));
});