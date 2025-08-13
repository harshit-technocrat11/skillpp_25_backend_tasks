import Booking from "../models/bookings.js";
import User from "../models/user.js";
import Event from "../models/events.js";

import auth from "../services/auth.js";

const setUser = auth.setUser;
const getUser = auth.getUser;

// register
async function handleUserRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: "user",
    });

    console.log("user created :", user);
    res.status(201).json({ message: "user registration successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
    // return res.render("login", {
    //   error: "invalid username or password",
    // });

    return res.json({ msg: "invalid username or password" });
  }

  //signing in user

  const jwt_token = setUser(user); //jwt token generated

  res.cookie("uid", jwt_token); //uid- is just a cookie name

  //events - only booked by the user
  const events = await Booking.find({ user: user._id });

  //homepage - redireced
  //   return res.render("home", { events: events, email: user.email });

  return res.json({ my_bookings: events });
}

//book-event

async function handleCreateBooking(req, res) {
  try {
    const booking = req.body;

    if (!booking || !booking.userId || !booking.eventId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const new_booking = await Booking.create({
      userId: booking.userId,
      eventId: booking.eventId,
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

// profile

export default {
  handleUserRegister,
  handleCancelBooking,
  handleCreateBooking,
  handleShowAllBookings,
};
