// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { SystemProvider } from './contexts/SystemContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import Organizations from './pages/Organizations';
import Documents from './pages/Documents';

function App() {
  return (
      <SystemProvider>
        <SocketProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
              <Header />

              <main className="py-6 flex-grow">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/organizations" element={<Organizations />} />
                  <Route path="/documents" element={<Documents />} />
                </Routes>
              </main>

              <footer className="bg-white shadow-inner py-4 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                  Assure Taxation Pvt Ltd &copy; {new Date().getFullYear()}
                </div>
              </footer>
            </div>
          </Router>
        </SocketProvider>
      </SystemProvider>
  );
}

export default App;