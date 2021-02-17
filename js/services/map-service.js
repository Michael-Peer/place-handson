import { storageSevice } from './storage-service.js'
import { utilService } from './util-service.js'


const KEY = 'locationDB';
const gLocations = []

export const mapService = {
    getLocs,
    saveLocation,
    getLocation
}

var locs = [{ lat: 11.22, lng: 22.11 }]

// let location = {
//     id,
//     locName,
//     lat,
//     lng,
//     weather,
//     createdAt,
//     updatedAt
// }

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function saveLocation(location) {
    location.id = utilService.makeId()
    locations.push(location)
    console.log(location)
    storageSevice.saveToStorage(KEY, locations)
}
console.log('hey', getLocation());

function getLocation() {
    gLocations = storageSevice.loadFromStorage(KEY) || []
    return gLocations
}