import { storageSevice } from './storage-service.js'
import { utilService } from './util-service.js'


const KEY = 'locationDB';
let gLocations = []

export const mapService = {
    getLocs,
    saveLocation,
    getLocation,
    deleteLocation
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

function deleteLocation(id) {
    const locationIdx = gLocations.findIndex((location) => {
        return location.id === id
    })
    if(locationIdx === -1) return
    gLocations.splice(locationIdx, 1)
    storageSevice.saveToStorage(KEY, gLocations)

}

function saveLocation(location) {
    location.id = utilService.makeId()
    gLocations.push(location)
    // console.log(location)
    storageSevice.saveToStorage(KEY, gLocations)
}
console.log('hey', getLocation());

function getLocation() {
    gLocations = storageSevice.loadFromStorage(KEY) || []
    return gLocations
}