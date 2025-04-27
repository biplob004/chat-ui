import { MongoClient } from "mongodb";
import dotnet from 'dotenv'
let db = null

const connectDB = async (done) => {
    try {
        console.log("Connecting to DB_URL =", process.env.DB_URL);  // <-- ADD THIS
        var data = await MongoClient.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            retryWrites: false,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true
        });
        db = data.db('chatGPT')
        done()
    } catch (err) {
        console.error("Failed connecting to DB", err);  // <-- ADD THIS
        done(err)
    }
}


export { connectDB, db }
