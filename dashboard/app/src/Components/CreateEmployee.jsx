import { useState } from 'react';
import axios from 'axios';
import './CreateEmployee.css';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
    const navigate=useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        mobile: "",
        gender: "",
        designation: "",
        course: [],
        image: null
    });
        //function checks if it's checked or not
    const onChangeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setData(prevData => ({
                ...prevData,
                course: checked ? [...prevData.course, value] : prevData.course.filter(c => c !== value) // checked: The value is added to the course array 
                //unchecked: The value is removed from the course array
            }));
        } else if (type === 'file') {
            setData({ ...data, image: e.target.files[0] });
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
            const res = await axios.post('http://localhost:3000/api/employees/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Employee created successfully!');
            navigate("/")
            setData({
                name: "",
                email: "",
                mobile: "",
                gender: "",
                designation: "",
                course: [],
                image: null
            });
        } catch (err) {
            console.error(err);
            alert('Failed to create employee');
        }
    };

    return (
        <div className='create-employee-form'>
            <h2>Create Employee</h2>
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
                    <input type="radio" name="gender" value="Male" onChange={onChangeHandler} required /> Male
                    <input type="radio" name="gender" value="Female" onChange={onChangeHandler} required /> Female
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
                    <input type="checkbox" name="course" value="MCA" onChange={onChangeHandler} /> MCA
                    <input type="checkbox" name="course" value="BCA" onChange={onChangeHandler} /> BCA
                    <input type="checkbox" name="course" value="BSC" onChange={onChangeHandler} /> BSC
                </div>
                <div>
                    <label>Image Upload</label>
                    <input type="file" name="image" onChange={onChangeHandler} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateEmployee;
