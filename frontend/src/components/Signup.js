import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styles/formStyle.css';
import { useSignup } from "../hooks/useSignup";
import axios from 'axios';
import axiosInstance from '../axios';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    role:'False',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    // Check if passwords match
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }
    await signup(formData);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      role:'False'
    });
  };

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <div className="form-box">
        <h1 className="form-head">SIGNUP</h1>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
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
        <TextField
          label="Confirm Password"
          name="password2"
          type="password"
          value={formData.password2}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          SIGNUP
        </Button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
};

export default FormComponent;
