import { useCreateCourse } from "../hooks/useCreateCourse";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styles/formStyle.css';
import { useSelector } from "react-redux";

const CreateCourse = () => {
    const persondetails = useSelector((state) => {
        return state.persons.person;
      })
    const [formData, setFormData] = useState({
        coursename: '',
        // teacher: persondetails._id,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        const fieldValue = value;

        setFormData({ ...formData, [name]: fieldValue });
    };
    // const { login, error, isLoading } = useTeacherAddCourse();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        console.log(persondetails);
        // await login(formData.email, formData.password);
        setFormData({
            coursename: '',
            // teacher: persondetails._id,
        });
    };


    const textFieldStyle={
        backgroundColor: '#ECF2FF'
    }
    const buttonStyle = {
        backgroundColor: '#654E92'
    };
    return (
        <div className="taddcourse">
            <form className="addcourse-form" onSubmit={handleSubmit}>
                <TextField
                    label="Course Name"
                    name="coursename"
                    type="coursename"
                    value={formData.coursename}
                    onChange={handleChange}
                    margin="normal"
                    style={textFieldStyle}
                    fullWidth
                    required
                />
                <Button style={buttonStyle} fullWidth type="submit" variant="contained" color="primary">
                    + CREATE NEW COURSE
                </Button>
            </form>
        </div>
    );
}

export default CreateCourse;