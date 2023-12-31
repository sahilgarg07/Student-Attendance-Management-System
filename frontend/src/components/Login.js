import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styles/formStyle.css';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../axios';
import { useDispatch } from 'react-redux';
import { userLogin} from '../Store/Slices/userSlice';
import { personLogin} from '../Store/Slices/personSlice';
import {useLogin} from "../hooks/useLogin";



const Login = () => {
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const {error,login,isLoading}=useLogin();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    await login(formData);
    setFormData({
      username: '',
      password: '',
    });
  };

  const buttonStyle = {
    // Add your button style if needed
  };

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <div className="form-box">
        <h1 className="form-head">SIGN IN</h1>

        <TextField
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <NavLink style={{ width: '100%', textDecoration: 'none' }} to="/">
          <div className="forget">Forget password ?</div>
        </NavLink>

        <Button style={buttonStyle} type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>

        {/* Add any error handling if needed */}
        {/* {error && <div className="error">{error}</div>} */}

        <div className="forget">
          Don't have an account ?<NavLink style={{ width: '100%', textDecoration: 'none' }} to="/signup"> Create Account</NavLink>
        </div>
        {error && <div> error here</div> }
      </div>
    </form>
  );
};

export default Login;
