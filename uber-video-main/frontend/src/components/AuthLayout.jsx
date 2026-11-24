import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from './ui'
import { homeFor, session } from '../lib/api'

// Already logged in? Skip the auth screens.
export const useRedirectIfLoggedIn = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if (session.token() && session.role()) {
            navigate(homeFor(session.role()), { replace: true })
        }
    }, [ navigate ])
}

const AuthLayout = ({ badge, title, subtitle, children, footer }) => (
    <div className='flex min-h-screen flex-col px-6 pb-6 pt-8'>
        <div className='flex items-center justify-between'>
            <Link to='/'><Logo /></Link>
            {badge && (
                <span className='rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600'>
                    {badge}
                </span>
            )}
        </div>
        <div className='mt-10 flex-1'>
            <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
            {subtitle && <p className='mt-1.5 text-neutral-500'>{subtitle}</p>}
            <div className='mt-8'>{children}</div>
        </div>
        {footer && <div className='mt-8'>{footer}</div>}
    </div>
)

export default AuthLayout
