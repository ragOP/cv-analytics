import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const TodoApp = () => {
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);
  console.log("todos", todos)

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/todo`); // Adjust the URL as necessary
      console.log("response", response.data.data)
      setTodos(response.data.data);  // Set the todos state with the fetched data
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Function to handle adding a new todo
  const handleAddTodo = async () => {
    if (todoText.trim()) {
      try {
        // Prepare the data to send
        const todoData = {
          todos: [{ text: todoText }]  // Wrap the new todo in an array inside the 'todos' field
        };

        // Post the new todo to the backend
        await axios.post(`${BACKEND_URL}/api/todo`, todoData);

        // Clear the input field
        setTodoText('');

        // Fetch the updated list of todos
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };


  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      {/* Scrollable to-do list container */}
      <div
        style={{
          overflowY: 'auto', // Make it scrollable when there are too many items
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minHeight: "75vh",
          maxHeight: '75vh', // Limit the height so the list scrolls internally
        }}
        ref={(el) => {
          if (el) {
            el.scrollTop = el.scrollHeight; // Scroll to the bottom when a new todo is added
          }
        }}
      >
        {todos.map((todo, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2c2c2c',
              padding: '10px',
              borderRadius: '15px',
              maxWidth: '80%',
              alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
              margin: '5px',
            }}
          >
            {todo.text}
          </div>
        ))}
      </div>

      {/* Input and Add button inside the container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Type a new todo..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            width: '90%',
            border: 'none',
            outline: 'none',
            backgroundColor: '#2c2c2c',
            color: 'white',
          }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            backgroundColor: '#4caf50',
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
