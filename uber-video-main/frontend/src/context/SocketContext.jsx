import React, { createContext } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../lib/api';

export const SocketContext = createContext();

const socket = io(BASE_URL);

const SocketProvider = ({ children }) => (
    <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
);

export default SocketProvider;
