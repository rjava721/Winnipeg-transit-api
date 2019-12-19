let street = 'Warde'
let streetType = "avenue";

let mainButton = document.querySelector('#main-button');
let stopsElement;
let eachStop;

let streetKey;
let streetStopsKeys = [];

// we need to find a street
// and then display the next 2 upcoming bus times in all the stops of the street
// /v3/stops.json?street=1902
// /v3/streets.json?name=jubilee&type=avenue
mainButton.addEventListener('click', function (event) {
  
  //first we get the street key
  fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${street}&type=${streetType}&api-key=jJp4zgyfpCcZGyAYLyM`)
  .then((streetFetch) => streetFetch.json())
  .then((streetData) => {
    streetKey = streetData.streets[0].key;

    document.body.insertAdjacentHTML('beforeend',
    `<div id=street-stops>
      <h3>Street-key: ${streetKey} -- Street-Name: ${streetData.streets[0].name}</h3>
    </div>`);
    stopsElement = document.querySelector('#street-stops');
    
    //now we need to get the keys of each stops
    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=jJp4zgyfpCcZGyAYLyM`)
    .then((stopsFetch) => stopsFetch.json())
    .then((stopsData) => {
      //store all of the stop keys inside of an array
      stopsData.stops.forEach((element,index) => {
        streetStopsKeys[index] = element.key;
      })
      console.log("streetStopsKeys.length :" + streetStopsKeys.length);

      streetStopsKeys.forEach((element, index) => {
        stopsElement.insertAdjacentHTML('beforeend', `
        <div class='street-stop' data-street-stop='${stopsData.stops[index].name}'>
        <h4>Stop Name : ${stopsData.stops[index].name} -- Stop Number : ${element}</h4>
        <h4>Direction : ${stopsData.stops[index].direction}</h4>
        <h4>Cross-street: ${stopsData.stops[index]["cross-street"].name}</h4>
        <p>===============================================</p>
        </div`);
        
        eachStop = document.getElementsByClassName('street-stop');

        fetch(`https://api.winnipegtransit.com/v3/stops/${element}/schedule.json?max-results-per-route=2&api-key=jJp4zgyfpCcZGyAYLyM`)
        .then(stopKeysFetch => stopKeysFetch.json()) 
        .then((parsedStopsKeys) =>  {
          console.log(parsedStopsKeys);

          })
        })
      })
    })
  .catch((data) => console.log(`mess ${data}`));
  })