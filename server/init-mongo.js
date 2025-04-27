// init-mongo.js
import collections from "./db/collections.js";
import { MongoClient } from "mongodb";

const createUser = (async () => {

    try {
        console.log("Connecting to DB_URL =", process.env.DB_URL);  // <-- ADD THIS
        const data = await MongoClient.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            retryWrites: false,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true
        });
        const db = data.db('chatGPT')

        console.log("Connected ",db);


        console.log("Checking for existing users...");
        const user = await db.collection(collections.USER).findOne({ email: 'user@example.com' });
        console.log("user is ",user);

        if (user) {
            console.log("User already exists:", user.email);
        } else {
            console.log("User does not exist, creating new user...");
            await db.collection(collections.USER).insertOne({
                email: 'user@example.com',  // Change this email to your test user's email
                password: 'securepassword123',  // You can hash the password before inserting for security
            });
            console.log("User created successfully");
        }

    } catch (err) {
        console.error("Failed connecting to DB", err);  // <-- ADD THIS
        throw err;
    }
})

export { createUser }
