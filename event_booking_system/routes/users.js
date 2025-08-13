
import express from "express";

const userRouter = express.Router()

import fn from "../controllers/users.js"

//post - login and register

userRouter.route('/register')
.post(
    fn.handleUserRegister)

userRouter.route('/login')
// .post(handleUserLogin)



//when logged in
userRouter.route('/book-event')
.post(fn.handleCreateBooking)


userRouter.route('/my-bookings/:userId')
.get(fn.handleShowAllBookings)


//enter the booking id
userRouter.route('/cancel-booking/:Bookingid')
.delete(fn.handleCancelBooking)

export default userRouter
