import { io, Socket } from "socket.io-client"

let socket: Socket;

export const getSocket = (token: string) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
            auth: {
                token: token,
            }
        });
    }
    return socket;
} 