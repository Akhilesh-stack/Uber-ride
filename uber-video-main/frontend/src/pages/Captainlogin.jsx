import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import api, { getErrorMessage, session } from '../lib/api'
import AuthLayout, { useRedirectIfLoggedIn } from '../components/AuthLayout'
import { Alert, Button, Field } from '../components/ui'

const Captainlogin = () => {
  useRedirectIfLoggedIn()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/captains/login', { email: email.trim(), password })
      session.save(data.token, 'captain')
      setCaptain(data.captain)
      navigate('/captain-home', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      badge='Captain'
      title='Ready to drive?'
      subtitle='Log in to start accepting rides.'
      footer={
        <Link to='/login' className='flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3.5 font-semibold hover:bg-neutral-50'>
          <i className='ri-user-3-line'></i> Sign in as Rider
        </Link>
      }
    >
      <form onSubmit={submitHandler} className='space-y-5'>
        <Alert onClose={() => setError('')}>{error}</Alert>
        <Field label='Email' type='email' required autoComplete='email' placeholder='you@example.com'
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label='Password' type='password' required minLength={6} autoComplete='current-password' placeholder='••••••••'
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type='submit' loading={loading}>Log in</Button>
      </form>
      <p className='mt-6 text-center text-sm text-neutral-600'>
        Want to drive with us? <Link to='/captain-signup' className='font-semibold text-black underline-offset-4 hover:underline'>Register as a Captain</Link>
      </p>
    </AuthLayout>
  )
}

export default Captainlogin
