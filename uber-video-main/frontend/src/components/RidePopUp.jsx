import React from 'react'
import { Avatar, Button, RideDetails, fullName } from './ui'

const RidePopUp = ({ ride, accepting, onAccept, onIgnore }) => (
    <div>
        <h3 className='mb-4 text-2xl font-bold tracking-tight'>New ride request</h3>
        <div className='mb-4 flex items-center gap-3 rounded-2xl bg-amber-100 p-3'>
            <Avatar name={fullName(ride?.user)} />
            <p className='flex-1 font-semibold capitalize'>{fullName(ride?.user) || 'Rider'}</p>
            <p className='text-xl font-bold'>₹{ride?.fare}</p>
        </div>
        <RideDetails pickup={ride?.pickup} destination={ride?.destination} fare={ride?.fare} />
        <div className='mt-5 grid grid-cols-2 gap-3'>
            <Button variant='secondary' onClick={onIgnore} disabled={accepting}>Ignore</Button>
            <Button variant='success' onClick={onAccept} loading={accepting}>Accept</Button>
        </div>
    </div>
)

export default RidePopUp
