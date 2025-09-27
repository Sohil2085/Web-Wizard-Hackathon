import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { getAllowedOrigins, logEnvironmentInfo } from "./utils/environment.js"

const app = express()

// Get allowed origins using environment utility
const allowedOrigins = getAllowedOrigins();

// Log environment info for debugging
logEnvironmentInfo();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.log('CORS blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // only if you're using cookies / sessions
  })
);

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true,limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js";
import studentRouter from "./routes/student.routes.js";


// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/students",studentRouter)



export {app}