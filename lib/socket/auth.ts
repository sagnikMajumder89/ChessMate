import { prisma } from "../db/prisma"

interface UserProps {
    uid: string;
    email: string;
}

export const checkUser = async ({ uid, email }: UserProps) => {
    const user = await prisma.user.findUnique({
        where: {
            firebaseId: uid
        },
        select: {
            id: true,
            rating: true
        }
    })

    if (!user) {
        const username = email.split('@')[0];
        return await prisma.user.create({
            data: {
                firebaseId: uid,
                email,
                username
            },
            select: {
                id: true,
                rating: true
            }
        })
    }

    return user;
}