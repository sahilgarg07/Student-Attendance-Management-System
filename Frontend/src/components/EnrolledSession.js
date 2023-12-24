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
    TextField,

} from '@mui/material';
// import { TimePicker } from '@mui/x-date-pickers';

import axiosInstance from "../axios";
import {useSelector} from "react-redux";
import {json, useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

const EnrolledSession = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [courseName, setcourseName] = useState("");
    // const [verificationCode, setverificationCode] = useState("");

    //Need to take the date and location automatically, no need for user to enter them, just for temporary purposes
    const [date, setDate] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [loc, setLocation] = useState("");
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // const [courseCode, setcourseCode] = useState("");
    // const [opencourseCode, setopencourseCode] = useState(false);

    const location=useLocation();

    const {name_of_course} = location.state || {};
    console.log(name_of_course);

    const person = useSelector((state) => {
        return state.persons.person;
    });
    
    const navigate = useNavigate();
    
    const handleClickCourse = async () =>{
       await navigate("/dash");
    }


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
    const [datasessions,setDataSessions]=useState([])

    useEffect(() => {
        const fetchDataSession = async () => {
            try {
                const response = await axiosInstance.post("Home/show_sessions", { course_name: name_of_course });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setDataSessions(courseData);
            } catch (error) {
                console.error('Error fetching data Sessions:', error);
            }
        };

        fetchDataSession();

    }, []); 


    const [dataActiveSessions,setActiveDataSessions]=useState([])  


    useEffect(() => {
        const fetchActiveDataSession = async () => {
            try {
                const response = await axiosInstance.post("Home/show_active_sessions", { course_name: name_of_course });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setActiveDataSessions(courseData);
            } catch (error) {
                console.error('Error fetching data Sessions:', error);
            }
        };

        fetchActiveDataSession();

    }, []); 
////////////////////////////////////////////////




    // const handlecourseNameChange = (event) => {
    //     setcourseName(event.target.value);
    // };

//////////////////////////////Adjust date and location function so that it can be detected automatically////////////////////////////////////////
    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const handleStartTime = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTime = (event) => {
        setEndTime(event.target.value);
    };

    const handleLoc = (event) => {
        setLocation(event.target.value);
    };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    const handleSubmitSession =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/create", {course_name:name_of_course,date:date,start_time:start_time,end_time:end_time,coords:loc})
            console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend of course in session page:', error);
        }

    };

///////////////////////////////////////////////////////////////////
    const actions = [
        {icon: <AddIcon/>, name: 'Add'},
        {icon: <EditIcon/>, name: 'Edit'},
        {icon: <DeleteIcon/>, name: 'Delete'},
    ];


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
                <Tab label="All Sessions"/>
                <Tab label="Active Sessions"/>
                
            </Tabs>
            {selectedTab === 0 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {datasessions.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" >

                                    <ListItemText
                                        primary={item.date}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                From {item.start_time} to {item.end_time}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>


                </div>
            )}

            {selectedTab === 1 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {dataActiveSessions.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" >

                                    <ListItemText
                                        primary={item.date}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                From {item.start_time} to {item.end_time}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>


                </div>
            )}
           
           


        </div>
    );
};

export default EnrolledSession;
