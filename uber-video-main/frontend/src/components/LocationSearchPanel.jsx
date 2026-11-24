import React from 'react'
import { Spinner } from './ui'

const LocationSearchPanel = ({ suggestions, loading, query, onSelect }) => {
    if (query.trim().length < 3) {
        return <p className='py-6 text-center text-sm text-neutral-500'>Type at least 3 letters to search places.</p>
    }
    if (loading) {
        return <div className='flex justify-center py-6 text-neutral-500'><Spinner /></div>
    }
    if (!suggestions.length) {
        return <p className='py-6 text-center text-sm text-neutral-500'>No places found. You can still use what you typed.</p>
    }
    return (
        <ul className='divide-y divide-neutral-100'>
            {suggestions.map((place) => (
                <li key={place}>
                    <button
                        type='button'
                        onClick={() => onSelect(place)}
                        className='flex w-full items-center gap-4 py-3 text-left hover:bg-neutral-50'
                    >
                        <span className='grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100'>
                            <i className='ri-map-pin-2-fill'></i>
                        </span>
                        <span className='font-medium'>{place}</span>
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default LocationSearchPanel
