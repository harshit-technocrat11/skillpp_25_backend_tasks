import express from "express"

import Event from "../models/events.js"
const s_router = express.Router()

s_router.get('/', (req, res)=>{
    return res.render('landingpage.ejs')
})

s_router.get("/admins/login", (req,res)=>{
    return res.render('admin-login')
});


s_router.get("/users/login", (req,res)=>{
    return res.render('users-login')
});

s_router.get("/users/register", (req,res)=>{
    return res.render('users-register')
});





s_router.get('/admins/events/:id', async (req,res)=>{

    const eventId = req.params.id;

    
    const event = await Event.findById({_id: eventId})
    console.log('selected event: ', event)

    return res.render('event-update', {event: event})
})

// s_router.get('admins/events/' , (req,res)=>{
//     return res.render('admin-dashboard')
// })

s_router.get('/admins/create-event', (req,res)=>{

    return res.render('admin-create-event')
})



s_router.get('/users/login', (req,res)=>{
    return res.render('users-login')
})


s_router.post('/users/book-event/:eventId', (req,res) =>{
    return res.render('user-profile')
})
export default s_router;