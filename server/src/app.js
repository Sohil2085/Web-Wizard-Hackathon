import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",  // ✅ change
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true,limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js";
import studentRouter from "./routes/student.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/students",studentRouter)



export {app}