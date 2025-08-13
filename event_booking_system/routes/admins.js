import express from "express"

const adminRouter = express.Router()

import f from "../controllers/admins.js"


// /admin/login
adminRouter.post('/login', f.handleAdminLogin)

adminRouter.route('/events')
.get(f.handleViewAllEvents) //view all events
.post(f.handleCreateEvents) // create new event



adminRouter.route('/events/:id')
.patch(f.handleUpdateEvent) //update
.delete(f.handleDeleteEvent) //del

//view all users
// adminRouter.get('/users')

export default adminRouter 