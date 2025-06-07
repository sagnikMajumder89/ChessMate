import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { prisma } from "../db/prisma"

export const checkUser = async (decodedToken: DecodedIdToken) => {
    const user = await prisma.user.findUnique({
        where: {
            firebaseId: decodedToken.uid
        },
        select: {
            id: true,
            rating: true,
            email: true,
            username: true,
            avatar: true,
            nationality: true,
            bio: true
        }
    })

    if (!user) {
        const username = decodedToken.email?.split('@')[0] || `user_${decodedToken.uid}`;
        return await prisma.user.create({
            data: {
                firebaseId: decodedToken.uid,
                email: decodedToken.email || "",
                username,
                avatar: decodedToken.avatar || ""
            },
            select: {
                id: true,
                rating: true
            }
        })
    }

    return user;
}