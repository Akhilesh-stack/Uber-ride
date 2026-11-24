const axios = require('axios');
const captainModel = require('../models/captain.model');

// Uses Google Maps when GOOGLE_MAPS_API is set. Otherwise falls back to free,
// key-less OpenStreetMap services: Photon (search/autocomplete) and OSRM (routing).
const useGoogle = () => Boolean(process.env.GOOGLE_MAPS_API);

const PHOTON_URL = 'https://photon.komoot.io/api/';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// Public OSM services ask clients to identify themselves
const http = axios.create({
    timeout: 10000,
    headers: { 'User-Agent': 'uber-ride-demo/1.0 (student project)' },
});

// Bias results towards India (fares are in ₹)
const BIAS = { lat: 22.5, lon: 79, lang: 'en' };

const formatPlace = ({ properties: p }) => {
    const parts = [ p.name, p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street, p.district, p.city, p.state, p.country ];
    return [ ...new Set(parts.filter(Boolean)) ].join(', ');
};

const formatDistance = (meters) => meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
const formatDuration = (seconds) => {
    const mins = Math.max(1, Math.round(seconds / 60));
    return mins < 60 ? `${mins} mins` : `${Math.floor(mins / 60)} hr ${mins % 60} mins`;
};

/* ---------------- Google ---------------- */

async function googleCoordinate(address) {
    const { data } = await http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address, key: process.env.GOOGLE_MAPS_API },
    });
    if (data.status !== 'OK') throw new Error('Unable to fetch coordinates');
    const { lat, lng } = data.results[ 0 ].geometry.location;
    return { ltd: lat, lng };
}

async function googleDistanceTime(origin, destination) {
    const { data } = await http.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: { origins: origin, destinations: destination, key: process.env.GOOGLE_MAPS_API },
    });
    if (data.status !== 'OK') throw new Error('Unable to fetch distance and time');
    const element = data.rows[ 0 ].elements[ 0 ];
    if (element.status !== 'OK') throw new Error('No routes found');
    return element;
}

async function googleSuggestions(input) {
    const { data } = await http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: { input, key: process.env.GOOGLE_MAPS_API },
    });
    if (data.status === 'ZERO_RESULTS') return [];
    if (data.status !== 'OK') throw new Error('Unable to fetch suggestions');
    return data.predictions.map(p => p.description).filter(Boolean);
}

/* ---------------- OpenStreetMap ---------------- */

async function osmCoordinate(address) {
    const { data } = await http.get(PHOTON_URL, { params: { q: address, limit: 1, ...BIAS } });
    const feature = data.features?.[ 0 ];
    if (!feature) throw new Error(`Location not found: ${address}`);
    const [ lon, lat ] = feature.geometry.coordinates;
    return { ltd: lat, lng: lon };
}

async function osmDistanceTime(origin, destination) {
    const [ from, to ] = await Promise.all([ osmCoordinate(origin), osmCoordinate(destination) ]);
    const { data } = await http.get(`${OSRM_URL}/${from.lng},${from.ltd};${to.lng},${to.ltd}`, {
        params: { overview: 'false' },
    });
    const route = data.routes?.[ 0 ];
    if (data.code !== 'Ok' || !route) throw new Error('No routes found');
    // Same shape as a Google Distance Matrix element
    return {
        distance: { value: Math.round(route.distance), text: formatDistance(route.distance) },
        duration: { value: Math.round(route.duration), text: formatDuration(route.duration) },
        status: 'OK',
    };
}

async function osmSuggestions(input) {
    const { data } = await http.get(PHOTON_URL, { params: { q: input, limit: 6, ...BIAS } });
    return [ ...new Set((data.features || []).map(formatPlace).filter(Boolean)) ];
}

/* ---------------- Public API ---------------- */

module.exports.getAddressCoordinate = async (address) => {
    if (!address) throw new Error('Address is required');
    return useGoogle() ? googleCoordinate(address) : osmCoordinate(address);
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) throw new Error('Origin and destination are required');
    return useGoogle() ? googleDistanceTime(origin, destination) : osmDistanceTime(origin, destination);
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) throw new Error('query is required');
    return useGoogle() ? googleSuggestions(input) : osmSuggestions(input);
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
}
