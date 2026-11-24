import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage } from '../lib/api'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import useSocketJoin from '../hooks/useSocketJoin'
import LiveTracking from '../components/LiveTracking'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { Alert, BottomSheet, Logo } from '../components/ui'

const CaptainHome = () => {
    // panel: null | 'request' | 'confirm'
    const [ panel, setPanel ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [ accepting, setAccepting ] = useState(false)
    const [ error, setError ] = useState('')

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useSocketJoin(socket, 'captain', captain?._id)

    // Share live location every 10 seconds so nearby ride requests reach this captain
    useEffect(() => {
        if (!captain?._id || !navigator.geolocation) return
        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                socket.emit('update-location-captain', {
                    userId: captain._id,
                    location: { ltd: coords.latitude, lng: coords.longitude }
                })
            }, () => { /* permission denied */ })
        }
        updateLocation()
        const interval = setInterval(updateLocation, 10000)
        return () => clearInterval(interval)
    }, [ socket, captain?._id ])

    useEffect(() => {
        const onNewRide = (data) => {
            setError('')
            setRide(data)
            setPanel('request')
        }
        socket.on('new-ride', onNewRide)
        return () => socket.off('new-ride', onNewRide)
    }, [ socket ])

    async function acceptRide() {
        setAccepting(true)
        setError('')
        try {
            const { data } = await api.post('/rides/confirm', { rideId: ride._id })
            setRide(data)
            setPanel('confirm')
        } catch (err) {
            setError(getErrorMessage(err, 'Could not accept this ride.'))
        } finally {
            setAccepting(false)
        }
    }

    const closePanels = () => {
        setPanel(null)
        setError('')
    }

    return (
        <div className='relative flex h-screen flex-col overflow-clip'>
            <div className='absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5'>
                <div className='rounded-2xl bg-white/90 px-3 py-2 shadow-md backdrop-blur'><Logo /></div>
                <Link to='/captain/logout' title='Log out' className='grid h-11 w-11 place-items-center rounded-full bg-white shadow-md hover:bg-neutral-100'>
                    <i className='ri-logout-box-r-line text-lg'></i>
                </Link>
            </div>

            <div className='flex-1'>
                <LiveTracking />
            </div>

            <div className='rounded-t-3xl bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]'>
                <CaptainDetails />
            </div>

            <BottomSheet open={panel === 'request'} onClose={closePanels}>
                {error && <Alert onClose={() => setError('')}>{error}</Alert>}
                <RidePopUp ride={ride} accepting={accepting} onAccept={acceptRide} onIgnore={closePanels} />
            </BottomSheet>

            <BottomSheet open={panel === 'confirm'} className='h-full max-h-full rounded-none'>
                <ConfirmRidePopUp ride={ride} onCancel={closePanels} />
            </BottomSheet>
        </div>
    )
}

export default CaptainHome
