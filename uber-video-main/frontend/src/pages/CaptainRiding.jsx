import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'
import { BottomSheet, Button, Logo } from '../components/ui'

const CaptainRiding = () => {
    const [ finishOpen, setFinishOpen ] = useState(false)
    const location = useLocation()
    const ride = location.state?.ride

    // Opened directly (e.g. after a refresh) without ride data
    if (!ride) return <Navigate to='/captain-home' replace />

    return (
        <div className='relative flex h-screen flex-col overflow-clip'>
            <div className='absolute inset-x-0 top-0 z-10 p-5'>
                <div className='inline-block rounded-2xl bg-white/90 px-3 py-2 shadow-md backdrop-blur'><Logo /></div>
            </div>

            <div className='flex-1'>
                <LiveTracking />
            </div>

            <div className='rounded-t-3xl bg-amber-300 p-5'>
                <p className='text-xs font-semibold uppercase tracking-wide text-amber-900'>Ride in progress · Drop-off</p>
                <p className='mt-1 text-lg font-semibold'>{ride.destination}</p>
                <Button className='mt-4' onClick={() => setFinishOpen(true)}>Complete ride</Button>
            </div>

            <BottomSheet open={finishOpen} onClose={() => setFinishOpen(false)}>
                <FinishRide ride={ride} />
            </BottomSheet>
        </div>
    )
}

export default CaptainRiding
