import { storageSevice } from './storage-service.js'
import { utilService } from './util-service.js'


const KEY = 'locationDB';

export const mapService = {
    getLocs,
    saveLocation
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
    console.log(location)
    storageSevice.saveToStorage(KEY, location)
}

