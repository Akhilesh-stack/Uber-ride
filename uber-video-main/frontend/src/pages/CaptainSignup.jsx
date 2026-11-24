import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import api, { getErrorMessage, session } from '../lib/api'
import AuthLayout, { useRedirectIfLoggedIn } from '../components/AuthLayout'
import { Alert, Button, Field } from '../components/ui'
import { VEHICLES } from '../lib/vehicles'

const CaptainSignup = () => {
  useRedirectIfLoggedIn()
  const navigate = useNavigate()
  const { setCaptain } = useContext(CaptainDataContext)

  const [ form, setForm ] = useState({
    firstName: '', lastName: '', email: '', password: '',
    color: '', plate: '', capacity: '', vehicleType: 'car',
  })
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const update = (key) => (e) => setForm(f => ({ ...f, [ key ]: e.target.value }))

  const pickVehicle = (type) => setForm(f => ({ ...f, vehicleType: type, capacity: f.capacity || String(VEHICLES[ type ].seats) }))

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/captains/register', {
        fullname: {
          firstname: form.firstName.trim(),
          lastname: form.lastName.trim() || undefined,
        },
        email: form.email.trim(),
        password: form.password,
        vehicle: {
          color: form.color.trim(),
          plate: form.plate.trim().toUpperCase(),
          capacity: Number(form.capacity),
          vehicleType: form.vehicleType,
        },
      })
      session.save(data.token, 'captain')
      setCaptain(data.captain)
      navigate('/captain-home', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout badge='Captain' title='Become a Captain' subtitle='Tell us about you and your vehicle.'>
      <form onSubmit={submitHandler} className='space-y-5'>
        <Alert onClose={() => setError('')}>{error}</Alert>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='First name' required minLength={3} autoComplete='given-name' placeholder='Rahul'
            value={form.firstName} onChange={update('firstName')} />
          <Field label='Last name' minLength={3} autoComplete='family-name' placeholder='Optional'
            value={form.lastName} onChange={update('lastName')} />
        </div>
        <Field label='Email' type='email' required autoComplete='email' placeholder='you@example.com'
          value={form.email} onChange={update('email')} />
        <Field label='Password' type='password' required minLength={6} autoComplete='new-password' placeholder='At least 6 characters'
          value={form.password} onChange={update('password')} />

        <div className='pt-2'>
          <p className='mb-2 text-sm font-medium text-neutral-700'>Vehicle type</p>
          <div className='grid grid-cols-3 gap-3'>
            {Object.entries(VEHICLES).map(([ type, v ]) => (
              <button
                key={type}
                type='button'
                onClick={() => pickVehicle(type)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition ${form.vehicleType === type ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-300'}`}
              >
                <i className={`${v.icon} text-2xl`}></i>
                <span className='text-sm font-medium'>{v.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='Color' required minLength={3} placeholder='White'
            value={form.color} onChange={update('color')} />
          <Field label='Number plate' required minLength={3} placeholder='DL 01 AB 1234'
            value={form.plate} onChange={update('plate')} />
        </div>
        <Field label='Seats' type='number' required min={1} max={10} placeholder={String(VEHICLES[ form.vehicleType ].seats)}
          value={form.capacity} onChange={update('capacity')} />

        <Button type='submit' loading={loading}>Create Captain account</Button>
      </form>
      <p className='mt-6 text-center text-sm text-neutral-600'>
        Already registered? <Link to='/captain-login' className='font-semibold text-black underline-offset-4 hover:underline'>Log in</Link>
      </p>
    </AuthLayout>
  )
}

export default CaptainSignup
