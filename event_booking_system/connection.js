import mongoose from "mongoose";

async  function connectmongoDB(url) {
    
    try{
        await  mongoose.connect(url)
        console.log('Mongodb connected!')


    }
    catch(err) {
        console.error('Mongodb connection failed', err)

    }

}

export default connectmongoDB