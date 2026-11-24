import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { session } from '../lib/api'
import { PageLoader } from '../components/ui'

export const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/captains/logout')
            .catch(() => { /* log out locally even if the server call fails */ })
            .finally(() => {
                session.clear()
                navigate('/captain-login', { replace: true })
            })
    }, [ navigate ])

    return <PageLoader label='Logging out...' />
}

export default CaptainLogout
