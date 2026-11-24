import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { useRedirectIfLoggedIn } from '../components/AuthLayout'

const Start = () => {
  useRedirectIfLoggedIn()

  return (
    <div className='relative flex min-h-screen flex-col justify-between overflow-clip bg-black text-white'>
      <img
        className='absolute inset-0 h-full w-full object-cover opacity-60'
        src='https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=1200&auto=format&fit=crop'
        alt=''
      />
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black' />

      <div className='relative px-6 pt-8'>
        <Logo light />
      </div>

      <div className='relative px-6 pb-8'>
        <h1 className='text-4xl font-bold leading-tight tracking-tight'>Go anywhere,<br />get there fast.</h1>
        <p className='mt-3 text-neutral-300'>Book a car, moto or auto in seconds — or start earning as a Captain.</p>
        <Link to='/login' className='mt-8 flex items-center justify-center gap-2 rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-neutral-200'>
          Get started <i className='ri-arrow-right-line'></i>
        </Link>
        <Link to='/captain-login' className='mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/30 py-4 font-semibold text-white transition hover:bg-white/10'>
          <i className='ri-steering-2-line'></i> Drive as a Captain
        </Link>
      </div>
    </div>
  )
}

export default Start
