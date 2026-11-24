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

// Free hosting (Render) sleeps when idle and answers 502/503 or drops the
// connection while it wakes up. Retry a few times before giving up.
const RETRY_STATUSES = [ 502, 503, 504 ]
const MAX_RETRIES = 4
const RETRY_DELAY_MS = 5000

const isServerUnavailable = (err) =>
    err?.code === 'ERR_NETWORK' || RETRY_STATUSES.includes(err?.response?.status)

api.interceptors.response.use(undefined, async (err) => {
    const config = err.config
    if (!config || !isServerUnavailable(err)) throw err
    config.__retryCount = (config.__retryCount || 0) + 1
    if (config.__retryCount > MAX_RETRIES) throw err
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    return api(config)
})

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
    const data = err?.response?.data
    if (Array.isArray(data?.errors) && data.errors.length) return data.errors[ 0 ].msg
    if (data?.message) return data.message
    if (isServerUnavailable(err)) return 'The server is not responding right now. Please try again in a minute.'
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
