import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = { width: '100%', height: '100%' }

// New Delhi, used until the browser gives us a location
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 }

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapPlaceholder = ({ text }) => (
    <div className='flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#f5f5f5_25%,#ececec_25%,#ececec_50%,#f5f5f5_50%,#f5f5f5_75%,#ececec_75%)] bg-[length:40px_40px] text-neutral-500'>
        <i className='ri-map-2-line text-4xl'></i>
        <p className='px-6 text-center text-sm'>{text}</p>
    </div>
)

const Map = () => {
    const [ position, setPosition ] = useState(DEFAULT_CENTER)
    const { isLoaded, loadError } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: API_KEY })

    useEffect(() => {
        if (!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) => setPosition({ lat: coords.latitude, lng: coords.longitude }),
            () => { /* permission denied: keep default center */ },
            { enableHighAccuracy: true }
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    if (loadError) return <MapPlaceholder text='Map could not be loaded.' />
    if (!isLoaded) return <MapPlaceholder text='Loading map...' />

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
            options={{ disableDefaultUI: true, zoomControl: true }}
        >
            <Marker position={position} />
        </GoogleMap>
    )
}

const LiveTracking = () => {
    if (!API_KEY) return <MapPlaceholder text='Map is off. Set VITE_GOOGLE_MAPS_API_KEY in frontend/.env to show it.' />
    return <Map />
}

export default LiveTracking
