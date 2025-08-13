import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        unique: true,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

},{
    timestamps: true
})

// model

const User =  mongoose.model("user",userSchema)

export default User
