// client/src/App.js - Update the main layout structure

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import Organizations from './pages/Organizations';
import Documents from './pages/Documents';

function App() {
  return (
      <SocketProvider>
        <Router>
          {/* Change this div to use flex layout with min-height of screen */}
          <div className="flex flex-col min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                      Numerize AP Automation
                    </Link>
                  </div>
                  <div className="flex space-x-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                        }
                        end
                    >
                      Dashboard
                    </NavLink>

                    <div className="relative group">
                      <NavLink
                          to="/chats"
                          className={({ isActive }) =>
                              isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                          }
                      >
                        Chats
                      </NavLink>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                        <div className="py-1">
                          <Link
                              to="/chats"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            All Chats & Groups
                          </Link>
                          <Link
                              to="/chats?type=chats"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Individual Chats Only
                          </Link>
                          <Link
                              to="/chats?type=groups"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Groups Only
                          </Link>
                        </div>
                      </div>
                    </div>

                    <NavLink
                        to="/organizations"
                        className={({ isActive }) =>
                            isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                        }
                    >
                      Organizations
                    </NavLink>

                    <NavLink
                        to="/documents"
                        className={({ isActive }) =>
                            isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                        }
                    >
                      Documents
                    </NavLink>
                  </div>
                </div>
              </div>
            </nav>

            {/* Add flex-grow to make this element take all available space */}
            <main className="py-6 flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/documents" element={<Documents />} />
              </Routes>
            </main>

            {/* Remove mt-8 and add mt-auto to push to bottom */}
            <footer className="bg-white shadow-inner py-4 mt-auto">
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