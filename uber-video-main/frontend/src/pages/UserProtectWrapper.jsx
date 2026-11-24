import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

const UserProtectWrapper = ({ children }) => (
    <ProtectedRoute role='user'>{children}</ProtectedRoute>
)

export default UserProtectWrapper
