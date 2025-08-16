
import auth from "../services/auth.js"

const getUser = auth.getUser
// import jwt from "jsonwebtoken";

function verifyUser(req, res, next) {
  const { email, name, jwtToken } = req.cookies;

  if (getUser(jwtToken) === null) {
    return res.redirect("/users/login");
  }

  try {
    const decoded = getUser(jwtToken);

    
    req.user = decoded;
    console.log("User email", decoded.email);
    console.log("User name", decoded.name);
    console.log("user _id:", decoded.id)

    //user contains the email , name , cookies

    next();

  } catch (err) {
    console.error("jwt verification failed", err.message);

    // /users/login

    res.redirect("/users/login");
  }
}

export default verifyUser;