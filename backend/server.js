const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));


// Todo Schema
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    createdAt: { type: Date, default: Date.now }

  });
  const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos',async (req,res) => {
    const todos = await Todo.find();
    res.json(todos);
});
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        completed: false,
      });
    await newTodo.save();
    res.json(newTodo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        {
            text: req.body.text,
            completed: req.body.completed
        },
        { new: true }
    );
    res.json(updatedTodo);
});