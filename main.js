let mainButton = document.querySelector('#main-button');
let stopsElement;
let streetKey;
let streetStopsKeys = [];
let streetStopsNames = [];
let count = 0;//
// we need to find a street
// and then display the next 2 upcoming bus times in all the stops of the street
// /v3/stops.json?street=1902
// /v3/streets.json?name=jubilee&type=avenue
mainButton.addEventListener('click', function (event) {
  fetch('https://api.winnipegtransit.com/v3/streets.json?name=henlow&type=bay&api-key=jJp4zgyfpCcZGyAYLyM')
  .then((streetFetch) => streetFetch.json())
  .then((streetData) => {
    streetKey = streetData.streets[0].key;

    document.body.insertAdjacentHTML('beforeend',
    `<div id=street-stops>
      <h2>Street-key: ${streetKey} -- Street-Name: ${streetData.streets[0].name}</h2>
    </div>`);
    stopsElement = document.querySelector('#street-stops');

    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=jJp4zgyfpCcZGyAYLyM`)
    .then((stopsFetch) => stopsFetch.json())
    .then((stopsData) => {
      stopsData.stops.forEach((element,index) => {
        streetStopsKeys[index] = element.key;
        streetStopsNames[index] = element.name;
      })

      streetStopsKeys.forEach((element, index) => {
        stopsElement.insertAdjacentHTML('beforeend', `
        <p>Stop Name : ${streetStopsNames[index]} -- Stop Number : ${element}`);

        fetch(`https://api.winnipegtransit.com/v3/stops/${element}/schedule.json?max-results-per-route=2&api-key=jJp4zgyfpCcZGyAYLyM`)
        .then(stopKeysFetch => stopKeysFetch.json()) 
        .then((parsedStops) =>  {
          stopsElement.insertAdjacentHTML('afterbegin', `
          <p>direction : ${parsedStops["stop-schedule"].stop.direction}`);
          console.log(parsedStops["stop-schedule"]);
          console.log(`above was parsedStops`);// we want the names, route schedules[index].route / .name
        })
      })
    })
  .catch((data) => console.log(`mess ${data}`));
  })
});


//consider wrapping all stops inside of a div with an id. 
// select it and then you can specifically add to them the 2 next busses