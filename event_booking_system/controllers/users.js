import Booking from "../models/bookings.js";
import User from "../models/user.js";
import Event from "../models/events.js";

import auth from "../services/auth.js";

const setUser = auth.setUser;
const getUser = auth.getUser;

// register
async function handleUserRegister(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (confirmPassword!== password){
      res.render('users-register',{error: "both passwords do not match, try again"})
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: "user",

    });

    console.log("user created :", user);

    // res.status(201).json({ message: "user registration successful" });

    res.render("users-register", { msg: "user registration successful, now log into your account" });
    
    

  } catch (err) {
    // res.status(500).json({ msg: err.message });
    res.render("users-register", {error: 'enter unique data'});
  }
}




// login
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  //if user exists or not- usse decide karo
  const user = await User.findOne({ email, password });

  console.log("inside handleUserLogin", user);
  console.log("this is the user object id: ", user.id);

  if (!user) {
    return res.render("users-login", {
      error: "invalid username or password",
    });
  }

  //signing in user

  const jwt_token = setUser(user); //jwt token generated

  res.cookie("jwtToken", jwt_token); //cookie name- jwttoken

  res.redirect("/users/user-profile");
}




//user profile
async function handleUserProfile(req, res) {
  try {
    console.log("req.user in handler", req.user);
    console.log("req.user.name", req.user.name);
    

    //   const my_bookings = await Booking.find({ userId: userId });

    const my_bookings = await Booking.find({ createdBy: req.user._id })
      .populate("eventId", "name  date location capacity bookedSeats")
      .populate("userId", "name  email");


      //polished data 
      console.log('my_bookings',my_bookings)
    const allbookings = my_bookings.map((b) => ({
      bookingId: b._id,
      username: b.userId.name,
      userId: b.userId._id,
      eventName: b.eventId.name ,
      eventId: b.eventId._id,
      Venue:b.eventId.location,
      capacity:  b.eventId.capacity ,
      Event_date:b.eventId.date ,
      bookingDate: b.bookingDate,
    }));

    allbookings.forEach((b) =>
      console.log("userid:", b.userId._id, "eventId:", b.eventId._id)
    );

    const userId = allbookings[0].userId._id

    const IDs_of_events_booked_byuser = my_bookings.map((b) => b.eventId._id)

    console.log("IDs_of_events_booked_byuser", IDs_of_events_booked_byuser);

   
      const availableEvents = await Event.find({
        _id: {$nin: IDs_of_events_booked_byuser},

        $expr: {$lt: ["$bookedSeats", "$capacity"]}

      }).select("name date location  capacity bookedSeats");

      availableEvents.forEach((b)=> console.log( "eventId:", b._id))

      console.log('available events: ', availableEvents)
      return res.render("users-profile.ejs", {
        myBookings: allbookings,
        availableEvents: availableEvents,
        name: req.user.name,
        email: req.user.email,
        userId: userId,
      });

   

  } catch (err) {
    console.error(err);

    res.render("users-profile.ejs", {
      msg: "internal server error",
      bookings: [],
    });
  }
}



//book-event

async function handleCreateBooking(req, res) {
  try {
    // book-event/:eventId
    const eventId = req.params.eventId
    

    const userId = req.user.id; // JWT token

    console.log("User:", req.user);
    console.log("Event ID from params:", eventId);

    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ msg: "Event ID and user must be provided" });
    }

    const new_booking = await Booking.create({
      userId,
      eventId,
    });

    console.log("New booking created: ", new_booking);

    return res.status(201).json({ msg: "Created successfully", new_booking });
  } catch (error) {
    console.error("MongoDB Error (Create Booking):", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

//cancel booking
async function handleCancelBooking(req, res) {
  try {
    
    const bookingId = req.params.Bookingid;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    const eventId = booking.eventId;

    // decrementing the seats , before deletions
    await Event.updateOne({ _id: eventId }, { $inc: { bookedSeats: -1 } });

    //now delete
    await Booking.findByIdAndDelete(bookingId);

    console.log("Booking cancelled successfully");
    return res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal server error" });
  }
}

//my-bookings
async function handleShowAllBookings(req, res) {
  try {
    const userId = req.params.userId;

    //   const my_bookings = await Booking.find({ userId: userId });
    const my_bookings = await Booking.find({ userId: userId })
      .populate("eventId", "name")
      .populate("userId", "name  email");

    const allbookings = my_bookings.map((b) => ({
      bookingId: b._id,
      username: b.userId.name,
      eventName: b.eventId.name,
      bookingDate: b.bookingDate,
    }));

    //   const booked_event = await Event.find({_id: my_bookings.eventId})

    return res.status(200).json({ my_bookings: allbookings });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal server error" });
  }
}


export default {
  handleUserProfile,
  handleUserLogin,
  handleUserRegister,
  handleCancelBooking,
  handleCreateBooking,
  handleShowAllBookings,
};
