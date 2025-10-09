// src/App.jsx
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-210">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<BookForm />} />
            <Route path="/edit-book/:id" element={<BookForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;