let mainButton = document.querySelector('#main-button');
let stopsElement;
let streetKey;
let streetStopsKeys = [];
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
      <h3>Street-key: ${streetKey} -- Street-Name: ${streetData.streets[0].name}</h3>
    </div>`);
    stopsElement = document.querySelector('#street-stops');

    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=jJp4zgyfpCcZGyAYLyM`)
    .then((stopsFetch) => stopsFetch.json())
    .then((stopsData) => {
      console.log(stopsData);

      stopsData.stops.forEach((element,index) => {
        streetStopsKeys[index] = element.key;
      })

      streetStopsKeys.forEach((element, index) => {
        stopsElement.insertAdjacentHTML('beforeend', `
        <div id='street-stops' data-street-stop='${stopsData.stops[index].name}'>
        <h4>Stop Name : ${stopsData.stops[index].name} -- Stop Number : ${element}</h4>
        <h4>Direction : ${stopsData.stops[index].direction}</h4>
        <h4>Cross-street: ${stopsData.stops[index]["cross-street"].name}</h4>
        <p>===============================================</p>
        </div`);

        fetch(`https://api.winnipegtransit.com/v3/stops/${element}/schedule.json?max-results-per-route=2&api-key=jJp4zgyfpCcZGyAYLyM`)
        .then(stopKeysFetch => stopKeysFetch.json()) 
        .then((parsedStopsKeys) =>  {
          console.log(parsedStopsKeys);

        })
      })
    })
  .catch((data) => console.log(`mess ${data}`));
  })
});


//consider wrapping all stops inside of a div with an id. 
// select it and then you can specifically add to them the 2 next busses