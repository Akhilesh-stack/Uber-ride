import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { homeFor, session } from '../lib/api'
import { UserDataContext } from '../context/UserContext'
import { CaptainDataContext } from '../context/CapatainContext'
import { PageLoader } from './ui'

const config = {
    user: { endpoint: '/users/profile', login: '/login', pick: (data) => data },
    captain: { endpoint: '/captains/profile', login: '/captain-login', pick: (data) => data.captain },
}

const ProtectedRoute = ({ role, children }) => {
    const navigate = useNavigate()
    const { setUser } = useContext(UserDataContext)
    const { setCaptain } = useContext(CaptainDataContext)
    const [ ready, setReady ] = useState(false)

    useEffect(() => {
        const { endpoint, login, pick } = config[ role ]
        const token = session.token()
        const savedRole = session.role()

        if (!token) {
            navigate(login, { replace: true })
            return
        }

        // Logged in as the other role: send them to their own home
        if (savedRole && savedRole !== role) {
            navigate(homeFor(savedRole), { replace: true })
            return
        }

        let cancelled = false
        api.get(endpoint)
            .then((res) => {
                if (cancelled) return
                const data = pick(res.data)
                if (role === 'user') setUser(data)
                else setCaptain(data)
                setReady(true)
            })
            .catch(() => {
                if (cancelled) return
                session.clear()
                navigate(login, { replace: true })
            })

        return () => { cancelled = true }
    }, [ role, navigate, setUser, setCaptain ])

    if (!ready) return <PageLoader />

    return <>{children}</>
}

export default ProtectedRoute
