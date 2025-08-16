
import jwtwebtoken, { decode } from 'jsonwebtoken'
import { set } from 'mongoose';

const secret = 'harshit@1234' //store in .env file

function setUser(user){

    const payload = {
        id: user._id,
        email: user.email,
        name: user.name
    }

    return jwtwebtoken.sign(payload, secret)
}

function getUser(token) {

    try{

        const decoded = jwtwebtoken.verify(token, secret);
        console.log('decoded payload', decoded)
        return decoded;
    }

    catch(err){
        if (!token){
            return null;
        }
    }
}

export default {setUser, getUser}