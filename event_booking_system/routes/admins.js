import express from "express"

const adminRouter = express.Router()

import f from "../controllers/admins.js"

import verifyAdmin from "../middlewares/verify_admin.js"

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// /admin/login
adminRouter.post('/login', f.handleAdminLogin)

adminRouter.route('/events')
.get(f.handleViewAllEvents) //view all events

adminRouter.post('/create-event', f.handleCreateEvents) // create new event


// /admins/events/ id
adminRouter.route('/events/:id')
.post(f.handleUpdateEvent) //update

adminRouter.route('/events/:id')
.delete(f.handleDeleteEvent) //del

//admin dashboard
adminRouter
.get("/dashboard", verifyAdmin,
     f.handleAdminDashboard);


//view all users
// adminRouter.get('/users')



export default adminRouter 