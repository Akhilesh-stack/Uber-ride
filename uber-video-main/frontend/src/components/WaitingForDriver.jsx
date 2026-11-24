import React from 'react'
import { Avatar, RideDetails, VehicleBadge, fullName } from './ui'
import { vehicleInfo } from '../lib/vehicles'

const WaitingForDriver = ({ ride }) => {
  const captain = ride?.captain
  const vehicle = captain?.vehicle

  return (
    <div>
      <h3 className='text-2xl font-bold tracking-tight'>Your Captain is on the way</h3>
      <p className='mb-5 text-sm text-neutral-500'>Share the OTP with your Captain to start the ride.</p>

      <div className='mb-5 flex items-center justify-between rounded-2xl bg-neutral-900 p-4 text-white'>
        <span className='text-sm text-neutral-300'>Your OTP</span>
        <span className='font-mono text-3xl font-bold tracking-[0.3em]'>{ride?.otp || '------'}</span>
      </div>

      <div className='mb-5 flex items-center gap-3'>
        <Avatar name={fullName(captain)} />
        <div className='flex-1'>
          <p className='font-semibold capitalize'>{fullName(captain) || 'Captain'}</p>
          <p className='text-sm capitalize text-neutral-500'>{vehicle?.color} {vehicleInfo(vehicle?.vehicleType).label}</p>
        </div>
        <div className='flex items-center gap-2'>
          <VehicleBadge type={vehicle?.vehicleType} className='h-11 w-11 text-2xl' />
          <span className='rounded-lg border-2 border-black px-2 py-1 font-mono text-sm font-bold'>{vehicle?.plate}</span>
        </div>
      </div>

      <RideDetails pickup={ride?.pickup} destination={ride?.destination} fare={ride?.fare} />
    </div>
  )
}

export default WaitingForDriver
