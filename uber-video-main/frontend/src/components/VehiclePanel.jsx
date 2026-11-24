import React from 'react'
import { VEHICLES } from '../lib/vehicles'

const VehiclePanel = ({ fare, selected, onSelect }) => (
    <div>
        <h3 className='mb-4 text-2xl font-bold tracking-tight'>Choose a ride</h3>
        <div className='space-y-2'>
            {Object.entries(VEHICLES).map(([ type, v ]) => (
                <button
                    key={type}
                    type='button'
                    onClick={() => onSelect(type)}
                    className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3 text-left transition hover:border-neutral-300 ${selected === type ? 'border-black' : 'border-neutral-100'}`}
                >
                    <span className='grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-neutral-100 text-3xl'>
                        <i className={v.icon}></i>
                    </span>
                    <span className='flex-1'>
                        <span className='flex items-center gap-2 font-semibold'>
                            {v.label}
                            <span className='flex items-center gap-0.5 text-sm font-normal text-neutral-500'>
                                <i className='ri-user-3-fill'></i>{v.seats}
                            </span>
                        </span>
                        <span className='block text-sm text-neutral-500'>{v.eta} away · {v.description}</span>
                    </span>
                    <span className='text-lg font-semibold'>{fare?.[ type ] != null ? `₹${fare[ type ]}` : '—'}</span>
                </button>
            ))}
        </div>
    </div>
)

export default VehiclePanel
