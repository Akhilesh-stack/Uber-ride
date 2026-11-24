import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import api, { getErrorMessage, session } from '../lib/api'
import AuthLayout, { useRedirectIfLoggedIn } from '../components/AuthLayout'
import { Alert, Button, Field } from '../components/ui'

const UserLogin = () => {
  useRedirectIfLoggedIn()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/users/login', { email: email.trim(), password })
      session.save(data.token, 'user')
      setUser(data.user)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      badge='Rider'
      title='Welcome back'
      subtitle='Log in to book your next ride.'
      footer={
        <Link to='/captain-login' className='flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3.5 font-semibold hover:bg-neutral-50'>
          <i className='ri-steering-2-line'></i> Sign in as Captain
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
        New here? <Link to='/signup' className='font-semibold text-black underline-offset-4 hover:underline'>Create an account</Link>
      </p>
    </AuthLayout>
  )
}

export default UserLogin
