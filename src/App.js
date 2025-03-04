import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import Organizations from './pages/Organizations';
import Documents from './pages/Documents';

function App() {
  return (
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                      Numerize
                    </Link>
                  </div>
                  <div className="flex space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link to="/chats" className="text-gray-600 hover:text-blue-600">
                      Chats
                    </Link>
                    <Link to="/organizations" className="text-gray-600 hover:text-blue-600">
                      Organizations
                    </Link>
                    <Link to="/documents" className="text-gray-600 hover:text-blue-600">
                      Documents
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <main className="py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/documents" element={<Documents />} />
              </Routes>
            </main>

            <footer className="bg-white shadow-inner py-4 mt-8">
              <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                Assure Taxation Pvt Ltd &copy; {new Date().getFullYear()}
              </div>
            </footer>
          </div>
        </Router>
      </SocketProvider>
  );
}

export default App;