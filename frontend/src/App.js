import React, { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewConversationPage from "./components/NewConversationPage";
import ChatHistory from "./components/ChatHistory";
import AllChats from "./components/AllChats";
import HomePage from "./components/HomePage";

import "./App.scss";

function Navigation() {
  return (
    <nav>
      <div className="nav-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/chat">New Chat</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {
  const containerRef = useRef(null);

  return (
    <Router>
      <div className="navbar">
        <Navigation />
      </div>
      <div className="container">
        <ToastContainer 
          position="top-center"
        />

        <div className="sidebar">
            <AllChats />
        </div>
        <div className="chat-history" ref={containerRef}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<NewConversationPage />} />
            <Route path="/chat/:id" element={<ChatHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
