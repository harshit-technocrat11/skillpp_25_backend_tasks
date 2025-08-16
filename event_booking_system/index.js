import express from "express"
import cookieParser from "cookie-parser";
import connectmongoDB from "./connection.js";
const app = express()

import { fileURLToPath } from "url";
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
import verifyAdmin from "./middlewares/verify_admin.js";


import verifyUser from "./middlewares/verify-user.js";

//for deleting op , from admin dash
import methodOverride from "method-override";

app.use(methodOverride("_method"));

import adminRouter from "./routes/admins.js";
import userRouter from "./routes/users.js";

import s_router from "./routes/static-router.js";


//connection
connectmongoDB("mongodb://127.0.0.1:27017/event_booking_sys")

//ejs - for frontend
app.set("view engine", "ejs");

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/users"),
  path.join(__dirname, "views/admins"),
]);


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for html form submission

app.use(cookieParser());



//routes

app.use('/admins',verifyAdmin, adminRouter)
app.use('/users', verifyUser,userRouter)

//static router
app.use('/', s_router)








const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`)
})