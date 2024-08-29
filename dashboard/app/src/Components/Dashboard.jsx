import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));



  return (
    <div>
      <div className='main'>
        {!isLoggedIn && <button onClick={() => navigate("/login")}>User Login</button>}
        {isLoggedIn && (
          <>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate("/createemployee")}>Create Employee</button>
            <button onClick={() => navigate("/employeelist")}>Employee List</button>
          </>
        )}
      </div>
      <h1 className='admin'>Welcome Admin Panel</h1>
    </div>
  );
};

export default Dashboard;
