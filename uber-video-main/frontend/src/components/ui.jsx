import React, { useState } from 'react'
import { vehicleInfo } from '../lib/vehicles'

export const Logo = ({ light = false, className = '' }) => (
    <div className={`flex items-center gap-2 select-none ${className}`}>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white text-black' : 'bg-black text-white'}`}>
            <i className='ri-steering-2-fill text-lg'></i>
        </span>
        <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-black'}`}>Ride</span>
    </div>
)

export const Spinner = ({ className = '' }) => (
    <span className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
)

const variants = {
    primary: 'bg-black text-white hover:bg-neutral-800',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
}

export const Button = ({ loading = false, variant = 'primary', className = '', children, disabled, type = 'button', ...props }) => (
    <button
        type={type}
        disabled={disabled || loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${variants[ variant ]} ${className}`}
        {...props}
    >
        {loading && <Spinner />}
        {children}
    </button>
)

export const Field = ({ label, hint, className = '', type = 'text', ...props }) => {
    const [ show, setShow ] = useState(false)
    const isPassword = type === 'password'
    return (
        <label className={`block ${className}`}>
            {label && <span className='mb-1.5 block text-sm font-medium text-neutral-700'>{label}</span>}
            <span className='relative block'>
                <input
                    type={isPassword && show ? 'text' : type}
                    className='w-full rounded-xl border border-transparent bg-neutral-100 px-4 py-3 text-base outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white'
                    {...props}
                />
                {isPassword && (
                    <button
                        type='button'
                        onClick={() => setShow(s => !s)}
                        className='absolute inset-y-0 right-3 my-auto h-8 text-neutral-500 hover:text-black'
                        aria-label={show ? 'Hide password' : 'Show password'}
                    >
                        <i className={show ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                )}
            </span>
            {hint && <span className='mt-1 block text-xs text-neutral-500'>{hint}</span>}
        </label>
    )
}

export const Alert = ({ children, onClose }) => {
    if (!children) return null
    return (
        <div role='alert' className='mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'>
            <i className='ri-error-warning-line mt-0.5'></i>
            <span className='flex-1'>{children}</span>
            {onClose && (
                <button type='button' onClick={onClose} aria-label='Dismiss'>
                    <i className='ri-close-line'></i>
                </button>
            )}
        </div>
    )
}

export const PageLoader = ({ label = 'Loading...' }) => (
    <div className='flex h-full min-h-screen flex-col items-center justify-center gap-3 text-neutral-500'>
        <Spinner className='h-8 w-8 text-black' />
        <p className='text-sm'>{label}</p>
    </div>
)

export const Avatar = ({ name = '', className = 'h-11 w-11 text-base' }) => {
    const initials = name.split(' ').filter(Boolean).map(p => p[ 0 ]).slice(0, 2).join('').toUpperCase() || '?'
    return (
        <span className={`grid shrink-0 place-items-center rounded-full bg-neutral-900 font-semibold text-white ${className}`}>
            {initials}
        </span>
    )
}

export const VehicleBadge = ({ type, className = 'h-14 w-14 text-3xl' }) => (
    <span className={`grid shrink-0 place-items-center rounded-2xl bg-neutral-100 ${className}`}>
        <i className={vehicleInfo(type).icon}></i>
    </span>
)

export const fullName = (person) =>
    [ person?.fullname?.firstname, person?.fullname?.lastname ].filter(Boolean).join(' ')

// Bottom sheet that slides up over the map
export const BottomSheet = ({ open, onClose, children, className = '' }) => (
    <div
        aria-hidden={!open}
        className={`absolute inset-x-0 bottom-0 z-30 max-h-[92%] overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-[transform,visibility] duration-300 ease-out ${open ? 'visible translate-y-0' : 'invisible pointer-events-none translate-y-full'} ${className}`}
    >
        <button
            type='button'
            onClick={onClose}
            disabled={!onClose}
            className='mx-auto mb-3 block h-1.5 w-12 rounded-full bg-neutral-300'
            aria-label='Close'
        />
        {children}
    </div>
)

// Pickup / destination / fare rows used across ride screens
export const RideDetails = ({ pickup, destination, fare, showPickup = true }) => (
    <div className='divide-y divide-neutral-100 rounded-2xl border border-neutral-100'>
        {showPickup && (
            <div className='flex items-start gap-4 p-4'>
                <i className='ri-checkbox-blank-circle-fill mt-0.5 text-xs text-black'></i>
                <div className='min-w-0'>
                    <p className='text-xs uppercase tracking-wide text-neutral-500'>Pickup</p>
                    <p className='font-medium'>{pickup || '—'}</p>
                </div>
            </div>
        )}
        <div className='flex items-start gap-4 p-4'>
            <i className='ri-checkbox-blank-fill mt-0.5 text-xs text-black'></i>
            <div className='min-w-0'>
                <p className='text-xs uppercase tracking-wide text-neutral-500'>Drop-off</p>
                <p className='font-medium'>{destination || '—'}</p>
            </div>
        </div>
        <div className='flex items-center gap-4 p-4'>
            <i className='ri-money-rupee-circle-line text-lg'></i>
            <div>
                <p className='text-lg font-semibold'>{fare != null ? `₹${fare}` : '—'}</p>
                <p className='text-xs text-neutral-500'>Cash payment</p>
            </div>
        </div>
    </div>
)
