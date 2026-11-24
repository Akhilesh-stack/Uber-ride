import { useEffect } from 'react'

// Tell the server which socket belongs to this user/captain.
// Re-sent on every reconnect, because the socket id changes and events would be lost otherwise.
export default function useSocketJoin(socket, userType, userId) {
    useEffect(() => {
        if (!userId) return
        const join = () => socket.emit('join', { userType, userId })
        join()
        socket.on('connect', join)
        return () => socket.off('connect', join)
    }, [ socket, userType, userId ])
}
