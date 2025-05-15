import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

if (!admin.apps.length) {
    const serviceAccountPath = path.join(process.cwd(), "serviceAccount.json");

    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(readFileSync(serviceAccountPath, "utf-8"))),
    });
}

export { admin };
