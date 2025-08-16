
import express from "express";

const userRouter = express.Router()

import fn from "../controllers/users.js"
import verifyUser from "../middlewares/verify-user.js";

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//post - login 
userRouter.post('/login',fn.handleUserLogin)

userRouter.post('/register',fn.handleUserRegister)
// .post(handleUserLogin)



//when logged in=
userRouter.route("/book-event/:eventId").post(fn.handleCreateBooking);


userRouter.route('/my-bookings/:userId')
.get(fn.handleShowAllBookings)


//user profile
userRouter.get("/user-profile",  fn.handleUserProfile);



//enter the booking id
userRouter.route('/cancel-booking/:Bookingid')
.delete(fn.handleCancelBooking)

export default userRouter
