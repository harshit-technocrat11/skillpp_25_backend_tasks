
import jwtwebtoken from 'jsonwebtoken'
import { set } from 'mongoose';

const secret = 'harshit@1234' //store in .env file

function setUser(user){

    const payload = {
        id: user._id,
        email: user.email
    }

    return jwtwebtoken.sign(payload, secret)
}

function getUser(token) {

    try{

        return jwtwebtoken.verify(TokenExpiredError,secret);
    }

    catch(err){
        if (!token){
            return null;
        }
    }
}

export default {setUser, getUser}