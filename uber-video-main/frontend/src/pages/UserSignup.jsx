import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import api, { getErrorMessage, session } from '../lib/api'
import AuthLayout, { useRedirectIfLoggedIn } from '../components/AuthLayout'
import { Alert, Button, Field } from '../components/ui'

const UserSignup = () => {
  useRedirectIfLoggedIn()
  const [ form, setForm ] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const update = (key) => (e) => setForm(f => ({ ...f, [ key ]: e.target.value }))

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/users/register', {
        fullname: {
          firstname: form.firstName.trim(),
          // backend rejects an empty last name, so leave it out when blank
          lastname: form.lastName.trim() || undefined,
        },
        email: form.email.trim(),
        password: form.password,
      })
      session.save(data.token, 'user')
      setUser(data.user)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout badge='Rider' title='Create your account' subtitle='It only takes a minute.'>
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
        <Button type='submit' loading={loading}>Create account</Button>
      </form>
      <p className='mt-6 text-center text-sm text-neutral-600'>
        Already have an account? <Link to='/login' className='font-semibold text-black underline-offset-4 hover:underline'>Log in</Link>
      </p>
    </AuthLayout>
  )
}

export default UserSignup
