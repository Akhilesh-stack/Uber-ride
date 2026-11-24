import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../lib/api'
import { Alert, Avatar, Button, RideDetails, fullName } from './ui'

const FinishRide = ({ ride }) => {
    const navigate = useNavigate()
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)

    async function endRide() {
        setError('')
        setLoading(true)
        try {
            await api.post('/rides/end-ride', { rideId: ride._id })
            navigate('/captain-home', { replace: true })
        } catch (err) {
            setError(getErrorMessage(err, 'Could not finish the ride.'))
            setLoading(false)
        }
    }

    return (
        <div>
            <h3 className='mb-4 text-2xl font-bold tracking-tight'>Finish this ride</h3>
            <div className='mb-4 flex items-center gap-3 rounded-2xl border-2 border-amber-300 p-3'>
                <Avatar name={fullName(ride?.user)} />
                <p className='flex-1 font-semibold capitalize'>{fullName(ride?.user) || 'Rider'}</p>
            </div>
            <RideDetails pickup={ride?.pickup} destination={ride?.destination} fare={ride?.fare} />
            <p className='mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800'>
                <i className='ri-money-rupee-circle-line'></i> Collect <b>₹{ride?.fare}</b> in cash before finishing.
            </p>
            <Alert>{error}</Alert>
            <Button variant='success' className='mt-4' onClick={endRide} loading={loading}>Finish ride</Button>
        </div>
    )
}

export default FinishRide
