import { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [currentState, setCurrentState] = useState("Signup");
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const { name, email, password } = data;
            const endpoint = currentState === "Signin"
                ? 'http://localhost:3000/api/auth/signin'
                : 'http://localhost:3000/api/auth/signup';

            console.log(`Sending request to ${endpoint} with data:`, { name, email, password });

            const res = await axios.post(endpoint, { name, email, password }, { withCredentials: true });
            console.log('Response:', res.data);

            localStorage.setItem('token', res.data.token);
            alert(`${currentState} successful!`);
            navigate("/")
            setData({ name: "", email: "", password: "" });

        } catch (err) {
            console.error('Error:', err);
            alert(`${currentState} failed! ${err.response?.data?.message || err.message}`);
        }
    };

    // Function to check if the token is valid
    const isTokenValid = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        return true;
    };

    // Call this function on component mount to check token validity
    useEffect(() => {
        if (!isTokenValid()) {
            // alert('LogedOut');
            setCurrentState("Signin");
        }
    }, []);
    return (
        <div className='signin-overlay'>
            <form onSubmit={handleLogin} className='signin-form'>
                <div className="signin-header">
                    <h2>{currentState}</h2>

                </div>
                <div className="sign">
                    {currentState === "Signup" && (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Your Name'
                            required
                            className='signin-input'
                            aria-label="Name"
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Your Email'
                        required
                        className='signin-input'
                        aria-label="Email"
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Password'
                        required
                        className='signin-input'
                        aria-label="Password"
                    />
                </div>
                <button className='signin-button' type='submit'>
                    {currentState === "Signup" ? "Create Account" : "Login"}
                </button>
                <div className="terms-container">
                    <input id="terms" type="checkbox" required className='terms-checkbox' />
                    <label htmlFor="terms" className='terms-label'>
                        By continuing, I agree to the terms of use & privacy policy
                    </label>
                </div>
                {currentState === "Signin" ? (
                    <p className='signin-toggle'>
                        Create a new account? <span onClick={() => setCurrentState("Signup")}>Click here</span>
                    </p>
                ) : (
                    <p className='signin-toggle'>
                        Already have an account? <span onClick={() => setCurrentState("Signin")}>Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default Login;
