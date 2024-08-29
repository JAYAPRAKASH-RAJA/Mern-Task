import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/employees', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEmployees(response.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };

        fetchEmployees();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order: 'asc' to 'desc' or default to 'asc'
        setSortField(field);
        setSortOrder(order);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEdit = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/employees/${id}`);
            setEmployees(employees.filter(employee => employee._id !== id));
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            const employee = employees.find(emp => emp._id === id);
            const updatedEmployee = { ...employee, active: !employee.active };
            await axios.put(`http://localhost:3000/api/employees/${id}`, updatedEmployee);
            setEmployees(employees.map(emp => emp._id === id ? updatedEmployee : emp));
        } catch (err) {
            console.error('Error toggling active status:', err);
        }
    };

    const filteredEmployees = employees
        .filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });

    const indexOfLastEmployee = currentPage * employeesPerPage; //number of employees displayed per page
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage; //first employee on the current page by subtracting the number of employees per page from the index of the last employee.
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);//Get the employees for the current page:

    return (
        <div className="employee-list">
            <h2 onClick={()=>navigate('/')} style={{cursor:'pointer'}}>Employee List</h2>
            <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearch}
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('uniqueid')}>Unique ID</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th>Mobile No.</th>
                        <th>Gender</th>
                        <th>Designation</th>
                        <th>Course</th>
                        <th>Image</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map(employee => {
                        // Parse the createdate field to a valid Date object
                        const formattedDate = employee.createdate ? new Date(employee.createdate) : null;

                        return (
                            <tr key={employee._id}>
                                <td>{employee.uniqueid}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.mobile}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.designation}</td>
                                <td>{Array.isArray(employee.course) ? employee.course.join(", ") : employee.course}</td>
                                <td><img src={`http://localhost:3000/${employee.image}`} alt={employee.name} width="50" /></td>
                                <td>
                                    {formattedDate && !isNaN(formattedDate)
                                        ? formattedDate.toLocaleDateString()
                                        : "Invalid Date"}
                                </td>
                                <td>
                                    <div className='butt'>
                                        <button onClick={() => navigate(`/edit-employee/${employee._id}`)}>Edit</button>
                                        <button onClick={() => handleDelete(employee._id)}>Delete</button>
                                        <button onClick={() => handleToggleActive(employee._id)}>
                                            {employee.active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
