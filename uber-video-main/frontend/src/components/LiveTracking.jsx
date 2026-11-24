import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, AttributionControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Free OpenStreetMap-based tiles (no API key needed)
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// New Delhi, used until the browser gives us a location
const DEFAULT_CENTER = [ 28.6139, 77.209 ]

const userIcon = L.divIcon({
    className: '',
    html: '<span class="block h-5 w-5 rounded-full border-[3px] border-white bg-blue-600 shadow-lg"></span>',
    iconSize: [ 20, 20 ],
    iconAnchor: [ 10, 10 ],
})

// Keep the map centred on the latest position
const Recenter = ({ position }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(position, map.getZoom(), { animate: true })
    }, [ map, position ])
    return null
}

const LiveTracking = () => {
    const [ position, setPosition ] = useState(DEFAULT_CENTER)
    const [ accuracy, setAccuracy ] = useState(null)
    const [ located, setLocated ] = useState(false)

    useEffect(() => {
        if (!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) => {
                setPosition([ coords.latitude, coords.longitude ])
                setAccuracy(coords.accuracy)
                setLocated(true)
            },
            () => { /* permission denied: keep default center */ },
            { enableHighAccuracy: true, maximumAge: 10000 }
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    return (
        // `isolate` keeps Leaflet's high z-index panes below the app's overlays
        <div className='isolate h-full w-full'>
            <MapContainer
                center={position}
                zoom={15}
                zoomControl={false}
                attributionControl={false}
                className='h-full w-full'
            >
                {/* Bottom of the map is covered by panels, so show the required credit at the top */}
                <AttributionControl position='topright' prefix={false} />
                <TileLayer url={TILE_URL} attribution={ATTRIBUTION} maxZoom={19} />
                {located && (
                    <>
                        {accuracy && accuracy < 500 && (
                            <Circle center={position} radius={accuracy} pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.1 }} />
                        )}
                        <Marker position={position} icon={userIcon} />
                    </>
                )}
                <Recenter position={position} />
            </MapContainer>
        </div>
    )
}

export default LiveTracking
