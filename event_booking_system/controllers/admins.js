import Booking from "../models/bookings.js";
import User from "../models/user.js";
import Event from "../models/events.js";

import auth from '../services/auth.js'

const setUser = auth.setUser;
const getUser = auth.getUser;

//admin login
//login
async function handleAdminLogin(req,res) {

  const { email, password } = req.body;

  //if user exists or not- usse decide karo
  const user = await User.findOne({ email, password });

//   console.log('inside handleUserLogin',user);
//   console.log('this is the user object id: ',user.id)

  if (!user) {
    return res.render("login", {
      error: "invalid username or password",
    });
  }

  

  const jwt_token = setUser(user) //jwt token generated
  
  res.cookie("uid", jwt_token);  //uid- is just a cookie name

  const events = await Event.find({})

  //homepage - redireced
  return res.render('admin_page',{events: events, email: user.email})
}



// Create event -post
async function handleCreateEvents(req, res) {
  try {
    const event = req.body;

    if (
      !event ||
      !event.name ||
      !event.location ||
      !event.capacity ||
      event.bookedSeats === undefined
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const new_event = await Event.create({
      name: event.name,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      bookedSeats: event.bookedSeats,
    });

    console.log("New event created: ", new_event);

    return res.status(201).json({ msg: "Created successfully", new_event });

  } catch (error) {
    console.error("MongoDB Error (Create Event):", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

// View all events - get
async function handleViewAllEvents(req, res) {
  try {
    const events = await Event.find({});
    return res.status(200).json({ data: events });
  } catch (error) {
    console.error("MongoDB Error (View All Events):", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

// Update event - post
async function handleUpdateEvent(req, res) {
  try {
    const id = req.params.id;

    // req.body.date = moment(req.body.date, "DD/MM/YY").toDate();
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ msg: "Successfully updated", event });
  } catch (error) {
    console.error("MongoDB Error (Update Event):", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

// Delete event - also its related bookings
async function handleDeleteEvent(req, res) {
  try {
    const id = req.params.id;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all related bookings
    await Booking.deleteMany({ eventId: id });

    return res
      .status(200)
      .json({ msg: "Event and related bookings deleted successfully" });
  } catch (error) {
    console.error("MongoDB Error (Delete Event):", error.message);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

export default {
  handleDeleteEvent,
  handleUpdateEvent,
  handleViewAllEvents,
  handleCreateEvents,
  handleAdminLogin,
};
