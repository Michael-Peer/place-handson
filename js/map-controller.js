import { mapService } from './services/map-service.js'
var gMap;
let currLatLng = null
console.log('Main!');
window.onInit = () => {
    renderLocationList()
}

function getWeather() {
    mapService.getWeather(currLatLng)
        .then(weahter => {
            renderWeather(weahter)
        })
}

function renderWeather(weather) {
    const currLocationWeather = weather
    console.log('currLocationWeather:', currLocationWeather.description)
    var strHtml = `
         <h2>${weather.main}<h2><p>${weather.description}</p><p class="wTemp">${weather.temp}</p>`

    document.querySelector('.weather-container').innerHTML = strHtml
}
mapService.getLocs()
    .then(locs => console.log('locs', locs))
window.onload = () => {
    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(() => console.log('INIT MAP ERROR'));
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    currLatLng = { lat, lng }
    if (isQueryParamsAvailable()) {
        lat = currLatLng.lat
        lng = currLatLng.lng
    }
    getWeather()
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            //set on map click listener
            gMap.addListener('click', (mapsMouseEvent) => {
                const pos = {
                    lat: mapsMouseEvent.latLng.lat(),
                    lng: mapsMouseEvent.latLng.lng()
                }

                currLatLng = pos
                //camera move to location
                panTo(pos.lat, pos.lng)
                addMarker(pos)
                var LatLng = new google.maps.LatLng(pos.lat, pos.lng);
                let geocoder = new google.maps.Geocoder
                geocoder.geocode({ 'latLng': LatLng }, function (res, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        const locationName = res[0].formatted_address
                        const location = {
                            lat: pos.lat,
                            lng: pos.lng,
                            locationName: locationName,
                            creadtedAt: Date.now(),
                            updatedAt: Date.now()
                        }
                        mapService.saveLocation(location)
                        renderLocationList()
                        getWeather()
                    }
                })
            })
        })
}

function addMarker(loc) {
    const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
    };
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        icon: svgMarker,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
    currLatLng = { lat, lng }
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

window.getCurrLocation = (ev) => {
    ev.preventDefault()
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((currPos) => {
        console.log(currPos.coords)
        panTo(currPos.coords.latitude, currPos.coords.longitude)
    })
}

window.onLocationSearch = (ev) => {
    ev.preventDefault()
    const searchTerm = document.getElementById('search-location').value
    if (!searchTerm) return
    let geocoder = new google.maps.Geocoder
    geocoder.geocode({ 'address': searchTerm }, (res, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const lat = res[0].geometry.location.lat();
            const lng = res[0].geometry.location.lng();
            console.log(lat, lng, "Dasdassasadsadsadsad")
            panTo(lat, lng)
        }
    })
}

window.onCopyToClipboardClicked = (ev) => {
    ev.preventDefault()
    if (!currLatLng) return
    const textArea = document.createElement("textarea");
    document.body.appendChild(textArea)
    const url = window.location.href
    textArea.value = `${url}?lat=${currLatLng.lat}&lng=${currLatLng.lng}`
    textArea.select()
    console.log(textArea.value, "text area value")
    document.execCommand('copy')
}

window.onGoToLocation = (lat, lng) => {
    console.log(lat, lng)
    panTo(lat, lng)
}

window.onDeleteLocation = id => {
    mapService.deleteLocation(id)
    renderLocationList()
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC-OEkTrXEyUU98tgZfsvuTBhWgS-SLX8c'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
renderLocationList()

function renderLocationList() {
    const locations = mapService.getLocation();
    console.log('locations:', locations)
    var strHtml = locations.map((location) => {
        return `
        <li>Lat:${location.lat}<br />Lng:${location.lng}<br />${location.locationName}<button class="list-btn" onclick="onGoToLocation(${location.lat}, ${location.lng})" >GO</button ><button class="list-btn" onclick="onDeleteLocation('${location.id}')">Delete</button></li>`
    })
    document.querySelector('.list').innerHTML = strHtml.join('')
}

function isQueryParamsAvailable() {
    console.log("rummingggg");
    const urlStr = window.location.href;
    const url = new URL(urlStr);
    const lat = +url.searchParams.get("lat");
    const lng = +url.searchParams.get("lng");
    if (!lat || !lng) return false
    console.log(lat, lng)
    currLatLng = {
        lat,
        lng
    }
    console.log(currLatLng)
    return true
}