import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { Avatar, VehicleBadge, fullName } from './ui'
import { vehicleInfo } from '../lib/vehicles'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)
    const vehicle = captain?.vehicle

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Avatar name={fullName(captain)} />
                    <div>
                        <h4 className='text-lg font-semibold capitalize'>{fullName(captain)}</h4>
                        <p className='flex items-center gap-1.5 text-sm text-emerald-600'>
                            <span className='h-2 w-2 rounded-full bg-emerald-500'></span> Online · waiting for rides
                        </p>
                    </div>
                </div>
            </div>

            <div className='mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-neutral-100 p-3 text-center'>
                <div className='flex flex-col items-center'>
                    <VehicleBadge type={vehicle?.vehicleType} className='h-9 w-9 bg-white text-xl' />
                    <p className='mt-1 font-semibold'>{vehicleInfo(vehicle?.vehicleType).label}</p>
                    <p className='text-xs text-neutral-500'>Vehicle</p>
                </div>
                <div className='flex flex-col items-center'>
                    <span className='grid h-9 w-9 place-items-center rounded-2xl bg-white text-xl'><i className='ri-hashtag'></i></span>
                    <p className='mt-1 font-mono font-semibold'>{vehicle?.plate || '—'}</p>
                    <p className='text-xs text-neutral-500'>Plate</p>
                </div>
                <div className='flex flex-col items-center'>
                    <span className='grid h-9 w-9 place-items-center rounded-2xl bg-white text-xl'><i className='ri-group-line'></i></span>
                    <p className='mt-1 font-semibold'>{vehicle?.capacity ?? '—'}</p>
                    <p className='text-xs text-neutral-500'>Seats</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
