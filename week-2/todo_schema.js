const mongoose = require('mongoose')

const todoschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    
})


const Todo = mongoose.model('Todo', todoschema)

module.exports= {Todo, todoschema}

let todo = new Todo({ title: "go to the gym" });
todo.save().then(() => {
  console.log("todo saved");
});


