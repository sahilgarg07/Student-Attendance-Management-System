import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../styles/formStyle.css';
import { useSignup } from "../hooks/useSignup";


const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isStudent: false,
    rollnumber: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData({ ...formData, [name]: fieldValue });
  };
  const {signup,error,isLoading} = useSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    await signup(formData.email,formData.password);
    setFormData({
      name: '',
      email: '',
      isStudent: false,
      rollnumber: '',
      password: '',
    });
  };

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <div className="form-box">
        <h1 className="head">SIGNUP</h1>
        <div className="question">
          <h2>Are you a student?</h2>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isStudent}
                onChange={handleChange}
                name="isStudent"
                color="primary"
              />
            }
            label="Yes, I am a student"
          />
        </div>
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
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {formData.isStudent && (
            <TextField
            label="Roll Number"
            name="rollnumber"
            type="number"
            value={formData.rollnumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        )}
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
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
};

export default FormComponent;
