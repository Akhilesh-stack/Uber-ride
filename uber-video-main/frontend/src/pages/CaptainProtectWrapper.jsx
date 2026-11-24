import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

const CaptainProtectWrapper = ({ children }) => (
    <ProtectedRoute role='captain'>{children}</ProtectedRoute>
)

export default CaptainProtectWrapper
