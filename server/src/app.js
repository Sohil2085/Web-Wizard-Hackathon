import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",  // allow your React frontend
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