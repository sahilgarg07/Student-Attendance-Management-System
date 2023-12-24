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

const CourseSession = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [courseName, setcourseName] = useState("");
    // const [verificationCode, setverificationCode] = useState("");

    //Need to take the date and location automatically, no need for user to enter them, just for temporary purposes
    const [date, setDate] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(0.0);
    const [loading,setLoading]=useState(0.0);

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

    // const handleTabChange = (event, newValue) => {
    //     setSelectedTab(newValue);
    // };
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
////////////////////////////////////////////////




    // const handlecourseNameChange = (event) => {
    //     setcourseName(event.target.value);
    // };

//////////////////////////////////////////////////////////////////////
    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const handleStartTime = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTime = (event) => {
        setEndTime(event.target.value);
    };


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// useEffect(() => {
    const  getCoords =()=>{
    // Get user's location
        navigator.geolocation.getCurrentPosition(
            function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            console.log("Hello");
            console.log(userLat);
            console.log(userLon);
            setLat(userLat);
            setLon(userLon);
            setLoading(false);
            },
            function (error) {
            console.error("Error getting user's location:", error);
            }
        );
    }

    useEffect(() =>{
        getCoords();
        },[]
    );


// }, []);

    

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
 
            const response = await axiosInstance.post("/Home/create", {course_name:name_of_course,date:date,start_time:start_time,end_time:end_time,lat:lat,lon:lon})
            // console.log(response)
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
          {!loading ? (
              <p>Still Loading the Content</p>
          ) : (
            <>
                <Tabs
                value={selectedTab}
                style={{width: '950px'}}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#007bff'
                    },
                }}
                sx={{marginBottom: '20px'}}
                >
                <Tab label={name_of_course}/>

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
                {/********************************Enrolled Speed Dial Changes start************************************************** */}
                    <div className="speed-dial">
                        <SpeedDial
                            ariaLabel="SpeedDial example"
                            icon={<SpeedDialIcon/>}
                            onClose={handleSpeedDialClose}
                            onOpen={handleSpeedDialOpen}
                            open={open}
                            direction="up" // Change direction as needed
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={handleActionClick}
                                />
                            ))}
                        </SpeedDial>
                    </div>
                    {/* Dialog for the pop-up */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        <DialogTitle id="dialog-title">{"Create New Session"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="dialog-description">
                                <TextField
                                    label="Select Date"
                                    type="date"
                                    value={date}
                                    onChange={handleDate}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{ marginTop: '16px',marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Select Start Time"
                                    type="time"
                                    value={start_time}
                                    onChange={handleStartTime}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                />                                
                                <TextField
                                    label="Select End Time"
                                    type="time"
                                    value={end_time}
                                    onChange={handleEndTime}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                /> 

                            </DialogContentText>
                            

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitSession} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                {/****************************************Enrolled Speed Dial Changes End****************************************** */}
                </div>
                )} 
            </>
          )}
        </div>
      );
      
};

export default CourseSession;

