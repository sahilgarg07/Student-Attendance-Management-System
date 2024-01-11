import React, {useEffect, useState} from 'react';
import '../styles/componentStyle.css';
import {Tabs, Tab, ListItemText, Divider, ListItem, List} from '@mui/material';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
// import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from '@mui/material/Icon';
import {
    Typography,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField
} from '@mui/material';
import axiosInstance from "../axios";
import {useSelector} from "react-redux";
import {json, useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

const StudentsInSession = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [verificationCode, setverificationCode] = useState("");
    const [student_name,setStudentName]=useState("");
    const [student_username,setStudentUserName]=useState("");


    



    const navigate = useNavigate();
    const location=useLocation();
    
    const {name_of_course,username_of_person,date_of_session,lat_of_session,lon_of_session,start_time_of_session,end_time_of_session} = location.state || {};


    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const [open, setOpen] = useState(false);

    const handleSpeedDialOpen = () => {
        setOpen(true);
    };

    const handleSpeedDialClose = () => {
        setOpen(false);
    };






////////////////////////////////////////////////
    const [studentsMarked,setStudentsMarked]=useState([])

    // useEffect(() => {
        const fetchStudentsMarked = async () => {
            try {
                const response = await axiosInstance.post("Home/show_students_in_session", { course_name:name_of_course, date:date_of_session,start_time:start_time_of_session,end_time:end_time_of_session,lat:lat_of_session,lon:lon_of_session });
                if(response.data.msg==="course_name, date, start_time, and end_time fields are required."){
                    alert(response.data.msg);
                }
                else if(response.data.msg==="Session not found."){
                    alert(response.data.msg);
                }
                else if(response.data.msg==="Attendance records not found."){
                    alert(response.data.msg);
                }
                else{
                    const { course_data: courseData } = response.data;
                    setStudentsMarked(courseData);
                }


            } catch (error) {
                console.error('Error fetching data Students in session data:', error);
            }
        };

        fetchStudentsMarked();

    // }, []); 
////////////////////////////////////////////////



    const handleverificationCodeChange = (event) => {
        setverificationCode(event.target.value);
    };

    const handleStudentName = (event) => {
        setStudentName(event.target.value);
    };

    const handleStudentUserName = (event) => {
        setStudentUserName(event.target.value);
    };


    const handleActionClick = () => {
        handleSpeedDialClose();
        // Open the dialog when a SpeedDialAction is clicked
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };


    // const handleSubmit =async () => {
    //     // Handle the submitted value (rangeInput) her
    //    const response = await axiosInstance.post("/Home/course", {name: courseName, teacher:person.username})
    //     console.log(response)
    //     handleDialogClose(); // Close the dialog after submitting
    // };






////////////////////////////////////////////////////////////////////////////
    const handleSubmitEnrolled =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/attendance", {course_name:name_of_course,date:date_of_session,start_time:start_time_of_session, end_time:end_time_of_session,lat:lat_of_session,lon:lon_of_session, student_Id:student_username})
            if(response.data.msg==="Person is not enrolled in the course."){
                alert(response.data.msg);
            }
            console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend from creation of course:', error);
        }

    };

///////////////////////////////////////////////////////////////////
    const actions = [
        // {icon: <AddIcon/>, name: 'Add'},
        {icon: <EditIcon/>, name: 'Edit'},
        // {icon: <DeleteIcon/>, name: 'Delete'},
    ];

    // const dataenroll = [
    //     {name: 'CS102', description: 'Software Labs'},
    //     {name: 'CS210', description: 'Digital Circuits and Labs'},
    //     {name: 'CS222', description: 'Algorithm Design'}]
    // const datacreate = [
    //     {name: 'CS103', description: 'Software Labs'},
    //     {name: 'CS216', description: 'Digital Circuits and Labs'},
    //     {name: 'CS224', description: 'Algorithm Design'}]
    
    return (
        <div className="dash">
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                style={{width: '950px'}}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#007bff'
                    },
                }}
                sx={{marginBottom: '20px'}}
            >
                <Tab label="Attendance"/>
            </Tabs>
            {selectedTab === 0 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {studentsMarked.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start">

                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                {item.rollNumber}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>
{/********************************Enrolled Speed Dial Changes start************************************************** */}
                    <div className="speed-dial">
                        <EditIcon onClick={handleActionClick}/>
                    </div>
                    {/* Dialog for the pop-up */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        <DialogTitle id="dialog-title">{"Mark Attendance"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="dialog-description">
                                <TextField
                                    label="Enter Student's Name"
                                    variant="filled"
                                    value={student_name}
                                    onChange={handleStudentName}
                                    fullWidth
                                />

                                <TextField
                                    label="Enter the username"
                                    variant="filled"
                                    value={student_username}
                                    onChange={handleStudentUserName}
                                    fullWidth
                                />



                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitEnrolled} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}

        </div>
    );
};

export default StudentsInSession;
