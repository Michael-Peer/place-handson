import { mapService } from './services/map-service.js'

var gMap;
console.log('Main!');

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
    console.log('InitMap');
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

                //camera move to location
                panTo(pos.lat, pos.lng)
                addMarker(pos)

                var LatLng = new google.maps.LatLng(pos.lat, pos.lng);

                const geocoder = new google.maps.Geocoder
                geocoder.geocode({ 'latLng': LatLng }, function(res, status) {
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
                    }
                })



            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
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
    var strHtml = mapService.getLocation().map((location) => {
        // console.log('strHtml', strHtml);
        return `
        <li>${location.lat}${location.lng}${location.locationName}<button>GO</button><button>Delete</button></li>`
    })
    document.querySelector('.list').innerHTML = strHtml.join('')
}