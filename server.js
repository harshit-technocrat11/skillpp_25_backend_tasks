const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { Todo, todo_schema } = require("./todo_schema");

// app.use(express.urlencoded({extended:true}))
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("mongo error:", err));

// let todo = new Todo({ title: "go to the gym" });
// todo.save().then(() => {
//   console.log("todo saved");
// });

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    console.error("error displaying todos", err);
    res.status(500).json({ msg: "error in displaying todos" });
  }
});

app.post("/todos", async (req, res) => {
    console.log(req.body)
    let todonew = new Todo(req.body);
    console.log(todonew)
  
  try {
    const todosaved = await todonew.save();
    console.log("todo saved");
    res.status(201).json({ msg: " todo created", todosaved });
  } catch (error) {
    console.error("error in creating:", error);
    res.status(400).json({ msg: "error in creating new todo" });
  }
  
});

app.listen(3000, () => console.log("server running on port 3000"));
