import mongoose, { mongo } from "mongoose";


const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 }
}, { timestamps: true})


const Event = mongoose.model('event', eventSchema)

export default Event