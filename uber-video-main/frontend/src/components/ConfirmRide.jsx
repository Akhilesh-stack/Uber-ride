import React from 'react'
import { Button, RideDetails, VehicleBadge } from './ui'
import { vehicleInfo } from '../lib/vehicles'

const ConfirmRide = ({ pickup, destination, fare, vehicleType, onConfirm }) => (
    <div>
        <h3 className='mb-4 text-2xl font-bold tracking-tight'>Confirm your ride</h3>
        <div className='mb-4 flex items-center gap-3'>
            <VehicleBadge type={vehicleType} />
            <div>
                <p className='font-semibold'>{vehicleInfo(vehicleType).label}</p>
                <p className='text-sm text-neutral-500'>{vehicleInfo(vehicleType).description}</p>
            </div>
        </div>
        <RideDetails pickup={pickup} destination={destination} fare={fare?.[ vehicleType ]} />
        <Button variant='success' className='mt-5' onClick={onConfirm}>Confirm ride</Button>
    </div>
)

export default ConfirmRide
