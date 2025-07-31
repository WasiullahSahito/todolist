import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/todos');
            setTodos(res.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const addTodo = async () => {
        if (newTodo.trim()) {
            try {
                const res = await axios.post('http://localhost:5000/todos', {
                    text: newTodo,
                    completed: false
                });
                setTodos([...todos, res.data]);
                setNewTodo('');
            } catch (error) {
                console.error("Error adding todo:", error);
            }
        }
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/todos/${id}`);
        setTodos(todos.filter(todo => todo._id !== id));
    };
    const toggleTodo = async (id) => {
        const todo = todos.find(todo => todo._id === id);
        const updatedTodo = { ...todo, completed: !todo.completed };
        await axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
        setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
    };
    const editTodo = async (id) => {
        const todo = todos.find(todo => todo._id === id);
        const updatedText = prompt("Edit your task:", todo.text);
        if (updatedText && updatedText.trim()) {
            const updatedTodo = {
                ...todo,
                text: updatedText.trim(),
                completed: todo.completed // Preserve completed status
            };
            await axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
            setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 My To-Do List</h1>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button onClick={addTodo} className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition">
                            Add
                        </button>
                    </div>

                    <ul className="space-y-3">
                        {todos.map(todo => (
                            <li key={todo._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-xl shadow-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo._id)}
                                        className="accent-purple-600"
                                    />
                                    <span className={`text-gray-800 ${todo.completed ? 'line-through' : ''}`}>
                                        {todo.text}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-blue-500 hover:text-blue-700 text-lg" title="Edit" 
                                        onClick={() => editTodo(todo._id)}
                                    >Edit</button>
                                    <button
                                        onClick={() => deleteTodo(todo._id)}
                                        className="text-red-500 hover:text-red-700 text-lg"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}


                     

                       
                    </ul>
                </div>
            </div>
        </>
    );
}

export default TodoList;
