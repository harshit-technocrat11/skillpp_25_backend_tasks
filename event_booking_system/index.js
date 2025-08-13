import express from "express"
import cookieParser from "cookie-parser";
import connectmongoDB from "./connection.js";
const app = express()


import adminRouter from "./routes/admins.js";
import userRouter from "./routes/users.js";

//connection
connectmongoDB("mongodb://127.0.0.1:27017/event_booking_sys")

//ejs - for frontend
app.set("view engine", "ejs");
app.set("views", "./views");


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for html form submission

app.use(cookieParser());



//routes

app.use('/admins', adminRouter)
app.use('/users', userRouter)








const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`)
})