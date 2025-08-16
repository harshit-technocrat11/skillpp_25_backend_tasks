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

  //allows only admin- to login, role= admin
  if (!user || user.role === "user") {
    return res.render("admin-login", {
      error: "invalid username or password",
    });
  }

  const jwt_token = setUser(user); //jwt token generated- 

  res.cookie("jwtToken", jwt_token); //jwtToken- is just a cookie name

  const events = await Event.find({});

  //homepage - redireced
  // return res.render('admin-dashboard',{events: events, email: user.email, name: user.name})

  res.redirect("/admins/dashboard");
}

//handleadmin dashboard

async function handleAdminDashboard(req,res){
  try
  {

    console.log("req.admin in handler",req.admin)
    console.log("req.admin.name", req.admin.name);
     const events = await Event.find({});

     res.render("admin-dashboard.ejs", {
       events: events,
       email: req.admin.email,
       name: req.admin.name,
     });

  }
  catch(err){
    console.error(err);

    res.render('admin-dashboard', {
      msg: "internal server error",
      events: []
    })
  }
}


// Create event -post
async function handleCreateEvents(req, res) {
  try {
    const event = req.body;
    console.log(event)

    if (
      !event ||
      !event.name ||
      !event.location ||
      !event.capacity ||
      event.bookedSeats === undefined
    ) {
      // return res.status(400).json({ msg: "All fields are required" });

      return res.render("admin-create-event", { msg: "All fields are required" });
    }

    const new_event = await Event.create({
      name: event.name,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      bookedSeats: event.bookedSeats,
    });

    console.log("New event created: ", new_event);

    // return res.status(201).json({ msg: "Created successfully", new_event });

    res.render("admin-create-event", {
      msg: "Created successfully",
      new_event,
    });

    
  } catch (error) {
    console.error("MongoDB Error (Create Event):", error.message);
    // return res
    //   .status(500)
    //   .json({ msg: "Internal server error", error: error.message });

    res.render("admin-create-event", {
      msg: "Internal server error",
      error: error.message,
    });
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

    // return res.status(200).json({ msg: "Successfully updated", event });

    console.log('updated event:', event)

    return res.render('event-update', {status: "event updated successfully", UpdatedEvent: event })
    // return res.redirect('admin-dashboard')
    

  } catch (error) {
    console.error("MongoDB Error (Update Event):", error.message);
    // return res
    //   .status(500)
    //   .json({ msg: "Internal server error", error: error.message });
    return res.render('event-update', {error: "There was an issue with our server, status: 500"})
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

    // return res
    //   .status(200)
    //   .json({ msg: "Event and related bookings deleted successfully" });

    const events = await Event.find({})
    res.render("admin-dashboard", {
      msg: "Event and related bookings deleted successfully",
      events: events
    }, );

  } catch (error) {
    console.error("MongoDB Error (Delete Event):", error.message);

    // return res
    //   .status(500)
    //   .json({ msg: "Internal server error", error: error.message });

    res.render("admin-dashboard", {
      msg: "Internal server error",
      error: error.message,
    });
  }
}


export default {
  handleDeleteEvent,
  handleUpdateEvent,
  handleViewAllEvents,
  handleCreateEvents,
  handleAdminLogin,
  handleAdminDashboard,
};
