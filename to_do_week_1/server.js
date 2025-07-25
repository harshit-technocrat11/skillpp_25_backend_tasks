import express from "express"

const app = express()
app.use(express.json())

let todos = []


app.get('/todos', (req, res) => {

  res.status(200).json(todos)

})

app.post("/todos", (req, res) => {
  const todo = req.body.text;

  if (!todo || todo.trim() === "") {
    return res.status(400).json({ error: "text required" });
  }

  const new_todo = {
    id: Date.now(),
    text: todo,
  }

  todos.push(new_todo);
  res.status(201).json(new_todo)

})


app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === todoId);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" })

  }

  todos.splice(index, 1);
  res.status(204).send();

})


app.listen(3000, () => {

  console.log("Todo server running at port:3000")

})
