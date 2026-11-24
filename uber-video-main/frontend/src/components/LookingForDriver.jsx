import React from 'react'
import { Button, RideDetails, VehicleBadge } from './ui'

const LookingForDriver = ({ pickup, destination, fare, vehicleType, onClose }) => (
    <div>
        <div className='mb-5 flex items-center gap-4'>
            <span className='relative grid place-items-center'>
                <span className='absolute h-14 w-14 animate-ping rounded-2xl bg-emerald-200'></span>
                <VehicleBadge type={vehicleType} className='relative h-14 w-14 text-3xl' />
            </span>
            <div>
                <h3 className='text-2xl font-bold tracking-tight'>Finding your Captain</h3>
                <p className='text-sm text-neutral-500'>Sending your request to nearby Captains...</p>
            </div>
        </div>
        <div className='mb-5 h-1 overflow-hidden rounded-full bg-neutral-100'>
            <div className='h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-black'></div>
        </div>
        <RideDetails pickup={pickup} destination={destination} fare={fare?.[ vehicleType ]} />
        <Button variant='secondary' className='mt-5' onClick={onClose}>Back to search</Button>
    </div>
)

export default LookingForDriver
