import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../lib/api'
import { Alert, Avatar, Button, RideDetails, fullName } from './ui'

const ConfirmRidePopUp = ({ ride, onCancel }) => {
    const [ otp, setOtp ] = useState('')
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await api.get('/rides/start-ride', { params: { rideId: ride._id, otp } })
            navigate('/captain-riding', { state: { ride: data } })
        } catch (err) {
            setError(getErrorMessage(err, 'Could not start the ride.'))
            setLoading(false)
        }
    }

    return (
        <div>
            <h3 className='text-2xl font-bold tracking-tight'>Pick up your rider</h3>
            <p className='mb-5 text-sm text-neutral-500'>Ask the rider for their 6-digit OTP to start the trip.</p>

            <div className='mb-4 flex items-center gap-3 rounded-2xl border-2 border-amber-300 p-3'>
                <Avatar name={fullName(ride?.user)} />
                <p className='flex-1 font-semibold capitalize'>{fullName(ride?.user) || 'Rider'}</p>
            </div>

            <RideDetails pickup={ride?.pickup} destination={ride?.destination} fare={ride?.fare} />

            <form onSubmit={submitHandler} className='mt-6'>
                <Alert onClose={() => setError('')}>{error}</Alert>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    required
                    minLength={6}
                    maxLength={6}
                    className='w-full rounded-xl border-2 border-transparent bg-neutral-100 px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-black focus:bg-white'
                    placeholder='······'
                    aria-label='OTP'
                />
                <div className='mt-5 grid grid-cols-2 gap-3'>
                    {/* type=button so Cancel doesn't submit the form */}
                    <Button variant='danger' onClick={onCancel} disabled={loading}>Cancel</Button>
                    <Button type='submit' variant='success' loading={loading} disabled={otp.length !== 6}>Start ride</Button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp
