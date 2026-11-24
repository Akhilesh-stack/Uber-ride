import React, { useEffect, useContext, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import { Avatar, Button, RideDetails, VehicleBadge, fullName } from '../components/ui'
import { vehicleInfo } from '../lib/vehicles'

const Riding = () => {
    const location = useLocation()
    const ride = location.state?.ride
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const [ ended, setEnded ] = useState(false)

    useEffect(() => {
        const onRideEnded = () => setEnded(true)
        socket.on('ride-ended', onRideEnded)
        return () => socket.off('ride-ended', onRideEnded)
    }, [ socket ])

    // Opened directly (e.g. after a refresh) without ride data
    if (!ride) return <Navigate to='/home' replace />

    const captain = ride.captain
    const vehicle = captain?.vehicle

    if (ended) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center px-6 text-center'>
                <span className='grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl text-emerald-600'>
                    <i className='ri-check-line'></i>
                </span>
                <h2 className='mt-6 text-3xl font-bold tracking-tight'>You've arrived!</h2>
                <p className='mt-2 text-neutral-500'>Please pay <b className='text-black'>₹{ride.fare}</b> in cash to your Captain.</p>
                <Button className='mt-8' onClick={() => navigate('/home', { replace: true })}>Book another ride</Button>
            </div>
        )
    }

    return (
        <div className='relative flex h-screen flex-col overflow-clip'>
            <div className='flex-1'>
                <LiveTracking />
            </div>
            <div className='rounded-t-3xl bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]'>
                <p className='text-xs font-semibold uppercase tracking-wide text-emerald-600'>On your way</p>
                <div className='mb-4 mt-3 flex items-center gap-3'>
                    <Avatar name={fullName(captain)} />
                    <div className='flex-1'>
                        <p className='font-semibold capitalize'>{fullName(captain) || 'Captain'}</p>
                        <p className='text-sm capitalize text-neutral-500'>{vehicle?.color} {vehicleInfo(vehicle?.vehicleType).label}</p>
                    </div>
                    <VehicleBadge type={vehicle?.vehicleType} className='h-11 w-11 text-2xl' />
                    <span className='rounded-lg border-2 border-black px-2 py-1 font-mono text-sm font-bold'>{vehicle?.plate}</span>
                </div>
                <RideDetails destination={ride.destination} fare={ride.fare} showPickup={false} />
                <p className='mt-4 text-center text-sm text-neutral-500'>Pay in cash when you reach your destination.</p>
            </div>
        </div>
    )
}

export default Riding
