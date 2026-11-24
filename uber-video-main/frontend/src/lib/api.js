import axios from 'axios'

// Falls back to the local backend when VITE_BASE_URL is not set
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const api = axios.create({ baseURL: BASE_URL })

// Attach the saved token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
    const data = err?.response?.data
    if (Array.isArray(data?.errors) && data.errors.length) return data.errors[ 0 ].msg
    if (data?.message) return data.message
    if (err?.code === 'ERR_NETWORK') return 'Cannot reach the server. Please check that the backend is running.'
    return fallback
}

// token + role ('user' | 'captain') are kept together so each side knows where to send you
export const session = {
    save(token, role) {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
    },
    clear() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    },
    token: () => localStorage.getItem('token'),
    role: () => localStorage.getItem('role'),
}

export const homeFor = (role) => (role === 'captain' ? '/captain-home' : '/home')

export default api
