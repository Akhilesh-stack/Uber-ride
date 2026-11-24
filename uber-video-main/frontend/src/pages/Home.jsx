import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../lib/api'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import useSocketJoin from '../hooks/useSocketJoin'
import LiveTracking from '../components/LiveTracking'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { Alert, BottomSheet, Button, Logo } from '../components/ui'

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)

// step: 'search' -> 'vehicle' -> 'confirm' -> 'looking' -> 'waiting'
const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ activeField, setActiveField ] = useState(null)
    const [ searchOpen, setSearchOpen ] = useState(false)
    const [ suggestions, setSuggestions ] = useState([])
    const [ suggestionsLoading, setSuggestionsLoading ] = useState(false)

    const [ step, setStep ] = useState('search')
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [ error, setError ] = useState('')
    const [ fareLoading, setFareLoading ] = useState(false)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useSocketJoin(socket, 'user', user?._id)

    useEffect(() => {
        const onRideConfirmed = (ride) => {
            setRide(ride)
            setStep('waiting')
        }
        const onRideStarted = (ride) => {
            navigate('/riding', { state: { ride } })
        }
        socket.on('ride-confirmed', onRideConfirmed)
        socket.on('ride-started', onRideStarted)
        return () => {
            socket.off('ride-confirmed', onRideConfirmed)
            socket.off('ride-started', onRideStarted)
        }
    }, [ socket, navigate ])

    // Debounced address suggestions (backend needs at least 3 characters)
    const query = activeField === 'pickup' ? pickup : destination
    const latestQuery = useRef('')
    useEffect(() => {
        latestQuery.current = query
        if (!searchOpen || query.trim().length < 3) {
            setSuggestions([])
            setSuggestionsLoading(false)
            return
        }
        setSuggestionsLoading(true)
        const timer = setTimeout(async () => {
            try {
                const { data } = await api.get('/maps/get-suggestions', { params: { input: query } })
                if (latestQuery.current === query) setSuggestions(data)
            } catch {
                if (latestQuery.current === query) setSuggestions([])
            } finally {
                if (latestQuery.current === query) setSuggestionsLoading(false)
            }
        }, 350)
        return () => clearTimeout(timer)
    }, [ query, searchOpen ])

    const openSearch = (field) => {
        setActiveField(field)
        setSearchOpen(true)
        setError('')
    }

    const selectSuggestion = (value) => {
        if (activeField === 'pickup') {
            setPickup(value)
            setActiveField('destination')
        } else {
            setDestination(value)
            setSearchOpen(false)
        }
        setSuggestions([])
    }

    async function findTrip(e) {
        e?.preventDefault()
        if (pickup.trim().length < 3 || destination.trim().length < 3) {
            setError('Please enter both pickup and destination.')
            return
        }
        setError('')
        setFareLoading(true)
        try {
            const { data } = await api.get('/rides/get-fare', { params: { pickup, destination } })
            setFare(data)
            setSearchOpen(false)
            setStep('vehicle')
        } catch (err) {
            setError(getErrorMessage(err, 'Could not get fares for this trip.'))
        } finally {
            setFareLoading(false)
        }
    }

    async function createRide() {
        setStep('looking')
        setError('')
        try {
            await api.post('/rides/create', { pickup, destination, vehicleType })
        } catch (err) {
            setError(getErrorMessage(err, 'Could not book the ride.'))
            setStep('confirm')
        }
    }

    const resetTrip = () => {
        setStep('search')
        setRide(null)
        setVehicleType(null)
    }

    return (
        <div className='relative h-screen overflow-clip'>
            <div className='absolute inset-0'>
                <LiveTracking />
            </div>

            <div className='absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5'>
                <div className='rounded-2xl bg-white/90 px-3 py-2 shadow-md backdrop-blur'><Logo /></div>
                <Link to='/user/logout' title='Log out' className='grid h-11 w-11 place-items-center rounded-full bg-white shadow-md hover:bg-neutral-100'>
                    <i className='ri-logout-box-r-line text-lg'></i>
                </Link>
            </div>

            {/* Search card: compact at the bottom, full screen while typing */}
            <div className={`absolute inset-x-0 bottom-0 z-20 flex flex-col bg-white transition-all duration-300 ${searchOpen ? 'top-0' : 'rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]'} ${step === 'search' ? '' : 'invisible pointer-events-none translate-y-full'}`}>
                <div className='p-5'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {searchOpen ? 'Plan your ride' : `Hi ${capitalize(user?.fullname?.firstname) || 'there'}, where to?`}
                        </h2>
                        {searchOpen && (
                            <button type='button' onClick={() => setSearchOpen(false)} className='grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100' aria-label='Close search'>
                                <i className='ri-close-line text-2xl'></i>
                            </button>
                        )}
                    </div>

                    <form onSubmit={findTrip} className='relative mt-4 space-y-3'>
                        <div className='absolute left-[21px] top-[22px] h-[52px] w-0.5 bg-neutral-300'></div>
                        <div className='relative'>
                            <i className='ri-checkbox-blank-circle-fill absolute left-4 top-1/2 -translate-y-1/2 text-[10px]'></i>
                            <input
                                value={pickup}
                                onFocus={() => openSearch('pickup')}
                                onChange={(e) => setPickup(e.target.value)}
                                className={`w-full rounded-xl border-2 bg-neutral-100 py-3 pl-11 pr-4 text-base outline-none transition ${activeField === 'pickup' && searchOpen ? 'border-black bg-white' : 'border-transparent'}`}
                                placeholder='Pickup location'
                            />
                        </div>
                        <div className='relative'>
                            <i className='ri-checkbox-blank-fill absolute left-4 top-1/2 -translate-y-1/2 text-[10px]'></i>
                            <input
                                value={destination}
                                onFocus={() => openSearch('destination')}
                                onChange={(e) => setDestination(e.target.value)}
                                className={`w-full rounded-xl border-2 bg-neutral-100 py-3 pl-11 pr-4 text-base outline-none transition ${activeField === 'destination' && searchOpen ? 'border-black bg-white' : 'border-transparent'}`}
                                placeholder='Where to?'
                            />
                        </div>
                        {error && step === 'search' && <Alert onClose={() => setError('')}>{error}</Alert>}
                        <Button type='submit' loading={fareLoading}>See prices</Button>
                    </form>
                </div>

                {searchOpen && (
                    <div className='flex-1 overflow-y-auto border-t border-neutral-100 px-5 pb-5'>
                        <LocationSearchPanel
                            suggestions={suggestions}
                            loading={suggestionsLoading}
                            query={query}
                            onSelect={selectSuggestion}
                        />
                    </div>
                )}
            </div>

            <BottomSheet open={step === 'vehicle'} onClose={() => setStep('search')}>
                <VehiclePanel
                    fare={fare}
                    selected={vehicleType}
                    onSelect={(type) => {
                        setVehicleType(type)
                        setStep('confirm')
                    }}
                />
            </BottomSheet>

            <BottomSheet open={step === 'confirm'} onClose={() => setStep('vehicle')}>
                {error && step === 'confirm' && <Alert onClose={() => setError('')}>{error}</Alert>}
                <ConfirmRide
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    onConfirm={createRide}
                />
            </BottomSheet>

            <BottomSheet open={step === 'looking'}>
                <LookingForDriver
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    onClose={resetTrip}
                />
            </BottomSheet>

            <BottomSheet open={step === 'waiting'}>
                <WaitingForDriver ride={ride} />
            </BottomSheet>
        </div>
    )
}

export default Home
