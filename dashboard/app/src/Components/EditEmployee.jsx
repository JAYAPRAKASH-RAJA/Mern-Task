import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditEmployee.css';

const EditEmployee = ({ handleLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        mobile: "",
        gender: "",
        designation: "",
        course: [],
        image: null
    });


    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`https://mern-task-backend-f86t.onrender.com/api/employees/${id}`);
                const fetchedData = response.data;
                setData({
                    ...fetchedData,
                    course: []
                });
            } catch (err) {
                console.error('Error fetching employee:', err);
            }
        };

        fetchEmployee();
    }, [id]);

    const onChangeHandler = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            let updatedCourses = [];
            if (checked) {
                updatedCourses = [...data.course, value];
            } else {
                updatedCourses = data.course.filter(course => course !== value);
            }
            setData(prevData => ({
                ...prevData,
                course: updatedCourses
            }));
        } else if (type === 'file') {
            setData({ ...data, image: files[0] });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        for (const key in data) {
            if (key === 'course') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        }

        try {
            await axios.put(`https://mern-task-backend-f86t.onrender.com/api/employees/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Employee updated successfully!');
            navigate('/employeelist');
        } catch (err) {
            console.error('Error updating employee:', err);
            alert('Failed to update employee');
        }
    };

    useEffect(() => {
        const handleTabManagement = () => {
            const currentUrl = window.location.href;
            const lastOpenedUrls = JSON.parse(localStorage.getItem('openedEditUrls') || '[]');

            // Check if the URL was opened before
            if (lastOpenedUrls.includes(currentUrl)) {
                // If it's opened in a different tab (not the same session), log out
                if (!sessionStorage.getItem(`edit-${id}-opened`)) {
                    handleLogout();
                    alert('You have been logged out because this URL was opened in another tab.');
                    alert('LogedOut')
                    navigate('/login');
                }
            } else {
                // Add the current URL to the list
                lastOpenedUrls.push(currentUrl);
                localStorage.setItem('openedEditUrls', JSON.stringify(lastOpenedUrls));
            }

            // Mark this session as having opened this URL
            sessionStorage.setItem(`edit-${id}-opened`, true);

            // Remove URL from list on tab close
            const handleBeforeUnload = () => {
                const updatedUrls = JSON.parse(localStorage.getItem('openedEditUrls') || '[]');
                const index = updatedUrls.indexOf(currentUrl);
                if (index > -1) {
                    updatedUrls.splice(index, 1);
                    localStorage.setItem('openedEditUrls', JSON.stringify(updatedUrls));
                }
                sessionStorage.removeItem(`edit-${id}-opened`);
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        };

        handleTabManagement();

    }, [id, handleLogout, navigate]);

    return (
        <div className='edit-employee-form'>
            <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Edit Employee</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={data.name} onChange={onChangeHandler} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={data.email} onChange={onChangeHandler} required />
                </div>
                <div>
                    <label>Mobile No</label>
                    <input type="text" name="mobile" value={data.mobile} onChange={onChangeHandler} required />
                </div>
                <div>
                    <label>Gender</label>
                    <input type="radio" name="gender" value="Male" checked={data.gender === 'Male'} onChange={onChangeHandler} required /> Male
                    <input type="radio" name="gender" value="Female" checked={data.gender === 'Female'} onChange={onChangeHandler} required /> Female
                </div>
                <div>
                    <label>Designation</label>
                    <select name="designation" value={data.designation} onChange={onChangeHandler} required>
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div>
                    <label>Course</label>
                    <input type="checkbox" name="course" value="MCA" checked={data.course.includes('MCA')} onChange={onChangeHandler} /> MCA
                    <input type="checkbox" name="course" value="BCA" checked={data.course.includes('BCA')} onChange={onChangeHandler} /> BCA
                    <input type="checkbox" name="course" value="BSC" checked={data.course.includes('BSC')} onChange={onChangeHandler} /> BSC
                </div>
                <div>
                    <label>Image Upload</label>
                    <input type="file" name="image" onChange={onChangeHandler} />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditEmployee;
