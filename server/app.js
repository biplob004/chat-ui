import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotnet from "dotenv";
import { connectDB } from "./db/connection.js";
import ChatRoute from "./routes/chat.js";
import UserRoute from "./routes/user.js";
import path from "path";
import * as fs from 'fs';
import { createUser } from "./init-mongo.js";

dotnet.config();

let app = express();

// Body parser middleware
app.use(express.json());

let port = process.env.PORT;

const allowedOrigins = ["http://localhost:8080", "http://localhost:5001", "http://localhost:5000", "https://d3shm7c63roazp.cloudfront.net"];

app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
);

// app.use(cors({ credentials: true, origin: process.env.SITE_URL }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

// api route
app.use("/api/chat/", ChatRoute);
app.use("/api/user/", UserRoute);
app.use("/api/health/", (req, res) => res.status(200).json({msg: "api is running"}));

// -------------------------------------Bug report endpoint---------------------------------
// const fs = require('fs');
// const path = require('path');

app.post('/api/bug-report', (req, res) => {
  const __dirname = ''
  try {
    const bugReport = req.body;
    
    const reportWithTimestamp = {
      ...bugReport,
      timestamp: new Date().toISOString()
    };
    
    // Convert to string format for logging
    const logEntry = JSON.stringify(reportWithTimestamp) + '\n';
    
    // Define the log file path
    const logFilePath = path.join(__dirname, 'logs', 'bug-reports.log');
    
    // Ensure the logs directory exists
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      fs.mkdirSync(path.join(__dirname, 'logs'));
    }
    
    // Append the bug report to the log file
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error writing to bug report log:', err);
        return res.status(500).json({ success: false, message: 'Failed to save bug report' });
      }
      
      console.log('Bug report saved successfully');
      res.status(200).json({ success: true, message: 'Bug report submitted successfully' });
    });

    //TODO: Send email (optional)
  } catch (error) {
    console.error('Error processing bug report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ----------------------------------------------------------------------------------------------

// front end react route
/*app.get('/*',(req,res)=>{
    res.sendFile(path.join(`${path.resolve(path.dirname(''))}/dist/index.html`))
})*/

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

connectDB((err) => {
  if (err) return console.log("MongoDB Connect Failed : ", err);

  console.log("MongoDB Connected");

  app.listen(port, () => {
    console.log("server started", port);
  });
});

createUser((err) => {
  if (err) {
    console.log("error creating users");
  }
});
