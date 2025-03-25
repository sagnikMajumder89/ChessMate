import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { admin } from "@/lib/firebase/firebaseAdmin";
export async function POST(req: NextRequest) {
    try {
        // verify from header token
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken.uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { firebaseId, email, name, avatar } = await req.json();

        if (!firebaseId || !email) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { firebaseId },
        });

        // if name null create from email
        let modifiedName = name;
        if (!modifiedName) {
            modifiedName = email.split("@")[0];
        }

        if (!user) {
            user = await prisma.user.create({
                data: { firebaseId, email, username: modifiedName, avatar },
            });
        }
        // select the fields we want to return
        const selectUser = { id: user.id, name: user.username, rating: user.rating };
        return NextResponse.json(selectUser);
    } catch (error) {
        logger.error("Error syncing user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
