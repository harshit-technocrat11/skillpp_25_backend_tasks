
import auth from "../services/auth.js"

const getUser = auth.getUser
// import jwt from "jsonwebtoken";

function verifyAdmin(req,res, next){

    const { email, name, jwtToken } = req.cookies;


    if (getUser(jwtToken) === null){
        return res.redirect('/admins/login')
    }

    try{
        const decoded = getUser(jwtToken);

        req.admin = decoded;
        console.log('admin email', decoded.email)
        console.log('admin name', decoded.name)

        //admin contains the email , name , cookies 
        next()
    }

    catch(err){
        console.error("jwt verification failed", err.message)

        // /admins/login

        res.redirect("/login")
    }
    

}

export default verifyAdmin;