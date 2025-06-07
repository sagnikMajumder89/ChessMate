import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { checkUser } from "@/lib/socket/auth";


export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const idToken = authHeader.split(" ")[1];
    
    try{

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedToken) {
            return Response.json({ error: "Invalid user ID" }, { status: 401 });
        }
        const user = await checkUser(decodedToken);

        return Response.json(user || { error: "User not found" }, { status: user ? 200 : 404 });
    }catch (error) {
        logger.error("Error fetching user profile:", error);
        return Response.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }

}


export async function POST(request: NextRequest){
    const {uid, displayName, bio, nationality} = await request.json();
    try{
        const response = await prisma.user.update({
            where: {firebaseId: uid},
            data:{
                username: displayName,
                bio: bio,
                nationality
            }
        })

        if (!response) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json(response, { status: 200 });
    }catch (error) {
        logger.error("Error updating user profile:", error);
        return Response.json({ error: "Failed to update user profile" }, { status: 500 });
    }
}