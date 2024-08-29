// src/App.js
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import CreateEmployee from './Components/CreateEmployee.jsx';
import EmployeeList from './Components/EmployeeList.jsx';
import EditEmployee from './Components/EditEmployee.jsx';

const App = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('token');

    navigate('/login');
  };
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
      <Route path="/createemployee" element={<CreateEmployee />} />
      <Route path="/edit-employee/:id" element={<EditEmployee handleLogout={handleLogout} />} />
      <Route path="/employeelist" element={<EmployeeList />} />

    </Routes>
  );
};

export default App;
